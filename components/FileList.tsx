import React from 'react';
import { ProcessedFile, FileStatus } from '../types';

interface FileListProps {
  files: ProcessedFile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusIcon = (status: FileStatus) => {
  switch (status) {
    case FileStatus.PROCESSING:
    case FileStatus.PARSING:
      return <i className="ph ph-spinner animate-spin text-indigo-500" />;
    case FileStatus.COMPLETED:
      return <i className="ph ph-check-circle text-green-500" />;
    case FileStatus.ERROR:
      return <i className="ph ph-warning-circle text-red-500" />;
    default:
      return <i className="ph ph-hourglass text-gray-400" />;
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <i className="ph ph-file-pdf text-red-500" />;
    case 'docx': return <i className="ph ph-file-doc text-blue-500" />;
    case 'xlsx': return <i className="ph ph-file-xls text-green-600" />;
    case 'pptx': return <i className="ph ph-file-ppt text-orange-500" />;
    case 'csv': return <i className="ph ph-table text-emerald-600" />;
    default: return <i className="ph ph-file-text text-gray-500" />;
  }
};

const FileList: React.FC<FileListProps> = ({ files, selectedId, onSelect, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400 italic">
        <i className="ph ph-files text-3xl mb-2 opacity-50"></i>
        No files uploaded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onSelect(file.id)}
          className={`
            group relative p-3 rounded-lg cursor-pointer border transition-all duration-200
            ${selectedId === file.id 
              ? 'bg-indigo-50 border-indigo-400 shadow-sm' 
              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getFileIcon(file.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${selectedId === file.id ? 'text-indigo-900' : 'text-gray-700'}`}>
                {file.originalName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs">
                  {getStatusIcon(file.status)}
                </span>
                <span className={`text-xs capitalize ${file.status === FileStatus.ERROR ? 'text-red-500' : 'text-gray-500'}`}>
                   {file.status === FileStatus.PROCESSING ? 'AI Processing...' : file.status}
                </span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-red-500 transition-all"
            >
              <i className="ph ph-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;