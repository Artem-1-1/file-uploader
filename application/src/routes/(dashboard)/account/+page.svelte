<script>
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";;

  const user = $derived(page.data.user);

  let isUsernameModalOpen = $state(false);
  let isEmailModalOpen = $state(false);
  let isUploading = $state(false);

  let newUsername = $state('');
  let newEmail = $state('');

  function handleCancel() {
    isUsernameModalOpen = false;
    isEmailModalOpen = false;
    newUsername = user.name;
    newEmail = user.email;
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
        <Avatar src={user.image}/>
        <form 
          method="POST" 
          action="?/updateAvatar" 
          enctype="multipart/form-data"
          use:enhance={() => {
            isUploading = true;
            return async ({ update }) => {
              await update();
              isUploading = false;
            };
          }}
        >
        <label class="custom-upload">
          <input type="file" id="avatar" name="avatar" accept="image/*" onchange={(e) => e.currentTarget.form?.requestSubmit()}>
          Change
        </label>
        </form>
      </div>
    </div>

    <div class="account-page-module">
      <h3 class="module-left">Username</h3>
      <div class="module-right">
        {user.name}
        {#if isUsernameModalOpen}
          <Modal 
            title="Change your username"
            bind:isOpen={isUsernameModalOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}>
            <input type="text" class="modal-input" bind:value={newUsername}>
          </Modal>
        {/if}   
        <button class="change-btn" onclick={() => isUsernameModalOpen = true}>Change</button>
      </div>
    </div>

    <div class="account-page-module">
      <h3 class="module-left">Personal email address</h3>
      <div class="module-right">
        {user.email}
        {#if isEmailModalOpen}
        <Modal 
          title="Change your email"
          bind:isOpen={isEmailModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}>
          <input type="email" class="modal-input" bind:value={newEmail}>
        </Modal>
        {/if} 
        <button class="change-btn" onclick={() => isEmailModalOpen = true}>Change</button>
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