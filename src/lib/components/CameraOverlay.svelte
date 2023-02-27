<script lang="ts">
    import ImageButton from './ImageButton.svelte';
    import aboutImg from '$lib/assets/about.svg';
    import captureImg from '$lib/assets/capture.svg';
    import closeImg from '$lib/assets/close.svg';
    import effectsImg from '$lib/assets/effects.svg';
    import flipImg from '$lib/assets/flip.svg';
</script>

<div class="overlay">
    <div class="top icons">
        <ImageButton src={aboutImg} />
    </div>
    <div class="bottom icons">
        <ImageButton src={flipImg} />
        <ImageButton src={captureImg} />
        <ImageButton src={effectsImg} />
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