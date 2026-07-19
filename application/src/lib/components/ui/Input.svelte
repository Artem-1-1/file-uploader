<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends HTMLInputAttributes {
    label?: string,
    error?: string,
    value?: string
  }

  let {
    value = $bindable(''),
    label,
    error,
    type = 'text',
    id,
    ...restProps 
  }: Props = $props();
</script>

<div class="input-field" class:has-error={error}>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}

  <div class="input-control-wrapper">
    <input {id} {type} bind:value class="input-control" aria-invalid={error ? "true" : undefined} {...restProps}>
  </div>

  {#if error}
    <p class="error-text">{error}</p>
  {/if}
</div>

<style>
  .input-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    font-family: inherit;
    position: relative;
    margin-bottom: 0; 
  }

  .input-field.has-error {
    margin-bottom: 0.5rem;
  }

  .input-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .input-control {
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--text-color); 
    outline: none;
    box-shadow: var(--input-shadow);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .input-control::placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  .input-control:focus {
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 3px var(--input-focus-shadow);
  }

  .input-field.has-error .input-control {
    border-color: var(--error-color);
  }
  
  .input-field.has-error .input-control:focus {
    box-shadow: 0 0 0 3px var(--error-shadow);
  }

  .error-text {
    font-size: 0.8rem;
    color: var(--error-color);
    position: absolute;
    bottom: -1.10rem;
    left: 0.25;
    margin: 0;
  }
</style>