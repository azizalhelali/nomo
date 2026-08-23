'use client';

import { useState, useRef } from 'react';
import { User, Upload, X } from 'lucide-react';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function ProfileAvatar({ size = 'md' }: ProfileAvatarProps) {
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userAvatar');
    }
    return null;
  });
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatar(result);
        localStorage.setItem('userAvatar', result);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    localStorage.removeItem('userAvatar');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all hover:opacity-80 flex-shrink-0 overflow-hidden`}
      >
        {avatar ? (
          <img src={avatar} alt="صورتي" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
            <User size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} className="text-gray-600 dark:text-slate-400" />
          </div>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setShowModal(false)}
          />

          <div className="fixed top-16 right-4 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-black dark:text-white">صورتي</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
              >
                <X size={18} className="text-black dark:text-white" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-slate-700">
                {avatar ? (
                  <img src={avatar} alt="صورتي" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                    <User size={40} className="text-gray-600 dark:text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors hover:opacity-80 flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                رفع صورة
              </button>
            </div>

            {/* Remove Button - Show only if avatar exists */}
            {avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                حذف الصورة
              </button>
            )}

            {/* Info */}
            <p className="text-xs text-gray-600 dark:text-slate-400 text-center">
              الحد الأقصى: 5MB
            </p>
          </div>
        </>
      )}
    </>
  );
}
