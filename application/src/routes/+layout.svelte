<script lang="ts">
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { themeSignal } from '$lib/stores/theme.svelte';

	let { children, data } = $props();

	$effect(() => {
		const currentTheme = data.theme || 'light';
		
		themeSignal.current = currentTheme;

		const isDark = currentTheme === 'dark';
		document.documentElement.classList.toggle('dark-mode', isDark);
		document.body.classList.toggle('dark-mode', isDark);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar user={data.user} />

{@render children()}
