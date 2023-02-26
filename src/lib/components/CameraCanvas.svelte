<script lang="ts">
	import EffectProcessor from '$lib/EffectProcessor';
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
                videoElement.onloadeddata = () => {
                    updateCanvasShape();

                    const processor = new EffectProcessor(videoElement, canvasElement);
                    processor.start();
                }
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
