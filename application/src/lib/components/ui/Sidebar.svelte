<script lang="ts">
  import { page } from "$app/state";
  let { isSidebarOpen = $bindable(true), onToggle } = $props();
</script>

<aside class="sidebar" class:collapsed={!isSidebarOpen}>
  <div class="sidebar-top-actions">
    <button class="toggle-btn" onclick={onToggle} aria-label="Toggle Sidebar">
      {#if isSidebarOpen}
        <img src="/images/arrowheads-left.svg" alt="Close" class="icon"/>
      {:else}
        <img src="/images/right-arrowheads.svg" alt="Close" class="icon"/>
      {/if}
    </button>
  </div>

  <nav class="sidebar-nav">
    <a href="/home" class="nav-link" class:active={page.url.pathname === "/home"}>
      <img src="/images/cloud.svg" alt="cloud icon" class="icon">
      {#if isSidebarOpen}
        <div class="nav-label">All Files</div>
      {/if}
    </a>
    <a href="/basket" class="nav-link" class:active={page.url.pathname === "/basket"}>
      <img src="/images/garbage-basket.svg" alt="basket icon" class="icon">
      {#if isSidebarOpen}
        <div class="nav-label">Basket</div>
      {/if}
    </a>
  </nav>
</aside>

<style>
  .sidebar {
    background-color: var(--dropdown-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.2s ease;
    height: 100%;
    width: 260px;
  }

  .sidebar.collapsed {
    width: 64px;
    align-items: center;
  }

  .sidebar-top-actions {
    display: flex;
    justify-content: flex-end; 
    padding: 0.75rem 1rem 0 1rem;
  }

  .sidebar.collapsed {
    display: flex;
    justify-content: flex-start;
    padding: 0.75rem 0 0 0;
  }

  .toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
    width: 40px;
    height: 40px;
  }

  .toggle-btn:hover,
  .nav-link:hover {
    background-color: var(--dropdown-bg-hover);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0.5rem;
  }

  .sidebar.collapsed .sidebar-nav {
    align-items: center;
    padding: 0.5rem 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.75rem 1rem;
    color: var(--text-color);
    opacity: 0.8;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.15s, color 0.15s, opacity 0.15s;
  }

  .nav-link.active {
    border-left: 4px solid var(--light-green);
    color: var(--text-color);
    font-weight: 600;
    opacity: 1;
    text-decoration: none;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
  }

  .icon {
    width: 24px;
    height: 24px;
    filter: var(--svg-invert);
  }
</style>