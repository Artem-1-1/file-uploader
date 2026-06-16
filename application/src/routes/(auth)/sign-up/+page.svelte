<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte";
	import "$lib/styles/global.css";
</script>

<AuthForm
  title="Sign up for free"
	submitText="Sign up"
	alternativeLink={{text: "sign in to your existing account", href: "/sign-in"}}
>
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
		<label for="password_conf">Password confirmation</label>
		<input id="password_conf" name="password_conf" type="password" placeholder="Confirm password" required>
	</div>
</AuthForm>