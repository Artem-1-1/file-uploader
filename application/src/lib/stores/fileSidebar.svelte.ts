import { writable } from "svelte/store";

export interface FileInfo {
  id: string;
  name: string;
  type: string;
  mimeType: string | null;
  size: number;
  createdAt: string | Date;
}

function createFileSidebarStore() {
  const { subscribe, update } = writable({
    isOpen: false,
    file: null as FileInfo | null
  });

  return {
    subscribe,
    open: (file: FileInfo) => update(() => ({ isOpen: true, file })),
    close: () => update(() => ({ isOpen: false, file: null })),
    toggle: () => update(state => ({ ...state, isOpen: !state.isOpen }))
  };
}

export const fileSidebarStore = createFileSidebarStore();