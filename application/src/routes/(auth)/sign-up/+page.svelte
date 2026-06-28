<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
	import type { PageProps } from "./$types";
	import "$lib/styles/global.css";

	let isSubmitting = $state(false);
	let { form } : PageProps = $props();
</script>

<AuthForm
  title="Sign up for free"
	submitText="Sign up"
	alternativeLink={{text: "sign in to your existing account", href: "/sign-in"}}
	bind:isSubmitting={isSubmitting} 
>
	{#if form?.error}
    <div class="form-error">
      {form.error}
    </div>
  {/if}

	<div class="form-group">
		<label for="name">Username</label>
		<input id="name" name="name" type="text" placeholder="Choose a username" required>
	</div>
	<div class="form-group">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" placeholder="Enter your email" required>
	</div>
	<div class="form-group">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" placeholder="Create a password" required>
	</div>
	<div class="form-group">
		<label for="password-conf">Password confirmation</label>
		<input id="password-conf" name="password-conf" type="password" placeholder="Confirm password" required>
	</div>
</AuthForm>