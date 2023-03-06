<script lang="ts">
	import EffectProcessor from '$lib/EffectProcessor';
	import WebCam from '$lib/WebCam';
	import { onMount } from 'svelte';

    // Just one effect, for now!
    import defaultFrag from '../shaders/default.frag?raw';
    import effectFrag from '../shaders/bw.frag?raw';

	let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;

    let frontFacing = true;
    let webCam: WebCam;
    let effectProcessor: EffectProcessor;

    export function flip() {
        frontFacing = !frontFacing;
        webCam.start(frontFacing ? 'user' : 'environment');
        effectProcessor.flipX = frontFacing;
    }

    export function capture() {
        effectProcessor.saveNextFrame('photo');
    }

    export function enableEffect(enabled: boolean) {
        effectProcessor.start(enabled ? effectFrag : defaultFrag);
    }

	onMount(async () => {
        // Setup canvas sizing
        window.onresize = updateCanvasShape;
        setTimeout(updateCanvasShape, 0);

        // Start video
        webCam = new WebCam(videoElement);
        webCam.start().then(() => {
            effectProcessor = new EffectProcessor(videoElement, canvasElement);
            effectProcessor.start(); // start with default (passthrough) shader
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
