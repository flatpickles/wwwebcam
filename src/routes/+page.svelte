<script lang="ts">
    import 'ress';
	import { onMount } from 'svelte';

	let videoElement: HTMLVideoElement;
    let devices: MediaDeviceInfo[];
    let errorString: string;
    let selfieMode = true;

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
