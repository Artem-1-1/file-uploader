export function formatDate(dateString: string | Date) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSize(bytes: number) {
  if (bytes === 0) return "--";
  const k = 1024;
  const sizes = ["Byte", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

interface FileTypeConfig {
  label: string;
  icon: string;
}

const MIME_MAP: Record<string, FileTypeConfig> = {
  "image/svg+xml" : { label : "SVG Image", icon : "/images/svg-icon.svg" },
  "application/pdf" : { label : "PDF Document", icon : "/images/pdf.svg" },
  "text/plain" : {label: "Text Document", icon: "/images/text-file-icon.svg" },
  "text/csv" : { label : " CSV Spreadsheet", icon : "images/cvg-icon.svg" },
};

const FOLDER_CONFIG: FileTypeConfig = { label: 'Folder', icon: '/images/folder.svg' };
const DEFAULT_FILE_CONFIG: FileTypeConfig = { label: 'File', icon: '/images/file.svg' };

function getFileConfig(type: string, mimeType?: string | null): FileTypeConfig {
  if (type === "folder") return FOLDER_CONFIG;
  if(!mimeType) return DEFAULT_FILE_CONFIG;

  if (MIME_MAP[mimeType]) return MIME_MAP[mimeType];

  if (mimeType.startsWith('image/')) {
    return { label: 'Image', icon: "/images/image.svg"}
  }

  return DEFAULT_FILE_CONFIG;
}

export function formatFileType(type: string, mimeType?: string | null): string {
  return getFileConfig(type, mimeType).label;
}

export function getFileIcon(type: string, mimeType?: string | null): string {
  return getFileConfig(type, mimeType).icon;
}