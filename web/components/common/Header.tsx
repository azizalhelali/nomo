'use client';

import { useEffect } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store';
import clsx from 'clsx';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export default function Header({ title = 'نمو', showNotifications = true }: HeaderProps) {
  const { isDarkMode, toggleDarkMode, unreadCount, setShowNotifications } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>

        <div className="flex items-center gap-4">
          {showNotifications && (
            <button
              onClick={() => setShowNotifications(true)}
              className={clsx(
                'relative p-2 rounded-lg transition-colors duration-200',
                'hover:bg-gray-100 dark:hover:bg-slate-800',
                'text-black dark:text-white'
              )}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {Math.min(unreadCount, 9)}
                </span>
              )}
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className={clsx(
              'p-2 rounded-lg transition-colors duration-200',
              'hover:bg-gray-100 dark:hover:bg-slate-800',
              'text-black dark:text-white'
            )}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
