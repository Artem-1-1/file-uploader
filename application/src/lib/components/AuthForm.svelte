<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		title, 
		submitText,
		alternativeLink,
		children
		} : {
			title : string;
			submitText : string;
			alternativeLink : { text : string, href : string };
			children: Snippet;
		} = $props()
</script>

<div class="page-container">
	<main class="auth-main">
		<h1>{title}</h1>
		<p>Or <a href={alternativeLink.href}>{alternativeLink.text}</a></p>
		<form class="auth-form" method="POST">
			{@render children()}
			<button class="auth-button" type="submit">{submitText}</button>
		</form>
	</main>
</div>