<script lang="ts">
	import AuthForm from "$lib/components/auth/AuthForm.svelte";
	import type { PageProps } from './$types';
	import { page } from "$app/state";
	import "$lib/styles/global.css";

	let isSubmitting = $state(false);
	let { form }: PageProps = $props();

	let successMessage = $derived(
    page.url.searchParams.get('message') === 'password_reset_success' 
      ? 'Password has been successfully reset.' 
      : ''
  );
</script>

<AuthForm
  title="Sign in to your account"
	submitText="Sign in"
	alternativeLink={{text: "sign up for a new account", href: "/sign-up"}}
	bind:isSubmitting={isSubmitting}
>
	{#if successMessage}<div class="form-success">{successMessage}</div>{/if}
  {#if form?.error}<div class="form-error">{form.error}</div>{/if}

	<div class="form-group">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" placeholder="Enter your email" required>
	</div>
	<div class="form-group">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" placeholder="Enter your password" required>
	</div>
	<a href="/users/forgot-password" class="forgot-link">Forgot password?</a>
</AuthForm>