<script lang="ts">
  import { createUploader } from "$lib/utils/uploadthing";
  import { UploadDropzone, UploadButton } from "@uploadthing/svelte";
  import "@uploadthing/svelte/styles.css"; 
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props(); 
  
  const currentParentId = $derived(data.parentId || null);

  const uploader = createUploader("fileUploader", {
    input: {
      get parentId() { return currentParentId; }
    },
    onClientUploadComplete: (res) => {
      console.log(`onClientUploadComplete`, res);
      console.log("Upload Completed");
    },
    onUploadError: (error: Error) => {
      console.log(`ERROR! ${error.message}`);
    },
  });
</script>

<main class="page-container">
  <div class="page-nav">
    <h2>All files</h2>
    <div class="upload-button-wrapper">
      <UploadButton {uploader} />
    </div>
  </div>
  <UploadDropzone {uploader}/>
</main>