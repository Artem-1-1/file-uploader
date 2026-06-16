<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte";
	import "$lib/styles/global.css";
</script>

<AuthForm
  title="Sign in to your account"
	submitText="Sign in"
	alternativeLink={{text: "sign up for a new account", href: "/sign-up"}}
>
	<div class="form-group">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" placeholder="Enter your email" required>
	</div>
	<div class="form-group">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" placeholder="Enter your password" required>
	</div>
</AuthForm>