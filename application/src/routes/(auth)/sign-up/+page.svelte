<script lang="ts">
  import AuthForm from "$lib/components/auth/AuthForm.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import type { PageProps } from "./$types";

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

	<Input id="name" name="name" type="text" label="Username" placeholder="Choose a username" required error={form?.errors?.name}/>
	<Input id="email" name="email" type="email" label="Email" placeholder="Enter your email" required error={form?.errors?.email}/>
	<Input id="password" name="password" type="password" label="Password" placeholder="Create a password" required error={form?.errors?.password}/>
	<Input id="password-conf" name="password-conf" type="password" label="Password confirmation" placeholder="Confirm password" required error={form?.errors?.["password-conf"]}/>
</AuthForm>