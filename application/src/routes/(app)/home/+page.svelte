<script lang="ts">
  import { createUploader } from "$lib/utils/uploadthing";
  import { UploadDropzone, UploadButton } from "@uploadthing/svelte";
  import "@uploadthing/svelte/styles.css"; 
  import type { PageData } from "./$types";
  import { invalidateAll, goto } from "$app/navigation";
  import FileTable from "$lib/components/files/FileTable.svelte";
  import { fileSidebarStore } from "$lib/stores/fileSidebar.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { enhance } from "$app/forms";

  let { data, form } : { data: PageData, form?: any } = $props(); 
  
  const currentParentId = $derived(data.parentId || null);

  let isDragging = $state(false);
  let dragCounter = 0;

  let isModalOpen = $state(false);

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

  function handleInfo(fileId: string) {
    const file = data.files.find(f => f.id === fileId);
    if (file) {
      fileSidebarStore.open(file);
    }
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

  function openCreateFolderModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function handleOpenFolder(folderId: string) {
    goto(`?parentId=${folderId}`, { keepFocus: true });
  }

  function goBack() {
    if (data.backToId) {
      goto(`?parentId=${data.backToId}`)
    } else {
      goto('?')
    }
  }
</script>

<div class="page-header">
  <div class="action-buttons">
    {#if currentParentId}
      <Button variant="secondary" onclick={goBack}>
        <img src="/images/arrow-left.svg" alt="back" class="icon">
        Back
      </Button>
    {/if}

    <div class="upload-button-wrapper">
      <UploadButton {uploader} appearance={{allowedContent: "display: none;"}}/>
    </div>
    <Button variant="secondary" onclick={openCreateFolderModal}>
      <img src="/images/new-folder.svg" alt="new-folder icon">
      New Folder
    </Button>
  </div>

  {#if data.breadcrumbsPath && data.breadcrumbsPath.length > 0}
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      <a href="/home" class="crumb-link">Home</a>
      {#each data.breadcrumbsPath as crumb, i}
        <img src="/images/chevronright.svg" alt="" aria-hidden="true" class="chevron"/>
        {#if i === data.breadcrumbsPath.length - 1}
          <div class="current-crumb" aria-current="page">{crumb.name}</div>
        {:else}
          <a href="?parentId={crumb.id}" class="crumb-link">{crumb.name}</a>
        {/if}
      {/each}  
    </nav>
  {:else}  
    <h2>All files</h2>
  {/if}
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
    canDownload={true}
    onInfo={handleInfo}
    onRename={handleRename}
    onDelete={handleSoftDelete}
    onOpen={handleOpenFolder}
  />
</div>

<Modal title="Create New Folder" bind:isOpen={isModalOpen}>
  <form 
    method="POST"
    action="?/createFolder"
    use:enhance={() => {
      return async ({ update }) => {
        await update({ reset: true });
        isModalOpen = false; 
      };
    }}>
    <input type="hidden" name="parentId" value={currentParentId || ''} />

    <Input
      name="name"
      value={form?.name ?? ''}
      label="Folder Name"
      placeholder="Enter folder name"
      error={form?.error}
      onkeydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).closest('form')?.requestSubmit();
        }
      }}
      />
    <div class="modal-actions">
      <Button variant="secondary" type="button" onclick={closeModal}>Cancel</Button>
      <Button type="submit">Create</Button>
    </div>
  </form>
</Modal>

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

  .modal-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .breadcrumbs { 
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 14px;
    color: var(--text-color);
    margin-top: 0.5rem;
  }

  .crumb-link {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .crumb-link:hover {
    text-decoration: underline;
  }

  .current-crumb {
    font-weight: 600;
  }

  .chevron { 
    width: 12px;
    height: 12px;
    filter: var(--svg-invert);
  }
</style>