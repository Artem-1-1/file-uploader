<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
  import type { PageProps } from './$types';
  import "$lib/styles/global.css";
  import { page } from "$app/state";

  let isSubmitting = $state(false);

  let { form }: PageProps = $props();
  const token = $derived(page.url.searchParams.get('token') || '');
</script>

<AuthForm 
  title="Reset password" 
  submitText="Reset" 
  bind:isSubmitting={isSubmitting}>
  {#snippet children()}
  <input type="hidden" name="token" value={token} />
  <div class="form-group">
    <label for="newPassword">New Password</label>
    <input type="password" id="newPassword" name="newPassword" required placeholder="New password">
  </div>
  <div class="form-group">
    <label for="confirmPassword">Confirm new password</label>
    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm password">
  </div>
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}  
  {/snippet}
</AuthForm>