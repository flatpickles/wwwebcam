<script lang="ts">
    import CameraCanvas from '$lib/components/CameraCanvas.svelte';

    function clicked() {
        // todo: can it flip?
        // selfieMode = !selfieMode;
        // startStream(selfieMode);
    }
</script>

<svelte:head>
    <title>World Wide Webcam</title>
</svelte:head>

<div class="video-overlay">
    <!-- {#if errorString}
        <div class="error">
            {errorString}
        </div>
    {/if} -->

    <button on:click={clicked}>
        Flip!
    </button>

    <!-- <div class="device-list">
        {#if devices}
            {#each devices as device} 
                <li>{device.label}</li>
            {/each}
        {/if}
    </div> -->
</div>

<CameraCanvas />

<style>
    button {
        background-color: white;
        margin-top: 1em;
        margin-bottom: 1em;
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
