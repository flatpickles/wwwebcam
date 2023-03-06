<script lang="ts">
	import { onMount } from 'svelte';
    import aboutImg from '$lib/assets/about.svg';
    import closeImg from '$lib/assets/close.svg';
    import ImageButton from './ImageButton.svelte';

    export let show = false;
    let buttonContainer: Node;
    let aboutContainer: Node;

    function toggleShow() {
        show = !show;
    }

    onMount(() => {
        // Close overlay when clicking outside of it
        window.addEventListener('mousedown', function(event) {
            if (show && event.target &&
                !aboutContainer.contains(event.target as Node) &&
                !buttonContainer.contains(event.target as Node)) {
                show = false;
            };
        });
    });
</script>

<div class="button-container" bind:this={buttonContainer}>
    <ImageButton
        src={show ? closeImg : aboutImg}
        size="2rem"
        on:click={toggleShow}
    />
</div>

<div class="about-container" bind:this={aboutContainer} class:hidden={!show}>
    <p>
        <b>World Wide Webcam</b> is a prototype for a browser-based camera app. It's
        designed with mobile web in mind, but should work fine in your desktop browser of choice as
        well. The goal of this app is to explore multimedia limitations in the browser, and as
        expected, it's a far cry from your native camera. Maybe we'll get there someday!
    </p>

    <p>
        Built by <a href="https://flatpickles.com">flatpickles</a>.
        Read more <a href="https://github.com/flatpickles/wwwebcam">on GitHub</a>.
    </p>
</div>

<style>
    p:not(:first-child) {
        padding-top: 1rem;
    }

    a {
        color: white;
    }

    .about-container {
        position: absolute;
        top: 3.5rem;
        right: 1rem;
        padding: 1rem;
        margin-left: 1rem;

        max-width: 30rem;
        border-radius: 1rem;
        text-align: justify;
        font-size: 1.1rem;
        user-select: text;

        /* filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.75)); */
        transition: opacity 0.2s ease-out;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
    }

    .hidden {
        opacity: 0%;
    }
</style>