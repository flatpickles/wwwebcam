<script lang="ts">
    export let src: string;
</script>

<button>
    <img alt={src} src={src} />
</button>

<style>
    button {
        filter: drop-shadow(0 0 0.2rem rgba(0, 0, 0, 0.75));
        transition: filter .05s ease-out, transform .05s ease-out;
    }

    button:active {
        filter: drop-shadow(0 0 0.1rem rgba(0, 0, 0, 0.5));
        transform: scale(0.95,0.95);
    }

</style>