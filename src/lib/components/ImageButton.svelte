<script lang="ts">
    export let src: string;
    export let size: string;
</script>

<button style="--size: {size}">
    <img alt={src} src={src} />
</button>

<style>
    button {
        filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.75));
        transition: transform 0.05s ease-out;
    }

    button:active {
        transform: scale(0.97, 0.97);
    }

    img {
        width: var(--size);
        height: var(--size);
    }

</style>