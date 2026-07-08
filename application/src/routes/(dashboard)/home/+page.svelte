<script lang="ts">
  import { createUploader } from "$lib/utils/uploadthing";
  import { UploadDropzone, UploadButton } from "@uploadthing/svelte";
  import "@uploadthing/svelte/styles.css"; 
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import { formatDate, formatSize } from "$lib/utils/formatters";

  let {data} : { data: PageData } = $props(); 
  
  const currentParentId = $derived(data.parentId || null);

  let isDragging = $state(false);
  let dragCounter = 0;

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
                  {#if file.type === 'folder'}
                    <img src="/images/folder.svg" alt="folder icon" class="icon">
                  {:else}
                    <img src="/images/image.svg" alt="file icon" class="icon">
                  {/if}
                  <div class="file-name">{file.name}</div>    
                </div>
                <div class="col-date">{formatDate(file.createdAt)}</div>
                <div class="col-type">{file.type}</div>
                <div class="col-size">{formatSize(file.size)}</div>
                <div class="col-actions">
          <button 
            type="button" 
            class="action-menu-btn" 
            aria-label="Actions menu"
            onclick={(e) => {
              e.stopPropagation();
              console.log('Open menu for', file.name);
            }}
          >
            <img src="/images/dot-menu-more.svg" alt="more actions" class="icon">
          </button>
        </div>
              </div>
            {/each} 
          </div>
        </div>  
      {/if}
    </div>
  </div>
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

.action-menu-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.action-menu-btn:hover {
  background-color: #e1e1e1;
}
</style>