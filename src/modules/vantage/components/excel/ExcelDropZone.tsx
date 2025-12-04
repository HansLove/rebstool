import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';

interface ExcelDropZoneProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export default function ExcelDropZone({
  onFileSelect,
  onError,
  acceptedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  maxSizeMB = 10,
}: ExcelDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.includes(file.type) || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls');
    
    if (!isValidType) {
      return 'Please upload a valid Excel file (.xlsx or .xls)';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    return null;
  }, [acceptedTypes, maxSizeMB]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      if (onError) {
        onError(validationError);
      }
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [validateFile, onFileSelect, onError]);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          }
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        `}
      >
        <input
          type="file"
          id="excel-file-input"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleFileInput}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <label
              htmlFor="excel-file-input"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className={`
                p-4 rounded-full transition-colors
                ${isDragging 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
                }
              `}>
                <Upload className={`
                  h-8 w-8 transition-colors
                  ${isDragging 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `} />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isDragging ? 'Drop your Excel file here' : 'Drag and drop your Excel file'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or <span className="text-blue-600 dark:text-blue-400 font-medium">browse</span> to upload
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Supports .xlsx and .xls files (max {maxSizeMB}MB)
                </p>
              </div>
            </label>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

