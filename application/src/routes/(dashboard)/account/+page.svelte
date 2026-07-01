<script>
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { page } from "$app/state";
  const user = $derived(page.data.user);

  let isModalOpen = $state(false);

  function handleCancel() {
    isModalOpen = false;
  }
  const handleConfirm = '';
</script>

<div class="account-page">
  <h1 class="page-title">Personal account</h1>
  <div class="account-information">
    <div class="account-header">
      <h2>Basic information</h2>
    </div>

    <div class="account-page-module">
      <h3 class="module-left">Photo</h3>
      <div class="module-right">
        <Avatar/>
        <label class="custom-upload">
          <input type="file" accept="image/*">
          Change
        </label>
      </div>
    </div>

    <div class="account-page-module">
      <h3 class="module-left">Username</h3>
      <div class="module-right">
        {user.name}
        {#if isModalOpen}
          <Modal 
            title="Change your username"
            bind:isOpen={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}>
            <input type="text" bind:value={user.name}>
          </Modal>
        {/if}   
        <button class="change-btn" onclick={() => isModalOpen = true}>Change</button>
      </div>
    </div>

    <div class="account-page-module">
      <h3 class="module-left">Personal email address</h3>
      <div class="module-right">
        {user.email}
        {#if isModalOpen}
        <Modal 
            title="Change your email"
            bind:isOpen={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}>
            <input type="email" bind:value={user.email}>
          </Modal>
        {/if} 
        <button class="change-btn" onclick={() => isModalOpen = true}>Change</button>
      </div>
    </div>

  </div>
</div>

<style>
  .account-page {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  input[type="file"] {
  display: none;
  }

  .account-page-module {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #e5e5e5;
  }

  .module-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .custom-upload {
    display: inline-block; 
    font-weight: bold;
    border-bottom: 1px solid #7f7f7f;
    padding-bottom: 2px;
    cursor: pointer; 
  }

  .change-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
    font-size: inherit;

    display: inline-block; 
    font-weight: bold;
    color: #1e1e1e;
    border-bottom: 1px solid #7f7f7f;
    padding-bottom: 2px;
    cursor: pointer;
  }
</style>