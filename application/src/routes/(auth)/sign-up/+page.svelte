<script lang="ts">
  import AuthForm from "$lib/components/AuthForm.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import "$lib/styles/global.css";

	let errorMessage = $state("");
	let isSubmitting = $state(false);

	async function handleSignUp(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const passwordConf = formData.get("password-conf")

		if (password !== passwordConf) {
      errorMessage = "Passwords do not match!";
      return;
    }

		errorMessage = "";
    isSubmitting = true;

		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name
			});

			if (error) {
				console.error("Sign up error:", error);
				errorMessage = error.message || "Failed to create account.";
			} else {
				goto("/")
			}
		} catch (error) {
			errorMessage = "An unexpected error occurred."
		}
	}
</script>

<AuthForm
  title="Sign up for free"
	submitText="Sign up"
	alternativeLink={{text: "sign in to your existing account", href: "/sign-in"}}
	onSubmit={handleSignUp}
	isSubmitting={isSubmitting} 
>
	{#if errorMessage}
    <div class="form-error">
      {errorMessage}
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