<script lang="ts">
  import { createUploader } from "$lib/utils/uploadthing";
  import { UploadDropzone, UploadButton } from "@uploadthing/svelte";
  import "@uploadthing/svelte/styles.css"; 
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import FileTable from "$lib/components/ui/FileTable.svelte";

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

  function handleDownload(id: string) {
    console.log("Downloading file:", id);
  }

  function handleInfo(id: string) {
    console.log("Showing file info:", id);
  }

  async function handleRename(fileId: string, newName: string) {
    try {
      const response = await fetch("/api/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  fileId, action: "rename", newName})
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to rename file.");
      }
      await invalidateAll();
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
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

  <FileTable 
    files={data.files} 
    onDownload={(id) => console.log("Download", id)}
    onInfo={(id) => console.log("Info", id)}
    onRename={handleRename}
    onDelete={handleSoftDelete}
  />
</div>

<style>
  .action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
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
</style>