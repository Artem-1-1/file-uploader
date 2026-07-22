<script lang="ts">
  import { formatDate, formatSize, formatFileType, getFileIcon } from "$lib/utils/formatters";
  import FileActionsMenu from "./FileActionsMenu.svelte";
  import Modal from "../ui/Modal.svelte";

  interface FileItem {
    id: string;
    name: string;
    type: string;
    mimeType: string | null;
    size: number;
    createdAt: string | Date;
  }

  interface Props {
    files: FileItem[],
    isDeletedView?: boolean;
    canDownload?: boolean;
    onInfo?: (id: string) => void;
    onRename?: (id: string, newName: string) => void;
    onRestore?: (id: string) => void;
    onDelete?: (id: string) => void;
  }

  let {
    files,
    isDeletedView = false,
    canDownload = false,
    onInfo,
    onRename,
    onRestore, 
    onDelete
  }: Props = $props();

  let isRenameModalOpen = $state(false);
  let activeFileId = $state("");
  let newFileName = $state("");

  function openRenameModal(fileId: string) {
    const targetFile = files.find(f => f.id === fileId);
    if (!targetFile) return;

    activeFileId = fileId;
    newFileName = targetFile.name;
    isRenameModalOpen = true;
  }

  async function handleRenameConfirm() {
    if (!newFileName.trim() || !onRename) return;
    
    onRename(activeFileId, newFileName.trim()); 
    isRenameModalOpen = false;
  }

  function handleRenameCancel() {
    isRenameModalOpen = false;
    activeFileId = "";
    newFileName = "";
  }
</script>

<div class="file-table">
  {#if files.length > 0}
    <div class="table-header">
      <div class="col-name">Name</div>
      <div class="col-date">Date Added</div>
      <div class="col-type">Type</div>
      <div class="col-size">Size</div>
      <div class="col-actions"></div>
    </div>

    <div class="table-body">
      {#each files as file}
        <div class="table-row">
          <div class="file-info">
            <img src={getFileIcon(file.type, file.mimeType)} alt="file icon" class="icon">
            <div class="file-name">{file.name}</div>
          </div>
          <div class="col-date">{formatDate(file.createdAt)}</div>
          <div class="col-type">{formatFileType(file.type, file.mimeType)}</div>
          <div class="col-size">{formatSize(file.size)}</div>
          <div class="col-actions">
            <FileActionsMenu
              fileId={file.id}
              {isDeletedView}
              {canDownload}
              {onInfo}
              onRename={isDeletedView ? undefined : openRenameModal}
              {onRestore}
              {onDelete}
            />
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      {isDeletedView ? "Basket is empty" : "No files"}
    </div>
  {/if}    
</div>

{#if !isDeletedView}
  <Modal 
    title="Rename File" 
    bind:isOpen={isRenameModalOpen} 
    onConfirm={handleRenameConfirm}
    onCancel={handleRenameCancel}
  >
    <div class="rename-input-container">
      <label for="file-name-input">Enter new name:</label>
      <input 
        id="file-name-input"
        type="text" 
        bind:value={newFileName} 
        class="modal-input"
        placeholder="File name"
        onkeydown={(e) => { if (e.key === 'Enter') handleRenameConfirm(); }}
      />
    </div>
  </Modal>
{/if}

<style>
.file-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr 40px; 
  align-items: center;
  padding: 10px 0;
}

.table-header {
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-color);
}

.table-row {
  border-bottom: 1px solid var(--border-color);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  height: 24px;
  width: 24px;
}

.file-name {
  font-weight: 500;
}

.col-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>