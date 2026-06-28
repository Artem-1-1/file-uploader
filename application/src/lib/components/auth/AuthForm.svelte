<script lang="ts">
	import type { Snippet } from "svelte";
	import { enhance } from "$app/forms";
	import Button from "../ui/Button.svelte";

	type AuthFormProps = {
		title: string;
		submitText: string;
		description?: string;
		alternativeLink?: { text: string; href: string };
		children: Snippet;
		isSubmitting?: boolean;
		action?: string;
	};

	let {
		title, 
		submitText,
		description,
		alternativeLink,
		children,
		isSubmitting = $bindable(false),
		action = ""
	}: AuthFormProps = $props();
</script>

<div class="page-container">
	<main class="auth-main">
		<h1>{title}</h1>
		{#if description}
      <p class="description">{description}</p>
    {/if}

		{#if alternativeLink}
      <p>Or <a href={alternativeLink.href}>{alternativeLink.text}</a></p>
    {/if}

		<form class="auth-form" method="POST" {action} 
			use:enhance={() => {
				isSubmitting= true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				}
			}}>
			{@render children()}
			<Button type="submit" variant="primary" class="primary" disabled={isSubmitting}>{submitText}</Button>
		</form>
	</main>
</div>