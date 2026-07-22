<script lang="ts">
  import { page } from "$app/state";
  import { formatSize } from "$lib/utils/formatters";

  let storageUsed = $derived(page.data.user?.storageUsed ?? 0);
  let storageLimit = $derived(page.data.user?.storageLimit ?? 0);

  let percentage = $derived(storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0);

  let progressColor = $derived(
    percentage > 90 ? '#FF312E' : percentage > 70 ? '#F4D35E' : '#4DAA57'
  );
</script>

<div class="storage-indicator">
  <div class="storage-header">
    <div class="storage-type">Free</div>
    <div class="storage-used">
      Used {formatSize(storageUsed)} from {formatSize(storageLimit)}
    </div>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" style="width: {Math.min(percentage, 100)}%; background-color: {progressColor};">
    </div>
  </div>
</div>

<style>
  .storage-indicator {
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: var(--bg-elevated);
    box-sizing: border-box;
    transition: background-color 0.3s ease;
  }

  .storage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .storage-type {
    font-weight: 600;
    color: var(--text-color);
  }

  .storage-used {
    color: var(--text-muted);
  }

  .progress-bar {
    width: 100%;
    height: 0.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    background-color: var(--border-color);
    flex-shrink: 0;
  }

  .progress-fill {
    height: 100%;
    border-radius: 0.25rem;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
</style>