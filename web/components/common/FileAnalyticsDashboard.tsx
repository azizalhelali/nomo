'use client';

import { useState, useEffect } from 'react';
import { FileManagementService, FileAnalytics, StoredFile } from '@/lib/fileManagement';
import { BarChart3, FileText, Image, Music, Video, Download, Trash2, Eye } from 'lucide-react';
import FilePreview from './FilePreview';
import clsx from 'clsx';

interface FileAnalyticsDashboardProps {
  profileId: string;
  onFileDeleted?: () => void;
}

export default function FileAnalyticsDashboard({
  profileId,
  onFileDeleted
}: FileAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<FileAnalytics | null>(null);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profileId]);

  const loadData = () => {
    setLoading(true);
    const analytics = FileManagementService.getFileAnalytics(profileId);
    const allFiles = FileManagementService.getProfileFiles(profileId);
    setAnalytics(analytics);
    setFiles(allFiles.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ));
    setLoading(false);
  };

  const handleDeleteFile = (fileId: string) => {
    FileManagementService.deleteFile(fileId);
    loadData();
    onFileDeleted?.();
  };

  const handleLinkToAI = (fileId: string) => {
    FileManagementService.linkFileToAI(fileId, profileId);
    loadData();
  };

  const handleLinkToSchedule = (fileId: string) => {
    const scheduleDate = new Date().toISOString().split('T')[0];
    FileManagementService.linkFileToSchedule(fileId, scheduleDate);
    loadData();
  };

  const handleExport = async () => {
    const blob = await FileManagementService.exportFiles(profileId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomo_files_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={18} />;
      case 'pdf':
        return <FileText size={18} />;
      case 'text':
        return <FileText size={18} />;
      case 'video':
        return <Video size={18} />;
      case 'audio':
        return <Music size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-600 dark:text-slate-400">
          جاري تحميل الملفات...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Files */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">إجمالي الملفات</p>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">
                {analytics.totalFiles}
              </p>
            </div>
            <FileText size={32} className="text-blue-500 opacity-50" />
          </div>
        </div>

        {/* Total Size */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">الحجم الكلي</p>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">
                {formatSize(analytics.totalSize)}
              </p>
            </div>
            <BarChart3 size={32} className="text-green-500 opacity-50" />
          </div>
        </div>

        {/* Used for AI */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">مستخدمة في AI</p>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">
                {analytics.usedForAI}
              </p>
            </div>
            <Trash2 size={32} className="text-purple-500 opacity-50" />
          </div>
        </div>

        {/* Used for Scheduling */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">مستخدمة في الجدول</p>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">
                {analytics.usedForScheduling}
              </p>
            </div>
            <Download size={32} className="text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* File Types Distribution */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">توزيع أنواع الملفات</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(analytics.byType).map(([type, count]) => (
            <div
              key={type}
              className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
            >
              <p className="text-2xl mb-2 capitalize">{type}</p>
              <p className="text-xl font-bold text-black dark:text-white">{count}</p>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">ملفات</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      {analytics.totalFiles > 0 && (
        <button
          onClick={handleExport}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Download size={18} />
          تصدير جميع البيانات
        </button>
      )}

      {/* Files List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">الملفات المرفوعة</h3>

        {files.length === 0 ? (
          <p className="text-gray-600 dark:text-slate-400 text-center py-8">
            لم تقم برفع أي ملفات حتى الآن
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    الملف
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    النوع
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    الحجم
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    التاريخ
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr
                    key={file.id}
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-slate-300">
                      {file.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-slate-300">
                        {getFileIcon(file.type)}
                        <span className="capitalize">{file.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-slate-300">
                      {formatSize(file.size)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-slate-300">
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded text-black dark:text-white transition-colors"
                          title="معاينة"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onLinkToAI={() => {
            handleLinkToAI(selectedFile.id);
            setSelectedFile(null);
          }}
          onLinkToSchedule={() => {
            handleLinkToSchedule(selectedFile.id);
            setSelectedFile(null);
          }}
          onDelete={() => {
            handleDeleteFile(selectedFile.id);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
}
