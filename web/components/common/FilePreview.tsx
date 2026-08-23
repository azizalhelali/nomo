'use client';

import { useState } from 'react';
import { X, Download, Link2, Trash2, Copy } from 'lucide-react';
import { StoredFile } from '@/lib/fileManagement';
import clsx from 'clsx';

interface FilePreviewProps {
  file: StoredFile;
  onClose?: () => void;
  onLinkToAI?: (fileId: string) => void;
  onLinkToSchedule?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export default function FilePreview({
  file,
  onClose,
  onLinkToAI,
  onLinkToSchedule,
  onDelete
}: FilePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(file.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (file.preview) {
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.name;
      link.click();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-900 dark:to-blue-950 p-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-1 truncate">{file.name}</h2>
            <p className="text-sm text-blue-100">
              {formatSize(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          {file.preview && file.type === 'image' && (
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">معاينة الصورة</h3>
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-48 object-cover rounded-lg bg-gray-200 dark:bg-slate-800"
              />
            </div>
          )}

          {/* Text Content */}
          {file.content && file.type === 'text' && (
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">محتوى الملف</h3>
              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-6">
                  {file.content}
                </p>
              </div>
              {file.content.length > 300 && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  ... تم قص المحتوى (عرض أول 300 حرف فقط)
                </p>
              )}
            </div>
          )}

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">نوع الملف</p>
              <p className="text-sm font-semibold text-black dark:text-white capitalize">
                {file.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">الحجم</p>
              <p className="text-sm font-semibold text-black dark:text-white">
                {formatSize(file.size)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">نوع MIME</p>
              <p className="text-xs text-gray-700 dark:text-slate-300 font-mono">{file.mimeType}</p>
            </div>
            {file.tags && file.tags.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">الوسوم</p>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-blue-700 dark:text-white text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyPath}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                copied
                  ? 'bg-gray-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              )}
            >
              <Copy size={16} />
              {copied ? 'تم النسخ' : 'نسخ الاسم'}
            </button>
            {file.preview && (
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-900/30 text-blue-700 dark:text-white rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-gray-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                تحميل
              </button>
            )}
            {onLinkToAI && (
              <button
                onClick={() => onLinkToAI(file.id)}
                className="px-3 py-2 bg-gray-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 size={16} />
                ربط بـ AI
              </button>
            )}
            {onLinkToSchedule && (
              <button
                onClick={() => onLinkToSchedule(file.id)}
                className="px-3 py-2 bg-gray-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 size={16} />
                جدول النشر
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2 col-span-2"
              >
                <Trash2 size={16} />
                حذف الملف
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
