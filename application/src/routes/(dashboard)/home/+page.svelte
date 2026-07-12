<script lang="ts">
  import { createUploader } from "$lib/utils/uploadthing";
  import { UploadDropzone, UploadButton } from "@uploadthing/svelte";
  import "@uploadthing/svelte/styles.css"; 
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import { formatDate, formatSize, formatFileType, getFileIcon } from "$lib/utils/formatters";
  import FileActionsMenu from "$lib/components/ui/FileActionsMenu.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  let {data} : { data: PageData } = $props(); 
  
  const currentParentId = $derived(data.parentId || null);

  let isDragging = $state(false);
  let dragCounter = 0;

  let isRenameModalOpen = $state(false);
  let activeFileId = $state("");
  let newFileName = $state("");

  const uploader = createUploader("fileUploader", {
    input: {
      get parentId() { return currentParentId; }
    },
    onClientUploadComplete: async (res) => {
      console.log(`onClientUploadComplete`, res);
      console.log("Upload Completed");
      isDragging = false;
      dragCounter = 0;
      await invalidateAll();
    },
    onUploadError: (error: Error) => {
      console.log(`ERROR! ${error.message}`);
      isDragging = false;
      dragCounter = 0;
    },
  });

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.types.includes("Files")) {
      dragCounter++;
      isDragging = true;
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      isDragging = false;
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop() {
    dragCounter = 0;
    isDragging = false;
  }

  function handleDownload(id: string) {
    console.log("Downloading file:", id);
  }

  function handleInfo(id: string) {
    console.log("Showing file info:", id);
  }

  function openRenameModal(fileId: string) {
    const targetFile = data.files.find(f => f.id === fileId);
    if (!targetFile) return;

    activeFileId = fileId;
    newFileName = targetFile.name;
    isRenameModalOpen = true;
  }

  async function handleRenameConfirm() {
    if (!newFileName.trim()) return;

    try {
      const response = await fetch("/api/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: activeFileId,
          action: "rename",
          newName: newFileName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to rename");
      }
      await invalidateAll();
      isRenameModalOpen = false;
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  }

  function handleRenameCancel() {
    isRenameModalOpen = false;
    activeFileId = "";
    newFileName = "";
  }

  async function handleSoftDelete(fileId: string) {
    try {
      const response = await fetch("/api/files", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ fileId, action: "basket" })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fail move file to basket.")
      }
      await invalidateAll();
    } catch (error: any) {
      console.log(`Error deleting file: ${error.message}`);
    }
  }
</script>

<main class="page-container">
  <div class="page-nav">
    <div class="page-header">
      <div class="action-buttons">
      <div class="upload-button-wrapper">
        <UploadButton {uploader} appearance={{allowedContent: "display: none;"}}/>
      </div>
      </div>
      <h2>All files</h2>
    </div>

    <div 
      class="table-wrapper"
      ondragenter={handleDragEnter}
      ondragleave={handleDragLeave}
      ondragover={handleDragOver}
      ondrop={handleDrop}
      role="region"
      aria-label="File table and dropzone"
    >
      {#if data.files.length === 0 || isDragging}
        <div class="dropzone-overlay">
          <UploadDropzone {uploader} appearance={{container: "custom-dropzone-container"}}/>
        </div>
      {/if}

      {#if data.files.length > 0}
        <div class="file-table">
          <div class="table-header">
            <div class="col-name">Name</div>
            <div class="col-date">Date Added</div>
            <div class="col-type">Type</div>
            <div class="col-size">Size</div>
            <div class="col-actions"></div>
          </div>

          <div class="table-body">
            {#each data.files as file}
              <div class="table-row">
                <div class="col-name file-info">
                  <img src={getFileIcon(file.type, file.mimeType)} alt="file icon" class="icon">
                  <div class="file-name">{file.name}</div>    
                </div>
                <div class="col-date">{formatDate(file.createdAt)}</div>
                <div class="col-type">{formatFileType(file.type, file.mimeType)}</div>
                <div class="col-size">{formatSize(file.size)}</div>
                <div class="col-actions">
                  <FileActionsMenu 
                  fileId={file.id} 
                  onDownload={handleDownload}
                  onInfo={handleInfo}
                  onRename={openRenameModal}
                  onDelete={handleSoftDelete}
                />
              </div>
              </div>
            {/each} 
          </div>
        </div>  
      {/if}
    </div>
  </div>
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
        onkeydown={(e) => {
          if (e.key === 'Enter') handleRenameConfirm();
        }}
      />
    </div>
  </Modal>
</main>

<style>
.page-container {
  display: grid;
  grid-template-columns: 0px 1fr;
  min-height: 100vh;
  box-sizing: border-box;
  transition: grid-template-columns 0.2s ease;
}

.page-nav {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  box-sizing: border-box;
  flex-grow: 1;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-wrapper {
  position: relative;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.dropzone-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  z-index: 50;
  background-color: white;
}

:global(.custom-dropzone-container) {
  width: 100%;
  height: 100%;
  max-width: none;
  box-sizing: border-box;
}

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

.table-row:hover {
  background-color: #f7f7f7;
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