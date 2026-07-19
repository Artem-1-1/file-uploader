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
					try {
						await update();
					} finally {
						isSubmitting = false;
					}
				}
			}}>
			{@render children()}
			<Button type="submit" variant="primary" class="primary auth-submit" disabled={isSubmitting}>{submitText}</Button>
		</form>
	</main>
</div>

<style>
	.auth-main {
		margin: 0 auto;
		max-width: 400px;
		padding: 40px;
		border-radius: 1rem;
		background-color: var(--auth-bg);
		box-shadow: 0 4px 20px var(--shadow-dropdown);
		flex-grow: 1;
	}

	.auth-main h1 {
		text-align: center;
		color: var(--light-green);
	}

	.auth-main p {
		text-align: center;
		margin-bottom: 2rem;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-main :global(a) {
		color: var(--light-green);
		font-weight: 500;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.auth-main :global(a:hover) {
		color: var(--light-green-hover);
		text-decoration: underline;
	}

	:global(.auth-submit) {
		margin-top: 1rem; 
		width: 100%;
	}
</style>