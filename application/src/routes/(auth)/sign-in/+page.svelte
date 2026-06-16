<script lang="ts">
	import AuthForm from "$lib/components/AuthForm.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import "$lib/styles/global.css";

	let errorMessage = $state("");
	let isSubmitting = $state(false);

	async function handleSignIn(e : SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		errorMessage = "";
		isSubmitting = true;

		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password
			});
			if (error) {
				console.error("Sign in error:", error);
				errorMessage = error.message || "Invalid email or password.";
				isSubmitting = false;
			} else {
				goto("/"); 
			}
		} catch (error) {
			errorMessage = "An unexpected error occurred.";
			isSubmitting = false;
		}
	}
</script>

<AuthForm
  title="Sign in to your account"
	submitText="Sign in"
	alternativeLink={{text: "sign up for a new account", href: "/sign-up"}}
	onSubmit={handleSignIn}
	isSubmitting={isSubmitting}
>
	{#if errorMessage}
		<div class="form-error">
			{errorMessage}
		</div>
	{/if}
	<div class="form-group">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" placeholder="Enter your email" required>
	</div>
	<div class="form-group">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" placeholder="Enter your password" required>
	</div>
</AuthForm>