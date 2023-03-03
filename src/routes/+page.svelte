<script lang="ts">
    import CameraCanvas from '$lib/components/CameraCanvas.svelte';
	import CameraOverlay from '$lib/components/CameraOverlay.svelte';

    let cameraCanvas: CameraCanvas;

    function effectUpdated(event: CustomEvent) {
        cameraCanvas.enableEffect(event.detail.enabled);
    }

</script>

<svelte:head>
    <title>World Wide Webcam</title>
</svelte:head>

<CameraCanvas bind:this={cameraCanvas} />
<CameraOverlay
    on:flip={cameraCanvas.flip}
    on:capture={cameraCanvas.capture}
    on:effect={effectUpdated}
/>
