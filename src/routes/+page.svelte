<script lang="ts">
    import 'ress';
	import { onMount } from 'svelte';
    import REGL, { type Regl } from 'regl';

	let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let devices: MediaDeviceInfo[];
    let errorString: string;
    let selfieMode = true;

    // NEXT: try fixing type errors with this:
    // https://github.com/regl-project/regl/blob/master/example/typescript/dynamic.ts#L49


    interface Uniforms {
        videoFrame: REGL.Texture;
    }

    interface Attributes {
        position: number[];
    }

    interface Props {
        videoFrame: REGL.Texture;
    }

    function startRegl() {
        const regl = REGL(canvasElement);

        const drawFrame = regl<Uniforms, Attributes, Props>({
            frag: `
            precision mediump float;
            uniform sampler2D videoFrame;
            varying vec2 uv;
            void main () {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
                gl_FragColor = texture2D(videoFrame, uv);
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
                videoFrame: regl.prop<Uniforms, 'videoFrame'>('videoFrame')
            },

            count: 3
        });

        regl.frame(() => {
            regl.clear({
                color: [0, 0, 0, 1]
            });
            drawFrame({ videoFrame: regl.texture(videoElement) });
        });
    }

	onMount(async () => {
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
        width: 100%;
        object-fit: cover;
        transform: rotateY(180deg);
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
