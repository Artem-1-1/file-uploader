<script lang="ts">
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
  import FileSidebar from "$lib/components/files/FileSidebar.svelte";
  import { fileSidebarStore } from "$lib/stores/fileSidebar.svelte";

  let { children } = $props();
  let isSidebarOpen = $state(true);

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<main class="page-container" class:file-sidebar-open={$fileSidebarStore.isOpen} style="--sidebar-width: {isSidebarOpen ? '260px' : '64px'}">
  <Sidebar bind:isSidebarOpen onToggle={toggleSidebar}/>
  <div class="page-nav">
    {@render children()}
  </div>

  {#if $fileSidebarStore.isOpen}
    <FileSidebar 
      file={$fileSidebarStore.file} 
      onClose={() => fileSidebarStore.close()} 
    />
  {/if}
</main>

<style>
  .page-container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    height: 100vh;
    box-sizing: border-box;
    transition: grid-template-columns 0.2s ease;
    overflow: hidden;
  }

  .page-container.file-sidebar-open {
    grid-template-columns: var(--sidebar-width) 1fr 300px;
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
    overflow-y: auto;
  }
</style>