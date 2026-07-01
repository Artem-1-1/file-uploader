<script lang="ts">
  import { createUploadThing } from "$lib/utils/uploadthing";
  import Button from "$lib/components/ui/Button.svelte";

  let files = $state<FileList | null>(null);
  let isUploading = $state(false);
  let parentId = $state<string | null>(null);

  const { startUpload } = createUploadThing("fileUploader", {
    onUploadBegin: () => {
      isUploading = true;
    },
    onClientUploadComplete: (res) => {
      isUploading = false;
      files = null;
      console.log("Response Data: ", res)
    },
    onUploadError: (error) => {
      isUploading = false;
      console.log(`Error: ${error.message}`);
    }
  });
  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    files = target.files;
  }

  async function handleUpload() {
    if (!files || files.length === 0) return;
    const fileToUpload = files[0];

    await startUpload([fileToUpload], {
      parentId: parentId,
      filename: fileToUpload.name,
      fileSize: fileToUpload.size
    })
  }
</script>

<div class="upload-container">
  <input
    type="file"
    accept="image/*, application/pdf"
    bind:files
    disabled={isUploading}
    onchange={handleFileChange}>
    <Button 
    variant="primary"
    disabled={!files || isUploading}
    onclick={handleUpload}
  >
    {#if isUploading}
      Uploading...
    {:else}
      Upload file
    {/if}
  </Button>
</div>