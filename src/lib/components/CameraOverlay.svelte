<script lang="ts">
	import AboutOverlay from './AboutOverlay.svelte';
    import ImageButton from './ImageButton.svelte';
    import captureImg from '$lib/assets/capture.svg';
    import effectsImg from '$lib/assets/effects.svg';
    import flipImg from '$lib/assets/flip.svg';
</script>

<div class="overlay">
    <div class="top icons">
        <AboutOverlay />
    </div>
    <div class="bottom icons">
        <ImageButton src={flipImg} size="3rem" />
        <ImageButton src={captureImg} size="4rem" />
        <ImageButton src={effectsImg} size="3rem" />
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