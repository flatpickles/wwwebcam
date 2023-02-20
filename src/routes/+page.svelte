<script lang="ts">
    import 'ress';
	import { onMount } from 'svelte';
    import REGL from 'regl';

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
        const regl = REGL(canvasElement);

        const drawFrame = regl<Uniforms, Attributes, Props>({
            frag: `
            precision mediump float;
            uniform vec2 renderSize;
            uniform vec2 videoSize;
            uniform sampler2D videoFrame;
            varying vec2 uv;
            void main () {
                vec2 texCoords = uv;
                float renderRatio = renderSize.x / renderSize.y;
                float videoRatio = videoSize.x / videoSize.y;

                if (renderRatio < videoRatio) {
                    float relativeWidth = renderRatio / videoRatio;
                    texCoords.x *= relativeWidth;
                    texCoords.x += (1.0 - relativeWidth) / 2.0;
                } else {
                    float relativeHeight = videoRatio / renderRatio;
                    texCoords.y *= relativeHeight;
                    texCoords.y += (1.0 - relativeHeight) / 2.0;
                }

                vec4 texVal = texture2D(videoFrame, texCoords);
                gl_FragColor = vec4(texVal.g, texVal.b, texVal.r, 1.0);
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
                2, 2]
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
        // setup canvas
        // todo: update with resize
        var devicePixelRatio = window.devicePixelRatio || 1;
        canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
        canvasElement.height = canvasElement.clientHeight * devicePixelRatio;

		startStream(selfieMode);
        devices = await navigator.mediaDevices.enumerateDevices();
        devices = devices.filter((device) => device.kind === 'videoinput');
	});
    
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

    function clicked() {
        // todo: can it flip?
        selfieMode = !selfieMode;
        startStream(selfieMode);
    }
</script>

<svelte:head>
    <title>World Wide Webcam</title>
</svelte:head>

<div class="video-overlay">
    {#if errorString}
        <div class="error">
            {errorString}
        </div>
    {/if}

    <button on:click={clicked}>
        Flip!
    </button>

    <div class="device-list">
        {#if devices}
            {#each devices as device} 
                <li>{device.label}</li>
            {/each}
        {/if}
    </div>
</div>

<div class="video-wrapper">
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
</div>

<style>
    button {
        background-color: white;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    .video-wrapper {
        width: 100vw;
        height: 100vh;

        display: flex;
        background-color: black;
    }

    .video-element {
        visibility: hidden;
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        z-index: -1;
    }

    .canvas-element {
        width: 100%;
        height: 100%;
    }

    .video-overlay {
        position: absolute;
        width: 100%;
        padding: 1em;
        z-index: 1;

        display: flex;
        flex-direction: column;

        background-color: rgba(0, 0, 0, 50%);
        color: white;
    }
</style>
