<script>
  import { toggleTheme } from "$lib/stores/theme.svelte";
</script>

<button onclick={toggleTheme}>
  Theme
</button>

<style>
  button {
		background-color: #f76027;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem;
		text-transform: uppercase;
		
	}

  :global(body.dark-mode) button {
		background-color: #0084f6;
		color: white;
	}
</style>