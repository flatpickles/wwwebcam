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
                // todo: doesn't seem we can prevent event in this case, i.e. other thing
                // will still be clicked upon, maybe janky
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
        <b>World Wide Webcam</b> is an experiment, exploring building a camera app in the browser.
        World Wide Webcam is an experiment, exploring building a camera app in the browser.
        World Wide Webcam is an experiment, exploring building a camera app in the browser.
        World Wide Webcam is an experiment, exploring building a camera app in the browser.
        World Wide Webcam is an experiment, exploring building a camera app in the browser.
        World Wide Webcam is an experiment, exploring building a camera app in the browser.
    </p>
</div>

<style>
    .about-container {
        position: absolute;
        top: 3.5rem;
        padding: 1rem;
        margin-left: 1rem;

        max-width: 30rem;
        border-radius: 1rem;
        text-align: justify;
        line-height: 1.3em;
        font-size: 1.1rem;

        /* todo: centralize some things */
        filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.75));
        transition: opacity 0.2s ease-out;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
    }

    .hidden {
        opacity: 0;
    }
</style>