<script lang="ts">
  import type { PageData } from './$types';
  import UserActionsMenu from '$lib/components/ui/UserActionsMenu.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { formatSize, formatBanStatus, formatBanReason, formatBanExpires } from '$lib/utils/formatters';
  import { invalidateAll } from '$app/navigation';

  let { data }: { data: PageData } = $props();

  let isBanOpen = $state(false);
  let isChangeRoleOpen = $state(false);
  let isStorageOpen = $state(false);
  let isDeleteOpen = $state(false);

  let selectedUserId = $state<string | null>(null);
  let selectedRole = $state<string>('');
  let selectedStorageSize = $state<number>(0);
  let banReason = $state<string>('');

  const changeRoleModal = (userId: string, currentRole: string) => {
    selectedUserId = userId;
    selectedRole = currentRole;
    isChangeRoleOpen = true;
  };

  const storageModal = (userId: string, currentStorage: number) => {
    selectedUserId = userId;
    selectedStorageSize = currentStorage;
    isStorageOpen = true;
  }

  const banModal = (userId: string) => {
    selectedUserId = userId;
    banReason = '';
    isBanOpen = true;
  };

  const deleteModal = (userId: string) => {
    selectedUserId = userId;
    isDeleteOpen = true;
  }

  const handleChangeRole = async () => {
    if (!selectedUserId) return;

    const formData = new FormData();
    formData.append("userId", selectedUserId);
    formData.append("role", selectedRole);

    await fetch("?/changeRole", {method: "POST", body: formData});
    isChangeRoleOpen = false;
    await invalidateAll();
  };

  const handleStorageUpdate = async () => {
    if (!selectedUserId) return;

    const formData = new FormData();
    formData.append("userId", selectedUserId);
    formData.append("storageLimit", selectedStorageSize.toString());

    await fetch("?/updateStorage", { method: "POST", body: formData});
    isStorageOpen = false;
    await invalidateAll();
  }

  const handleBan = async () => {
    if (!selectedUserId) return;
    const formData = new FormData();
    formData.append("userId", selectedUserId);
    formData.append("reason", banReason);

    await fetch("?/banUser", { method: "POST", body: formData });
    isBanOpen = false;
    await invalidateAll();
  };

  const handleUnban = async (userId: string) => {
    const formData = new FormData();
    formData.append("userId", userId);

    await fetch("?/unbanUser", { method: "POST", body: formData });
    await invalidateAll();
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;

    const formData = new FormData();
    formData.append("userId", selectedUserId);

    await fetch("?/deleteUser", { method: "DELETE", body: formData});
    isDeleteOpen = false;
    await invalidateAll();
  };
</script>

<div class="user-table">
  <h1>Admin Panel</h1>
  <div class="table-header">
    <div class="col-name">Username</div>
    <div class="col-email">Email</div>
    <div class="col-storage">User Storage</div>
    <div class="col-ban">Ban Status</div>
    <div class="col-reason">Ban Reason</div>
    <div class="col-expires">Ban Expires</div>
    <div class="col-role">Role</div>
    <div class="col-actions">Actions</div>
  </div>

  <div class="table-body">
    {#each data.users as user}
      <div class="table-row">
        <div class="username">{user.name}</div>
        <div class="user-email">{user.email}</div>
        <div class="user-storage">{formatSize(user.storageLimit)}</div>
        <div class="user-ban">
          <span class="ban-badge {user.banned ? 'is-banned' : ''}">
            {formatBanStatus(user.banned)}
          </span>
        </div>
        <div class="ban-reason">{formatBanReason(user.banReason)}</div>
        <div class="ban-expires">{formatBanExpires(user.banExpires, user.banned)}</div>
        <div class="user-role">{user.role}</div>
        <div class="actions">
          <UserActionsMenu
              userId={user.id}
              userRole={user.role || "user"}
              isBanned={!!user.banned}
              onChangeRole={() => changeRoleModal(user.id, user.role || 'user')}
              onStorageUpdate={() => storageModal(user.id, user.storageLimit)}
              onBan={() => banModal(user.id)}
              onUnban={handleUnban}
              onDelete={() => deleteModal(user.id)}
            />
        </div>
      </div>  
    {/each}
  </div>
</div>

<Modal 
  title="Change User Role" 
  bind:isOpen={isChangeRoleOpen} 
  onConfirm={handleChangeRole} 
  onCancel={() => isChangeRoleOpen = false}
>
  <div class="form-group">
    <label for="role-select">Select new user role:</label>
    <select id="role-select" bind:value={selectedRole}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </div>
</Modal>

<Modal
  title="Update User Storage"
  bind:isOpen={isStorageOpen}
  onConfirm={handleStorageUpdate}
  onCancel={() => isStorageOpen = false}>
  <div class="form-group">
    <label for="storage-select">Select New Storage Memory:</label>
    <select id="storage-select" bind:value={selectedStorageSize}>
      <option value={1073741824}>1 GB</option>
      <option value={2147483648}>2 GB</option>
      <option value={5368709120}>5 GB</option>
      <option value={10737418240}>10 GB</option>
    </select>
  </div>
</Modal>

<Modal
  title="Ban user"
  bind:isOpen={isBanOpen}
  onConfirm={handleBan}
  onCancel={() => isBanOpen = false}>
  <div class="form-group">
    <label for="ban-reason">Please indicate the reason for ban:</label>
    <textarea 
      id="ban-reason" 
      bind:value={banReason} 
      placeholder="For example: Spamming"
      rows="3"
    ></textarea>
  </div>
</Modal>

<Modal 
  title="Deleting User" 
  bind:isOpen={isDeleteOpen} 
  onConfirm={handleDelete} 
  onCancel={() => isDeleteOpen = false}>
  <p>Are you sure you want to permanently delete this user? This action cannot be undone.</p>
</Modal>

<style>
  .user-table {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

    .table-header, .table-row {
    display: grid;
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1.5fr 1fr 1fr 3rem;  
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .table-header {
    font-weight: 600;
    color: var(--text-color);
    border-top: 1px solid var(--border-color);
    border-radius: 5px 5px 0 0;
  }

  .col-storage, .user-storage,
  .col-ban, .user-ban,
  .col-reason, .ban-reason,
  .col-expires, .ban-expires,
  .col-role, .user-role,
  .col-actions, .actions {
    justify-self: center;
    text-align: center;
    width: 100%;
  }

  .user-ban, .actions {
    display: flex;
    justify-content: center;
  }

  .ban-badge {
    padding: 4px 8px;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    background-color: #dcfce7;
    color: #166534;            
  }

  .ban-badge.is-banned {
    background-color: #fee2e2;
    color: #991b1b;            
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  textarea, select {
    width: 90%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
  }

  textarea {
    resize: none;
  }
</style>