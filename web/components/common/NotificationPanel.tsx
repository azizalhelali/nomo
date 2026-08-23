'use client';

import { X, Check } from 'lucide-react';
import { useAppStore } from '@/store';
import clsx from 'clsx';

export default function NotificationPanel() {
  const { notifications, showNotifications, setShowNotifications, markAsRead } = useAppStore();

  if (!showNotifications) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowNotifications(false)}
      />

      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
          <h2 className="text-lg font-bold">التنبيهات</h2>
          <button
            onClick={() => setShowNotifications(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              لا توجد تنبيهات
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={clsx(
                    'p-4 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors',
                    !notification.read && 'bg-gray-50 dark:bg-slate-800'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        'w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
                        notification.type === 'success' && 'bg-gray-500',
                        notification.type === 'error' && 'bg-red-500',
                        notification.type === 'warning' && 'bg-yellow-500',
                        notification.type === 'info' && 'bg-blue-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {notification.read && (
                      <Check size={16} className="text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
