<script lang="ts">
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import FileTable from "$lib/components/ui/FileTable.svelte";

  let { data }: { data: PageData } = $props();

  async function handleRestore(fileId: string) {
    try {
      const response = await fetch("/api/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, action: "restore" })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed restore file from basket.")
      }
    await invalidateAll();  
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  }

  async function handleHardDelete(fileId: string) {
    try {
      const response = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed deleted from database/s3.")
      }
    await invalidateAll();  
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  }
</script>

<main class="page-container">
  <div class="page-nav">
    <div class="page-header">
      <h2>Basket</h2>
    </div>

    <div class="table-wrapper">
      <FileTable
      files={data.deletedFiles}
      isDeletedView={true}
      onRestore={handleRestore}
      onDelete={handleHardDelete}/>
    </div>
  </div>  
</main>