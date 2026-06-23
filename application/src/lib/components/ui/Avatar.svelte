<script lang="ts">
  let { src = null, name = 'Anonymous', size = 40, onclick = () => {} } = $props<{
    src?: string | null;
    name?: string;
    size?: number;
    onclick?: (e: MouseEvent) => void;}
  >();

  let imageError = $state(false);
  let letter = $derived(name ? name.trim().charAt(0).toUpperCase() : '?');
  const colors = ['#7B939D', '#8FA499', '#A29B83', '#A88B89', '#968CA3', '#8395A7'];
  
  const backgroundColor = $derived.by(() => {
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index]
  })
</script>

<button class="avatar-container" style="width: {size}px; height: {size}px; background-color: {backgroundColor}" {onclick}>
  {#if src && !imageError}
    <img {src} alt={name} onerror={() => (imageError = true)}>
  {:else}
    <div class="letter" style="font-size: {size * 0.4}px;">
      {letter}
    </div>
  {/if}    
</button>

<style>
  .avatar-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    font-weight: 600;
    border: none;
    cursor: pointer;
    outline: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .letter { 
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    user-select: none;
    color: white;
  }
</style>