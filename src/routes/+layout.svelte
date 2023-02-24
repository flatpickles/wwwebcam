<script lang="ts">
    import 'ress';
    import '../app.css';
	import { onMount } from 'svelte';

    let vh: number;

	onMount(async () => {
        // Set up page sizing
        const setVH = () => { vh = window.innerHeight * 0.01; };
        window.addEventListener('resize', setVH);
        setVH();
    });
</script>

<div class="app-wrapper" style="--vh: {vh}">
    <slot></slot>
</div>

<style>
    .app-wrapper {
        width: 100vw;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100px);

        display: flex;
        background-color: black;
    }
</style>