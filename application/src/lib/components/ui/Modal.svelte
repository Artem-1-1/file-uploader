<script>
  let { title, onConfirm, onCancel, children, isOpen = $bindable(false) } = $props();
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={onCancel} role="presentation">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} role="presentation">
      <h2>{title}</h2>
      {@render children()}
      <div class="modal-actions">
        <button onclick={onCancel}>Cancel</button>
        <button onclick={onConfirm}>Change username</button>
      </div>
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
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-content {
    background-color: #ffffff;
    padding: 32px;
    border-radius: 8px;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  }

  .modal-actions {
    display: flex;
    justify-content: end;
    gap: 12px;
    margin-top: 24px;
  }

  .modal-actions button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
</style>