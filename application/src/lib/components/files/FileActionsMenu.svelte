<script lang="ts">
  interface Props {
    fileId: string;
    isDeletedView?: boolean;
    canDownload?: boolean;
    onInfo?: (id: string) => void;
    onRename?: (id: string) => void;
    onRestore?: (id: string) => void;
    onDelete?: (id: string) => void;
  }

  let {
    fileId,
    isDeletedView = false,
    canDownload = false,
    onInfo,
    onRename,
    onRestore,
    onDelete,
  } : Props = $props();

  let isOpen = $state(false);

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }
</script>

<svelte:window onclick={closeMenu} />

<div class="menu-container">
  <button
    type="button"
    class="action-menu-btn"
    aria-label="Actions menu"
    onclick={toggleMenu}>
  <img src="/images/dot-menu-more.svg" alt="more actions" class="icon">
  </button>

  {#if isOpen}
    <div 
      class="dropdown-menu" 
      role="menu"
      tabindex="0" 
      onclick={(e) => e.stopPropagation()} 
      onkeydown={(e) => {
        e.stopPropagation();
        if (e.key === 'Escape') {
          closeMenu();
        }
      }}
      >
      {#if !isDeletedView}
        {#if canDownload}
          <a 
            href={`/api/files?fileId=${fileId}`} 
            download
            onclick={() => closeMenu()}
            class="button">
            <img src="/images/circled-down.svg" alt="Download" class="icon" />
            Download
          </a>
        {/if}
        {#if onRename}
          <button type="button" onclick={() => { onRename(fileId); closeMenu(); }}>
            <img src="/images/rename.svg" alt="Rename" class="icon" />
            Rename
          </button>
        {/if}
        {#if onInfo}
          <button type="button" onclick={() => { onInfo(fileId); closeMenu(); }}>
            <img src="/images/circled-info.svg" alt="File Information" class="icon" />
            Information
          </button>
        {/if}
        {#if onDelete}
          <button type="button" onclick={() => { onDelete(fileId); closeMenu(); }}>
            <img src="/images/garbage-basket.svg" alt="Garbage basket" class="icon" />
            Move to Basket
          </button>
        {/if}
      {:else}
        {#if onInfo}
          <button type="button" onclick={() => { onInfo(fileId); closeMenu(); }}>
            <img src="/images/circled-info.svg" alt="File Information" class="icon" />
            Information
          </button>
        {/if}
        {#if onRestore}
          <button type="button" onclick={() => { onRestore(fileId); closeMenu(); }}>
            <img src="/images/restore.svg" alt="Restore" class="icon" />
            Restore
          </button>
        {/if}
        {#if onDelete}
          <button type="button" class="danger-btn" onclick={() => { onDelete(fileId); closeMenu(); }}>
            <img src="/images/garbage-basket.svg" alt="Permanently delete" class="icon" />
            Delete Permanently
          </button>
        {/if}
      {/if}    
    </div>
  {/if}
</div>

<style>
.menu-container {
  position: relative;
  display: inline-block;
}

.action-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-menu-btn:hover {
  background-color: var(--border-color);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 50;
  min-width: 160px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-menu button,
.dropdown-menu a {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  text-decoration: none;
}

.dropdown-menu button:hover,
.dropdown-menu a:hover {
  background-color: var(--bg-elevated);
}

.icon {
  width: 24px;
  height: 24px;
}

.icon { 
  filter: var(--svg-invert); 
}
</style>