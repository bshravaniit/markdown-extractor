import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';
import MarkdownPreview from './components/MarkdownPreview';
import { ProcessedFile, FileStatus } from './types';
import { processFile } from './services/fileParser';

const App: React.FC = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const determineFileType = (name: string): ProcessedFile['type'] => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['docx', 'doc'].includes(ext)) return 'docx';
    if (['xlsx', 'xls'].includes(ext)) return 'xlsx';
    if (['pptx', 'ppt'].includes(ext)) return 'pptx';
    if (['csv'].includes(ext)) return 'csv';
    return 'other';
  };

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const newProcessedFiles: ProcessedFile[] = newFiles.map(file => ({
      id: uuidv4(),
      file,
      status: FileStatus.IDLE,
      originalName: file.name,
      markdown: '',
      type: determineFileType(file.name)
    }));

    setFiles(prev => [...prev, ...newProcessedFiles]);
    
    // Auto-select first new file if none selected
    if (!selectedFileId && newProcessedFiles.length > 0) {
      setSelectedFileId(newProcessedFiles[0].id);
    }

    // Start processing queue
    newProcessedFiles.forEach(fileItem => {
      processFileItem(fileItem.id, fileItem.file);
    });
  }, [selectedFileId]);

  const processFileItem = async (id: string, file: File) => {
    // Update status to processing
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: FileStatus.PARSING } : f));

    try {
      // 1. Parse File & 2. Send to Gemini (Handled in service)
      const markdown = await processFile(file);

      setFiles(prev => prev.map(f => 
        f.id === id 
          ? { ...f, status: FileStatus.COMPLETED, markdown } 
          : f
      ));
    } catch (error: any) {
      console.error(`Error processing file ${file.name}:`, error);
      setFiles(prev => prev.map(f => 
        f.id === id 
          ? { ...f, status: FileStatus.ERROR, error: error.message || "Failed to process" } 
          : f
      ));
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  };

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col z-20 shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-indigo-600 mb-1">
            <i className="ph ph-magic-wand text-3xl"></i>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Markdown Extractor</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium ml-1">Universal Document to Markdown</p>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-6">
          <Dropzone 
            onFilesAdded={handleFilesAdded} 
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
          
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Files ({files.length})
              </h2>
              {files.length > 0 && (
                <button 
                   onClick={() => { setFiles([]); setSelectedFileId(null); }}
                   className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <FileList 
              files={files} 
              selectedId={selectedFileId} 
              onSelect={setSelectedFileId}
              onDelete={handleDelete}
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700 font-medium">
               <i className="ph ph-lightning-fill"></i> Powered by Gemini 2.5 Flash
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50 relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-4">
             {selectedFile ? (
               <>
                 <span className={`w-2 h-2 rounded-full ${selectedFile.status === FileStatus.COMPLETED ? 'bg-green-500' : selectedFile.status === FileStatus.ERROR ? 'bg-red-500' : 'bg-indigo-500 animate-pulse'}`}></span>
                 <h2 className="text-gray-900 font-medium truncate max-w-md">{selectedFile.originalName}</h2>
               </>
             ) : (
                <span className="text-gray-400 text-sm">No file selected</span>
             )}
          </div>
          <div className="flex gap-4">
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                 Documentation <i className="ph ph-arrow-square-out"></i>
              </a>
          </div>
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 overflow-hidden">
            <MarkdownPreview file={selectedFile} />
        </div>
      </div>
    </div>
  );
};

export default App;