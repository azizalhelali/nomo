'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';
import { Profile } from '@/types';

export default function ProfilesPage() {
  const router = useRouter();
  const { user, profiles, setProfiles, setCurrentProfile, logout } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Mock profiles data
  const mockProfiles: Profile[] = [
    {
      id: '1',
      userId: user?.id || '',
      name: 'حسابي الشخصي',
      platform: 'instagram',
      handle: '@myinstagram',
      followers: 15420,
      bio: 'مصور ومحتوى كريتور',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '',
      name: 'حساب العمل',
      platform: 'instagram',
      handle: '@mybusiness',
      followers: 8950,
      bio: 'منتجات وخدمات متميزة',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(false);
    setProfiles(mockProfiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, setProfiles]);

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push('/app/dashboard');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-8">
      <Header title="اختر البروفايل" showNotifications={false} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            مرحباً، {user?.username}
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className="p-6 cursor-pointer hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-black dark:text-white">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    {profile.handle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                    {profile.followers?.toLocaleString()} متابع
                  </p>
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-4 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </Card>
          ))}

          {/* Add Profile Card */}
          <Card className="p-6 flex items-center justify-center min-h-56 border-2 border-dashed border-gray-300 dark:border-slate-700">
            <button className="flex flex-col items-center gap-3 text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">
              <Plus size={32} />
              <span className="text-sm font-medium">إضافة بروفايل جديد</span>
            </button>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut size={18} />
            تسجيل خروج
          </Button>
        </div>
      </div>
    </div>
  );
}
