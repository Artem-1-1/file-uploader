<script>
  import { themeSignal, toggleTheme } from "$lib/stores/theme.svelte";
</script>

<button onclick={toggleTheme} aria-label="theme-toggle">
  {#if themeSignal.current === "dark"}
		<img src="/images/sun.svg" alt="light-theme">
	{:else}
		<img src="/images/moon.svg" alt="dark-theme">
	{/if}		
</button>

<style>
  button {
		color: oklch(21% 0.034 264.665);
		background-color: transparent;
		border: none;
		border-radius: 50%;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	button img {
		width: 32px;
		height: 32px;
	}

  :global(body.dark-mode) button {
		filter: invert();
	}
</style>