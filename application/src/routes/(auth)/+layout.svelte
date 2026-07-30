<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children } : LayoutProps = $props();

  $effect(() => {
    document.body.classList.add('auth-page');
    
    return () => {
      document.body.classList.remove('auth-page');
    };
  });
</script>

<main class="auth-page">
    {@render children()}
</main>

<style>
  :global(body.auth-page header) {
    --bg-color: linear-gradient(45deg, #8ec5fc 0.000%, #8dd3ff 25.000%, #a1d8ff 50.000%, #c1d2ff 75.000%, #e0c3ff 100.000%);
  }

  .auth-page {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
    background: linear-gradient(45deg, #8ec5fc 0.000%, #8dd3ff 25.000%, #a1d8ff 50.000%, #c1d2ff 75.000%, #e0c3ff 100.000%);
  }

  @media (min-width: 640px) {
		.auth-page {
			padding: 2rem;
		}
	}
</style>