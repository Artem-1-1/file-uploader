<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	let { children, data } : {
		children: () => any;
		data: { user: { name: string; role: string } | null }
	} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar user={data.user} />

{@render children()}
