<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte";
</script>

<AuthForm
  title="Sign up for free"
	submitText="Sign up"
	alternativeLink={{text: "sign in to your existing account", href: "/sign-in"}}
>
	<div class="row">
		<label for="name">Username</label>
		<input id="name" name="name" type="text" required>
	</div>
	<div class="row">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" required>
	</div>
	<div class="row">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required>
	</div>
	<div class="row">
		<label for="password_conf">Password confirmation</label>
		<input id="password_conf" name="password_conf" type="password" required>
	</div>
</AuthForm>