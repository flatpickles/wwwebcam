<script lang="ts">
    import REGL from 'regl';
    import createQuad from 'primitive-quad';
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
        inputSize: REGL.Vec2,
        inputImage: REGL.Texture;
    }

    interface Attributes {
        position: number[];
    }

    interface Props {
        renderSize: REGL.Vec2,
        inputSize: REGL.Vec2,
        inputImage: REGL.Texture;
    }

    // Display stuff

    function startRegl() {
        updateCanvasShape(); // as late as possible

        const quad = createQuad();
        const regl = REGL(canvasElement);
        const drawFrame = regl<Uniforms, Attributes, Props>({
            frag: `
            precision mediump float;
            uniform sampler2D inputImage;
            varying vec2 uv;
            varying vec2 lookup;
            
            void main () {
                vec4 texVal = texture2D(inputImage, lookup);
                gl_FragColor = vec4(vec3(texVal.g), 1.0);
            }`,

            vert: `
            precision mediump float;
            attribute vec3 position;
            uniform vec2 renderSize;
            uniform vec2 inputSize;
            varying vec2 uv;
            varying vec2 lookup;

            void main () {
                // Set render positions
                gl_Position = vec4(position.xyz, 1.0);
                uv = gl_Position.xy * 0.5 + 0.5;

                // Calculate aspect-corrected texture lookup position
                float renderRatio = renderSize.x / renderSize.y;
                float videoRatio = inputSize.x / inputSize.y;
                float relativeWidth = min(1.0, renderRatio / videoRatio);
                float relativeHeight = min(1.0, videoRatio / renderRatio);
                lookup.x = (1.0 - uv.x) * relativeWidth + (1.0 - relativeWidth) / 2.0;
                lookup.y = (1.0 - uv.y) * relativeHeight + (1.0 - relativeHeight) / 2.0;
            }`,

            attributes: {
                position: quad.positions
            },
            elements: quad.cells,

            uniforms: {
                renderSize: regl.prop<Uniforms, 'renderSize'>('renderSize'),
                inputSize: regl.prop<Uniforms, 'inputSize'>('inputSize'),
                inputImage: regl.prop<Uniforms, 'inputImage'>('inputImage')
            }
        });

        const cameraTexture = regl.texture(); // construct texture
        regl.frame(() => {
            regl.clear({
                color: [0, 0, 0, 1]
            });
            drawFrame({
                // todo: canvasElement is null sometimes?
                renderSize: [canvasElement.width, canvasElement.height],
                inputSize: [videoElement.videoWidth, videoElement.videoHeight],
                inputImage: cameraTexture({
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
<video
	class="video-element"
	autoplay={true}
	playsInline={true}
	muted={true}
	bind:this={videoElement}
/>
<canvas class="canvas-element" bind:this={canvasElement} />

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
