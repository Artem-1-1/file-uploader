<script lang="ts">
import { page } from '$app/stores';
  import { formatDate, formatSize, formatFileType, getFileIcon } from "$lib/utils/formatters";

  interface FileItem {
    id: string;
    name: string;
    type: string;
    mimeType: string | null;
    size: number;
    createdAt: string | Date;
  }

  interface Props {
    file: FileItem | null;
    onClose: () => void;
  }

  let { file, onClose }: Props = $props();
  let location = $derived($page.url.pathname.includes('/basket') ? 'Basket' : 'Home');
  let locationHref = $derived($page.url.pathname.includes('/basket') ? '/basket' : '/home');
</script>


<div class="sidebar">
  <div class="sidebar-header">
    <h2>Information</h2>
    <button type="button" class="close-btn" onclick={onClose}>
      <img src="/images/close.svg" alt="Close" class="icon" />
    </button>
  </div>

  {#if file}
    <div class="sidebar-content">
      <div class="file-icon-container">
        <img src={getFileIcon(file.type, file.mimeType)} alt="file icon" class="file-icon" />
      </div>

      <div class="info-section">
        <h3>Name</h3>
        <p>{file.name}</p>
      </div>

      <div class="info-section">
        <h3>Type</h3>
        <p>{formatFileType(file.type, file.mimeType)}</p>
      </div>

      <div class="info-section">
        <h3>Location</h3>
        <a href={locationHref} class="location-link" onclick={onClose}>
          {location}
        </a>
      </div>

      <div class="info-section">
        <h3>Size</h3>
        <p>{formatSize(file.size)}</p>
      </div>

      <div class="info-section">
        <h3>Date Added</h3>
        <p>{formatDate(file.createdAt)}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .sidebar {
    grid-column: 3;
    background: var(--dropdown-bg);
    width: 100%;
    border-left: 1px solid var(--dropdown-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--dropdown-border);
  }

  .sidebar-header h2 {
    font-size: 20px;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .close-btn:hover {
    background: var(--dropdown-bg-hover);
  }

  .close-btn .icon {
    width: 30px;
    height: 30px;
    filter: var(--svg-invert);
  }

  .sidebar-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .file-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .file-icon {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .info-section {
    margin-bottom: 24px;
  }

  .info-section h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }

  .info-section p {
    font-size: 14px;
    color: var(--text-color);
    word-break: break-word;
  }

  .location-link {
    color: var(--light-green, #21A0A0);
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .location-link:hover {
    color: var(--light-green-hover, #1B8585);
    text-decoration: underline;
  }
</style>