<script lang="ts">
  import Sidebar from "$lib/components/ui/Sidebar.svelte";

  let { children } = $props();
  let isSidebarOpen = $state(true);

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<main class="page-container" style="--sidebar-width: {isSidebarOpen ? '260px' : '64px'}">
  <Sidebar bind:isSidebarOpen onToggle={toggleSidebar}/>
  <div class="page-nav">
    {@render children()}
  </div>
</main>

<style>
  .page-container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    min-height: 100vh;
    box-sizing: border-box;
    transition: grid-template-columns 0.2s ease;
  }

  .page-nav {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    padding: 2.5rem;
    box-sizing: border-box;
    height: 100vh;
    overflow: hidden;
  }

  :global(.page-header) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 24px;
    flex-shrink: 0;
  }

  :global(.table-wrapper) {
    position: relative;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
</style>