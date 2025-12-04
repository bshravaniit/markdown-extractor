// Define types for global libraries loaded via CDN
declare global {
  interface Window {
    mammoth: any;
    XLSX: any;
    JSZip: any;
  }
}

export enum FileStatus {
  IDLE = 'idle',
  PARSING = 'parsing',
  PROCESSING = 'processing', // Sending to Gemini
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface ProcessedFile {
  id: string;
  file: File;
  status: FileStatus;
  originalName: string;
  markdown: string;
  error?: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'csv' | 'other';
}

export interface AppState {
  files: ProcessedFile[];
  selectedFileId: string | null;
  isDragging: boolean;
}
