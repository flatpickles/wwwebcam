<script lang="ts">
    import REGL from 'regl';
	import { onMount } from 'svelte';

    // todo: external interface
    export const flippable = false;
    export function flip() {}
    export function setPixelShader() {};

	let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let devices: MediaDeviceInfo[];
    let errorString: string;
    let selfieMode = true;

    // Type definitions

    interface Uniforms {
        renderSize: REGL.Vec2,
        videoSize: REGL.Vec2,
        videoFrame: REGL.Texture;
    }

    interface Attributes {
        position: number[];
    }

    interface Props {
        renderSize: REGL.Vec2,
        videoSize: REGL.Vec2,
        videoFrame: REGL.Texture;
    }


    // Display stuff

    function startRegl() {
        updateCanvasShape(); // as late as possible

        const regl = REGL(canvasElement);
        const drawFrame = regl<Uniforms, Attributes, Props>({
            frag: `
            precision mediump float;
            uniform vec2 renderSize;
            uniform vec2 videoSize;
            uniform sampler2D videoFrame;
            varying vec2 uv;
            void main () {
                // Calculate texture lookup position
                float renderRatio = renderSize.x / renderSize.y;
                float videoRatio = videoSize.x / videoSize.y;
                float relativeWidth = min(1.0, renderRatio / videoRatio);
                float relativeHeight = min(1.0, videoRatio / renderRatio);
                float lookupX = uv.x * relativeWidth + (1.0 - relativeWidth) / 2.0;
                float lookupY = uv.y * relativeHeight + (1.0 - relativeHeight) / 2.0;

                // Lookup and output
                vec4 texVal = texture2D(videoFrame, vec2(lookupX, lookupY));
                gl_FragColor = vec4(texVal.g, texVal.r, texVal.b, 1.0);
            }`,

            vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main () {
                uv = position;
                gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
            }`,

            attributes: {
                position: [
                    -2, 0,
                    0, -2,
                    2, 2
                ]
            },

            uniforms: {
                renderSize: regl.prop<Uniforms, 'renderSize'>('renderSize'),
                videoSize: regl.prop<Uniforms, 'videoSize'>('videoSize'),
                videoFrame: regl.prop<Uniforms, 'videoFrame'>('videoFrame')
            },

            count: 3
        });

        const cameraTexture = regl.texture(); // construct texture
        regl.frame(() => {
            regl.clear({
                color: [0, 0, 0, 1]
            });
            drawFrame({
                // todo: canvasElement is null sometimes?
                renderSize: [canvasElement.width, canvasElement.height],
                videoSize: [videoElement.videoWidth, videoElement.videoHeight],
                videoFrame: cameraTexture({
                    data: videoElement,
                    mag: 'linear',
                    min: 'linear'
                }) // update and use texture
            });
        });
    }

    // Lifecycle & interaction stuff

	onMount(async () => {
        // Setup canvas sizing
        window.onresize = updateCanvasShape;

        // Start video
		startStream(selfieMode);
        devices = await navigator.mediaDevices.enumerateDevices();
        devices = devices.filter((device) => device.kind === 'videoinput');
	});
    
    function updateCanvasShape() {
        var devicePixelRatio = window.devicePixelRatio || 1;
        canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
        canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
    }

    function startStream(frontFacing: boolean) {
        if (!navigator.mediaDevices.getUserMedia) {
            errorString = 'getUserMedia undefined';
            return;
        };

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: frontFacing ? 'user' : 'environment'
                }
            })
            .then(function (stream) {
                videoElement.srcObject = stream;
                videoElement.onloadeddata = startRegl;
            })
            .catch((error) => {
                errorString = error.message;
            });
    }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video class="video-element"
    autoplay={true}
    playsInline={true}
    muted={true}
    bind:this={videoElement}
/>
<canvas class="canvas-element" 
    bind:this={canvasElement}
/>

<style>
    .video-element {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        z-index: -1;
    }

    .canvas-element {
        width: 100%;
        height: 100%;
    }
</style>