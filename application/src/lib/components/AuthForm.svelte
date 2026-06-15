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
	<h2>{title}</h2>
	<p>Or <a href={alternativeLink.href}>{alternativeLink.text}</a></p>
	<form method="POST">
		{@render children()}
		<button type="submit">{submitText}</button>
	</form>
</div>