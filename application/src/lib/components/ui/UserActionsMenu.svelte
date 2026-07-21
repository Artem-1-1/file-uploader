<script lang="ts">
  interface Props {
    userId: string,
    userRole: string,
    isBanned?: boolean,
    onChangeRole?: (id: string) => void;
    onStorageUpdate?: (id: string) => void;
    onBan? : (id: string) => void;
    onUnban?: (id: string) => void;
    onDelete?: (id: string) => void;

  }

  let {
    userId,
    isBanned = false,
    onChangeRole,
    onStorageUpdate,
    onBan,
    onUnban,
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
        if (e.key === 'Escape') closeMenu();
      }}>

      {#if onChangeRole}
        <button type="button" onclick={() => { onChangeRole(userId); closeMenu(); }}>
          <img src="/images/user-role.svg" alt="Change role" class="icon" />
          Change Role
        </button>
      {/if}

      {#if onStorageUpdate}
        <button type="button" onclick={() => { onStorageUpdate(userId); closeMenu(); }}>
          <img src="/images/storage.svg" alt="update storage" class="icon" />
          Storage Update
        </button>
      {/if}

      {#if isBanned && onUnban}
        <button type="button" onclick={() => { onUnban(userId); closeMenu(); }}>
          <img src="/images/user-unban.svg" alt="Unban" class="icon" />
          Unban User
        </button>
      {:else if !isBanned && onBan}
        <button type="button" onclick={() => { onBan(userId); closeMenu(); }}>
          <img src="/images/user-ban.svg" alt="Ban" class="icon" />
          Ban User
        </button>
      {/if}

      {#if onDelete}
        <button type="button" class="danger-btn" onclick={() => { onDelete(userId); closeMenu(); }}>
          <img src="/images/garbage-basket.svg" alt="Delete" class="icon" />
          Delete User
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
.menu-container {
  display: flex;
  position: relative;
  display: inline-block;
  width: 100%;
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
  margin: 0 auto;
}

.action-menu-btn:hover {
  background-color: var(--dropdown-border);
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 50;
    min-width: 160px;
    background-color: var(--dropdown-bg);
    border: 1px solid var(--dropdown-border);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .dropdown-menu button {
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
    color: var(--dropdown-text-main);
    text-decoration: none;
  }

  .dropdown-menu button:hover {
    background-color: var(--dropdown-bg-hover);
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  .icon { 
    filter: var(--svg-invert); 
  }
</style>