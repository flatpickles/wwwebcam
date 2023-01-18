<script lang="ts">
    import 'ress';

	import { onMount } from 'svelte';

	let videoElement: HTMLVideoElement;

	onMount(() => {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(function (stream) {
					videoElement.srcObject = stream;
				})
				.catch((error) => {
					console.log(error);
				});
		}
	});
</script>

<svelte:head>
    <title>World Wide Webcam</title>
</svelte:head>

<div class="page-wrapper">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="video-element"
        autoplay={true}
        playsInline={true}
        muted={true}
        bind:this={videoElement}
    />
</div>

<style>
    .page-wrapper {
        width: 100vw;
        height: 100vh;

        display: flex;
        background-color: black;
    }
    .video-element {
        flex-grow: 1;
    }
</style>
