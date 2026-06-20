<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

  type BaseProps = {
    children: Snippet,
    variant: 'primary' | 'secondary';
    class?: String;
  }

  type AnchorProps = BaseProps & HTMLAnchorAttributes & { href: string };
  type ButtonProps = BaseProps & HTMLButtonAttributes & { href?: never };

  let {
    children,
    variant = 'primary',
    class: className = '',
    type = 'button' as 'button' | 'submit' | 'reset',
    ...restProps
  } : AnchorProps | ButtonProps = $props();
</script>

{#if 'href' in restProps && restProps.href}
	<a 
		class="btn btn-{variant} {className}" 
		{...restProps}
	>
		{@render children()}
	</a>
{:else}
	<button 
		{type}
		class="btn btn-{variant} {className}" 
		{...restProps}
	>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 12px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn:disabled, 
	.btn[aria-disabled="true"] {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}

	.btn-primary {
		background-color: var(--light-green, #21a0a0);
		color: white;
		box-shadow: 0 4px 6px rgba(33, 160, 160, 0.3);
	}

	.btn-primary:hover:not(:disabled):not([aria-disabled="true"]) {
		background-color: var(--light-green-hover, #1b8585);
		box-shadow: 0 6px 12px rgba(33, 160, 160, 0.4);
	}

	.btn-secondary {
		background-color: transparent;
		color: currentColor;
		box-shadow: none;
	}

	.btn-secondary:hover:not(:disabled):not([aria-disabled="true"]) {
		text-decoration: underline;
		background-color: color-mix(in srgb, currentColor 8%, transparent);
	}
</style>