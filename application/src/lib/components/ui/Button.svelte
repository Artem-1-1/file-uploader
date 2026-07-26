<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

  type BaseProps = {
    children: Snippet,
    variant?: 'primary' | 'secondary' | 'text';
    class?: string;
  }

  type ComponentProps = BaseProps & (
    | (Omit<HTMLAnchorAttributes, 'class' | 'type'> & { href: string, type?: never })
    | (Omit<HTMLButtonAttributes, 'class'> & { href?: never })
  );

  let {
    children,
    variant = 'primary',
    class: className = '',
		href,
    type = 'button',
    ...restProps
  } : ComponentProps = $props();
</script>

{#if href}
	<a 
		{href}
		class="btn btn-{variant} {className}" 
		{...(restProps as HTMLAnchorAttributes)}
	>
		{@render children()}
	</a>
{:else}
	<button 
		{type}
		class="btn btn-{variant} {className}" 
		{...(restProps as HTMLButtonAttributes)}
	>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.3s ease;
		gap: 0.5rem;
	}

	.btn:disabled, 
	.btn[aria-disabled="true"] {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}

	.btn-primary {
		padding: 12px 16px;
		background-color: var(--light-green, #21a0a0);
		color: white;
		box-shadow: 0 4px 6px rgba(33, 160, 160, 0.3);
		font-weight: bold;
	}

	.btn-primary:hover:not(:disabled):not([aria-disabled="true"]) {
		background-color: var(--light-green-hover, #1b8585);
		box-shadow: 0 6px 12px rgba(33, 160, 160, 0.4);
	}

	.btn-secondary {
		padding: 12px 16px;
		background-color: transparent;
		color: var(--text-color);
		box-shadow: none;
	}

	:global(.btn-secondary):hover:not(:disabled):not([aria-disabled="true"]),
	.btn-secondary:hover:not(:disabled):not([aria-disabled="true"]) {
		text-decoration: none;
		background-color: rgba(97, 99, 102, 0.2);
	}

	.btn-secondary :global(img) {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		filter: var(--svg-invert);
	}

	.btn-text {
		background: none;
		padding: 0;
		border-radius: 0;
		font-weight: bold;
		color: var(--text-color);
		border-bottom: 1px solid var(--placeholder-color);
		padding-bottom: 2px;
		box-shadow: none;
	}
</style>