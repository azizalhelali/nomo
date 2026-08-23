'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  userId: string;
  connectedAccounts?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfileId: string;
}

export default function ProfileSwitcher({ isOpen, onClose, currentProfileId }: ProfileSwitcherProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    try {
      const stored = localStorage.getItem('nomo_profiles');
      if (stored) {
        setProfiles(JSON.parse(stored));
      }
    } catch (err) {
      console.error('خطأ في جلب البروفايلات:', err);
    }
  }, [isOpen]);

  const handleSwitchProfile = (profileId: string) => {
    localStorage.setItem('currentProfileId', profileId);
    window.location.href = '/app/dashboard';
    onClose();
  };

  const handleAddProfile = () => {
    router.push('/profile-select');
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentProfileId');
    localStorage.removeItem('nomo_profiles');
    router.push('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-16 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2">
        <div className="p-4 space-y-2">
          {/* Header */}
          <div className="pb-3 border-b border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold">البروفايلات</p>
          </div>

          {/* Profile List */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => handleSwitchProfile(profile.id)}
                className={`w-full text-right px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  profile.id === currentProfileId
                    ? 'bg-gray-100 dark:bg-gray-900/30 text-blue-900 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                {profile.name}
                {profile.id === currentProfileId && ' ✓'}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="py-2 border-t border-gray-200 dark:border-slate-700" />

          {/* Add Profile Button */}
          <button
            onClick={handleAddProfile}
            className="w-full text-right px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-900/20 text-black dark:text-white transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة بروفايل جديد
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-right px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
}
