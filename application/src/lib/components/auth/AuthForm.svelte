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

	<div class="auth-main">
	<header class="auth-header">
		<h1>{title}</h1>
			{#if description}
      	<p class="description">{description}</p>
    	{/if}
	</header>

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
		<Button type="submit" variant="primary" class="primary auth-submit" disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="loading">...Processing</span>
			{:else}	
				{submitText}
			{/if}
		</Button>
	</form>

	{#if alternativeLink}
		<footer class="auth-footer">
      <p>Or <a href={alternativeLink.href}>{alternativeLink.text}</a></p>
		</footer>	
  {/if}
</div>

<style>
	.auth-main {
		width: 100%;
		max-width: 100%;
		padding: 1.5rem;
		border-radius: 0.75rem;
		background-color: var(--bg-color);
		box-shadow: 0 4px 20px var(--shadow);
	}

	.auth-header {
		margin-bottom: 1.5rem;
	}

	@media (min-width: 640px) {
		.auth-main {
			max-width: 400px; 
			padding: 2.5rem;
			border-radius: 1rem;
		}
	}

	.auth-main h1 {
		text-align: center;
		color: var(--light-green);
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		word-wrap: break-word;
	}

	@media (min-width: 640px) {
		.auth-main h1 {
			font-size: 2rem;
		}
	}

	.auth-main p {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
		word-wrap: break-word;
	}

	@media (min-width: 640px) {
		.auth-main p {
			font-size: 1rem;
			margin-bottom: 2rem;
		}
	}

	.description {
		color: var(--text-muted);
		margin-bottom: 1rem;
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
		margin-top: 0.5rem; 
		width: 100%;
	}

	.auth-footer { 
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.loading { 
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.loading::before {
		content: '';
		width: 1rem;
		height: 1rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>