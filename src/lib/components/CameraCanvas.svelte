<script lang="ts">
	import EffectProcessor from '$lib/EffectProcessor';
	import WebCam from '$lib/WebCam';
	import { onMount } from 'svelte';

	let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;

    export function flip() {
        console.log('Flip camera.');
    }

    export function capture() {
        console.log('Capture canvas image.');
    }

    export function enableEffect(enabled: boolean) {
        console.log('Enable effect.');
    }

	onMount(async () => {
        // Setup canvas sizing
        window.onresize = updateCanvasShape;
        setTimeout(updateCanvasShape, 0);

        // Start video
        const webCam = new WebCam(videoElement);
        webCam.start().then(() => {
            const processor = new EffectProcessor(videoElement, canvasElement);
            processor.start();
        });
	});
    
    function updateCanvasShape() {
        var devicePixelRatio = window.devicePixelRatio || 1;
        canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
        canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
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
