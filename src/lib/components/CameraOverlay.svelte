<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import AboutOverlay from './AboutOverlay.svelte';
    import ImageButton from './ImageButton.svelte';
    import captureImg from '$lib/assets/capture.svg';
    import flipImg from '$lib/assets/flip.svg';
    import starImg from '$lib/assets/star.svg';
    import starImgFilled from '$lib/assets/star_filled.svg';

    const dispatch = createEventDispatcher();
    let effectEnabled = false;

    function flipClicked() {
        dispatch('flip', {});
    }

    function captureClicked() {
        dispatch('capture', {});
    }

    function effectClicked() {
        effectEnabled = !effectEnabled;
        dispatch('effect', {
            enabled: effectEnabled
        });
    }
</script>

<div class="overlay">
    <div class="top icons">
        <AboutOverlay />
    </div>
    <div class="bottom icons">
        <ImageButton src={flipImg} on:click={flipClicked} size="3rem" />
        <ImageButton src={captureImg} on:click={captureClicked} size="4rem" />
        <ImageButton src={effectEnabled ? starImgFilled : starImg} on:click={effectClicked} size="3rem" />
    </div>
</div>

<style>
    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 1rem;
        z-index: 1;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .icons {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .top {
        justify-content: flex-end;
    }

    .bottom {
        justify-content: center;
    }
</style>