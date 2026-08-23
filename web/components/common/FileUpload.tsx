'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, Check } from 'lucide-react';
import { FileManagementService } from '@/lib/fileManagement';
import clsx from 'clsx';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileSaved?: () => void;
  profileId?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
  label?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'text' | 'pdf' | 'other';
}

export default function FileUpload({
  onFileSelect,
  onFileSaved,
  profileId,
  multiple = true,
  accept = 'image/*,.pdf,.txt,.doc,.docx',
  maxSize = 50 * 1024 * 1024,
  className = '',
  label = 'إضافة محتوى'
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('text/')) return 'text';
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return 'text';
    return 'other';
  };

  const createPreview = async (file: File): Promise<string | undefined> => {
    const fileType = getFileType(file);

    if (fileType === 'image') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    return undefined;
  };

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file.size > maxSize) {
        alert(`الملف ${file.name} أكبر من الحد المسموح (${Math.round(maxSize / 1024 / 1024)}MB)`);
        continue;
      }

      const preview = await createPreview(file);
      const fileType = getFileType(file);

      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        type: fileType
      });
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFileSelect?.(updatedFiles.map(f => f.file));
  };

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
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFileSelect?.(updatedFiles.map(f => f.file));
  };

  const handleSaveFiles = async () => {
    if (!profileId || files.length === 0) return;

    setIsSaving(true);
    try {
      for (const uploadedFile of files) {
        await FileManagementService.storeFile(uploadedFile.file, profileId);
      }
      setFiles([]);
      onFileSaved?.();
    } catch (err) {
      console.error('خطأ في حفظ الملفات:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
        return <Image size={16} />;
      case 'pdf':
        return <FileText size={16} />;
      case 'text':
        return <FileText size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const getFileLabel = (file: File) => {
    const type = getFileType(file);
    return `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) - ${
      type === 'image' ? 'صورة' : type === 'pdf' ? 'PDF' : type === 'text' ? 'نص' : 'ملف'
    }`;
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors duration-200',
          'cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-900/10',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-gray-900/20'
            : 'border-gray-300 dark:border-slate-600'
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
              <Upload size={32} className="text-black dark:text-white" />
            </div>
          </div>

          <h3 className="font-semibold text-black dark:text-white mb-2">{label}</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
            اسحب الملفات هنا أو اضغط للاختيار
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-500">
            صور، نصوص، PDF ملفات وغيرها - الحد الأقصى {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-black dark:text-white mb-3">
            الملفات المرفوعة ({files.length})
          </h4>
          <div className="space-y-3">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                {/* Preview Thumbnail */}
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt="preview"
                    className="w-12 h-12 rounded object-cover bg-gray-200 dark:bg-slate-700"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                    {getFileIcon(uploadedFile.type)}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400"
                  title="حذف الملف"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Count Badge */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✓ تم تحميل {files.length} ملف ({(files.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(2)}MB)
            </p>
          </div>

          {/* Save Button */}
          {profileId && (
            <button
              onClick={handleSaveFiles}
              disabled={isSaving}
              className={clsx(
                'w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                isSaving
                  ? 'bg-gray-400 dark:bg-slate-600 text-gray-600 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 dark:bg-gray-900/30 text-white dark:text-white hover:bg-blue-700 dark:hover:bg-gray-900/50'
              )}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Check size={18} />
                  حفظ الملفات
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
