<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte"
</script>

<AuthForm
  title="Sign in to your account"
	submitText="Sign in"
	alternativeLink={{text: "sign up for a new account", href: "/sign-up"}}
>
	<div class="row">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" required>
	</div>
	<div class="row">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required>
	</div>
</AuthForm>