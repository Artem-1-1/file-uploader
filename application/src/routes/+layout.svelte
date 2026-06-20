<script lang="ts">
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar />

{@render children()}
