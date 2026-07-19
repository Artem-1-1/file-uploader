<script lang="ts">
  import type { PageData } from './$types';
  import UserActionsMenu from '$lib/components/ui/UserActionsMenu.svelte';

  let { data }: { data: PageData } = $props();
  const handleChangeRole = async (userId: string) => {
  };
    const handleBan = async (userId: string) => {
  };

  const handleUnban = async (userId: string) => {
  };

  const handleDelete = async (userId: string) => {
  };
</script>

<div class="user-table">
  <h1>Admin Panel</h1>
  <div class="table-header">
    <div class="col-name">Username</div>
    <div class="col-email">Email</div>
    <div class="col-ban">Banned</div>
    <div class="col-role">Role</div>
    <div class="col-actions">Actions</div>
  </div>

  <div class="table-body">
    {#each data.users as user}
      <div class="table-row">
        <div class="username">{user.name}</div>
        <div class="user-email">{user.email}</div>
        <div class="user-ban">{user.banned}</div>
        <div class="user-role">{user.role}</div>
        <div class="actions">
          <UserActionsMenu
              userId={user.id}
              userRole={user.role || 'user'}
              isBanned={!!user.banned}
              onBan={handleBan}
              onUnban={handleUnban}
              onChangeRole={handleChangeRole}
              onDelete={handleDelete}
            />
        </div>
      </div>  
    {/each}
  </div>
</div>

<style>
.user-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

  .table-header, .table-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 40px; 
  align-items: center;
  padding: 10px 0;
}
</style>