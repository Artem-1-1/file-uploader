<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    onConfirm?: () => void; 
    onCancel?: () => void;
    children: Snippet;
    isOpen?: boolean;
    confirmText?: string;
    cancelText?: string;
  }

  let { 
    title, 
    children, 
    isOpen = $bindable(false),
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  }: Props = $props();

  function handleClose() {
    if (onCancel) {
      onCancel();
    }
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleClose} role="presentation">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} role="presentation">
      <button class="modal-close-btn" onclick={handleClose} aria-label="Close modal">
        <img src="/images/close.svg" alt="close icon" class="icon">
      </button>

      <h2 class="modal-title">{title}</h2>

      <div class="modal-body">
        {@render children()}
      </div>

      {#if onConfirm || onCancel}
        <div class="modal-actions">
          {#if onCancel}
            <button onclick={handleClose}>{cancelText}</button>
          {/if}
          {#if onConfirm}
            <button onclick={onConfirm}>{confirmText}</button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-content {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    padding: 2rem;
    border-radius: 12px;
    width: 400px;
    box-shadow: 0 10px 25px -5px var(--shadow), 0 8px 10px -6px var(--shadow);
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-close-btn {
    position: absolute;
    top: 25px;
    right: 20px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.15s, color 0.15s;
  }

  .modal-title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text-color);
    padding-right: 32px;
  }

  .modal-close-btn:hover {
    background-color: var(--bg-elevated);
  }

  .modal-body {
    width: 100%;
  }

  .modal-actions {
    display: flex;
    justify-content: end;
    gap: 1rem;
    margin-top: 24px;
  }

  .modal-actions button {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    transition: all 0.15s ease;
  }

  .icon {
    width: 30px;
    height: 30px;
    filter: var(--svg-invert);
  }
</style>