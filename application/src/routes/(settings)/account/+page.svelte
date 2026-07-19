<script lang="ts">
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  const user = $derived(page.data.user);

  let isUsernameModalOpen = $state(false);
  let isEmailModalOpen = $state(false);
  let isUploading = $state(false);

  let fileInput: HTMLInputElement;
  let usernameForm = $state<HTMLFormElement>();
  let emailForm = $state<HTMLFormElement>();

  let newUsername = $state('');
  let newEmail = $state('');

  let usernameError = $state('');
  let emailError = $state('');

  function handleCancel() {
    isUsernameModalOpen = false;
    isEmailModalOpen = false;
    usernameError = '';
    emailError = '';
  }
  
  function submitUsernameForm() {
    usernameForm?.requestSubmit();
  }

  function submitEmailForm() {
    emailForm?.requestSubmit();
  }
</script>

<div class="account-page">
  <div class="page-title">  
    <button onclick={() => history.back()} class="back-btn" aria-label="Back">
      <img src="/images/arrow-left.svg" alt="back icon" class="icon">
    </button>
    <h1 class="page-header">Personal account</h1>
  </div>
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
          }}>
        <input type="file" bind:this={fileInput} id="avatar" name="avatar" accept="image/*"  onchange={(e) => e.currentTarget.form?.requestSubmit()}>
        <Button variant="text" onclick={() => fileInput?.click()}>
          Change
        </Button>
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
            onConfirm={submitUsernameForm}
            onCancel={handleCancel}>
            <form
              bind:this={usernameForm} 
              method="POST" 
              action="?/updateUsername"
              use:enhance={() => {
                usernameError = '';
                return async ({ result, update }) => {
                  if (result.type === 'failure') {
                    usernameError = (result.data as any)?.message || 'Error updating username';
                  } else {
                    await update();
                    isUsernameModalOpen = false;
                  }
                };
              }}>
              <Input type="text" name="username" label="New Username" bind:value={newUsername} error={usernameError} required/>
          </form>
        </Modal>
        {/if}   
        <Button variant="text" onclick={() => {
          newUsername = user.name;
          isUsernameModalOpen = true;
        }}>Change</Button>
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
          onConfirm={submitEmailForm}
          onCancel={handleCancel}>
          <form
            bind:this={emailForm} 
            id="email-form"
            method="POST" 
            action="?/updateEmail"
            use:enhance={() => {
              emailError = '';
              return async ({ result, update }) => {
                if (result.type === 'failure') {
                  emailError = (result.data as any)?.message || 'Error updating email';
                } else {
                  await update();
                  isEmailModalOpen = false;
                }
              };
            }}>
          <Input type="email" name="email" label="New Email" bind:value={newEmail} error={emailError} required/>
        </form>  
        </Modal>
        {/if} 
        <Button variant="text" onclick={() => {
          newEmail = user.email;
          isEmailModalOpen = true;
        }}>Change</Button>
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

  .page-title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .back-btn {
    border: none;
    padding: 8px;
    cursor: pointer;
    background: none;
    transition: background-color 0.2s ease, opacity 0.2s ease;
  }

  .account-header {
    margin-bottom: 1rem;
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
  
  .icon {
    width: 30px;
    height: 30px;
    filter: var(--svg-invert);
  }
</style>