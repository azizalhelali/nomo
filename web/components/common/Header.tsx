'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Moon, Sun, ChevronDown, User } from 'lucide-react';
import { useAppStore } from '@/store';
import AccountPanel from './AccountPanel';
import clsx from 'clsx';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export default function Header({ title = 'نمو', showNotifications = true }: HeaderProps) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, unreadCount, setShowNotifications } = useAppStore();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userAvatar');
    }
    return null;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const profileId = localStorage.getItem('currentProfileId');
    const profilesJson = localStorage.getItem('nomo_profiles');

    if (profilesJson) {
      const allProfiles = JSON.parse(profilesJson);
      setProfiles(allProfiles);
      const current = allProfiles.find((p: any) => p.id === profileId);
      setCurrentProfile(current);
    }
  }, []);

  const handleProfileChange = (profileId: string) => {
    localStorage.setItem('currentProfileId', profileId);
    setShowProfileMenu(false);
    router.refresh();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/nomo-logo.png" alt="نمو" className="h-12 w-auto" />

          {/* Profile Switcher */}
          {profiles.length > 1 && currentProfile && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200',
                  'hover:bg-gray-100 dark:hover:bg-slate-800',
                  'text-sm font-medium text-black dark:text-white',
                  'border border-gray-200 dark:border-slate-700'
                )}
              >
                <span>{currentProfile.name}</span>
                <ChevronDown size={16} className={clsx('transition-transform', showProfileMenu && 'rotate-180')} />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-48">
                  {profiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileChange(profile.id)}
                      className={clsx(
                        'w-full px-4 py-3 text-right transition-colors border-b border-gray-100 dark:border-slate-800 last:border-b-0',
                        profile.id === currentProfile.id
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="font-medium">{profile.name}</div>
                      <div className={clsx('text-xs', profile.id === currentProfile.id ? 'text-gray-200' : 'text-gray-500 dark:text-slate-400')}>
                        {Object.keys(profile.connectedAccounts || {}).length} حساب
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAccountPanel(true)}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-slate-700"
          >
            {avatar ? (
              <img src={avatar} alt="حسابي" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-gray-600 dark:text-slate-400" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {Math.min(unreadCount, 9)}
              </span>
            )}
          </button>
        </div>
      </div>

      <AccountPanel isOpen={showAccountPanel} onClose={() => setShowAccountPanel(false)} />
    </header>
  );
}
