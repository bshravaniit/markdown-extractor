import React, { useRef, useState } from 'react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded, isDragging, setIsDragging }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
    // Reset value so same files can be selected again
    e.target.value = '';
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        border-2 border-dashed rounded-xl p-8
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
        }
      `}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className={`mb-4 p-4 rounded-full ${isDragging ? 'bg-indigo-100' : 'bg-gray-100 group-hover:bg-indigo-50'} transition-colors`}>
        <i className="ph ph-upload-simple text-3xl text-indigo-600"></i>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Click or drag files here
      </h3>
      
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Supports PDF, DOCX, XLSX, PPTX, CSV, TXT.
        <br />
        Upload multiple files or entire folders.
      </p>

      <div className="flex gap-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
        >
          Select Files
        </button>
        <button
          onClick={() => folderInputRef.current?.click()}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          Select Folder
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.csv,.txt,.md"
      />
      
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore - webkitdirectory is a non-standard attribute but widely supported
        webkitdirectory=""
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Dropzone;