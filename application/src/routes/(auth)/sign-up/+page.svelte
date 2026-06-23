<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto, invalidateAll } from "$app/navigation";
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
			isSubmitting = false;
      return;
    }

		errorMessage = "";
    isSubmitting = true;

		try {
			await authClient.signUp.email({
				email,
				password,
				name, 
				fetchOptions: {
					onError: (ctx) => {
						console.error("Sign up error:", ctx.error);
            errorMessage = ctx.error.message || "Failed to create account.";
            isSubmitting = false;
					}, 
					onSuccess: async() => {
						await invalidateAll();
						await goto("/sign-in")
					}
				}
			});
		} catch (error) {
			errorMessage = "An unexpected error occurred.";
			isSubmitting = false;
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