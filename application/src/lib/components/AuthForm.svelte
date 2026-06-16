<script lang="ts">
	import type { Snippet } from "svelte";

	type AuthFormProps = {
		title: string;
		submitText: string;
		alternativeLink: { text: string; href: string };
		children: Snippet;
		onSubmit?: (e: SubmitEvent) => void;
		isSubmitting?: boolean;
	};

	let {
		title, 
		submitText,
		alternativeLink,
		children,
		onSubmit,
		isSubmitting = false
	}: AuthFormProps = $props();
</script>

<div class="page-container">
	<main class="auth-main">
		<h1>{title}</h1>
		<p>Or <a href={alternativeLink.href}>{alternativeLink.text}</a></p>
		<form class="auth-form" onsubmit={(e) => onSubmit?.(e)}>
			{@render children()}
			<button class="auth-button" type="submit" disabled={isSubmitting}>{submitText}</button>
		</form>
	</main>
</div>