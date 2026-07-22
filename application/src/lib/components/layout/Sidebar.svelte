<script lang="ts">
  import { page } from "$app/state";
  import StorageIndicator from "../ui/StorageIndicator.svelte";

  interface Props {
    isSidebarOpen?: boolean;
    onToggle: () => void;
  }

  let { 
    isSidebarOpen = $bindable(true), 
    onToggle,
  }: Props = $props();
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
    <div class="sidebar-bottom">
      <StorageIndicator/>
    </div>
</aside>

<style>
  .sidebar {
    background-color: var(--bg-color);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.2s ease;
    height: calc(100vh - 60px);
    max-height: 100vh; 
    width: 260px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .sidebar.collapsed {
    width: 64px;
    align-items: center;
  }

  .sidebar-top-actions {
    display: flex;
    justify-content: flex-end; 
    padding: 0.75rem 1rem 0 1rem;
    flex-shrink: 0;
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
    background-color: var(--bg-elevated);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0.5rem;
    flex-grow: 1; 
    overflow-y: auto;
    min-height: 0; 
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
    flex-shrink: 0;
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
    flex-shrink: 0;
  }

  .sidebar-bottom {
    padding: 1rem;
    border-top: 1px solid var(--border-color, #e0e0e0);
    flex-shrink: 0;
    width: 100%;             
    box-sizing: border-box;
    opacity: 1;
    max-height: 150px;
    overflow: hidden;
    transition: opacity 0.2s ease, max-height 0.2s ease, padding 0.2s ease;
  }

  .sidebar.collapsed .sidebar-bottom {
    display: none;
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-top-color: transparent;
    pointer-events: none;
    width: 64px; 
  }
</style>