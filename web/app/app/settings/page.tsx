'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, Fingerprint, Lock, Bell } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import NotificationPanel from '@/components/common/NotificationPanel';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

export default function SettingsPage() {
  const router = useRouter();
  const { user, currentProfile, logout } = useAppStore();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!user || !currentProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const settingsGroups = [
    {
      title: 'الأمان',
      items: [
        {
          label: 'الدخول البيومتري',
          description: 'Face ID / Touch ID',
          icon: <Fingerprint size={20} />,
          type: 'toggle' as const,
          value: biometricEnabled,
          onChange: () => setBiometricEnabled(!biometricEnabled),
        },
        {
          label: 'تغيير كلمة المرور',
          description: 'تحديث كلمة المرور الخاصة بك',
          icon: <Lock size={20} />,
          type: 'link' as const,
          action: () => console.log('Change password'),
        },
      ],
    },
    {
      title: 'الإشعارات',
      items: [
        {
          label: 'تفعيل الإشعارات',
          description: 'استلام تنبيهات الأنشطة المهمة',
          icon: <Bell size={20} />,
          type: 'toggle' as const,
          value: notificationsEnabled,
          onChange: () => setNotificationsEnabled(!notificationsEnabled),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      <Header title="الإعدادات" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-bold text-black dark:text-white">{user.username}</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                الحساب الحالي: {currentProfile.name}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-4">
              {group.title}
            </h3>

            <div className="space-y-3">
              {group.items.map((item, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-gray-600 dark:text-slate-400">{item.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-black dark:text-white">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.value
                            ? 'bg-black dark:bg-white'
                            : 'bg-gray-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}

                    {item.type === 'link' && (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-4">
            حول التطبيق
          </h3>
          <Card className="p-4">
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-slate-400">
                <span className="font-medium">إصدار التطبيق:</span> 0.1.0
              </p>
              <p className="text-gray-600 dark:text-slate-400">
                <span className="font-medium">النسخة:</span> Beta
              </p>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full gap-2"
          variant="outline"
        >
          <LogOut size={18} />
          تسجيل خروج
        </Button>
      </div>

      <BottomNav />
      <NotificationPanel />
    </div>
  );
}
