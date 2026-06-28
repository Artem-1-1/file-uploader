<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
  import type { PageProps } from './$types';
  import "$lib/styles/global.css"

  let isSubmitting = $state(false);

  let { form }: PageProps = $props();
</script>

<AuthForm 
  title="Forgot password?"
  description="Whats your email address?"
  submitText="Send reset link"
  bind:isSubmitting={isSubmitting}>
  {#snippet children()}
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required placeholder="Your email">
    </div>
    {#if form?.error}
      <p class="error">{form.error}</p>
    {:else if form?.message}
      <p class="success">{form.message}</p>
    {/if}
  {/snippet}
</AuthForm>