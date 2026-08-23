'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import OnboardingTour from '@/components/common/OnboardingTour';
import { useAppStore } from '@/store';
import { useTour } from '@/hooks/useTour';

interface Profile {
  id: string;
  name: string;
  userId: string;
  connectedAccounts: any;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSelectPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showTour, completeTour } = useTour('profile-select');

  const tourSteps = [
    {
      id: 'welcome',
      title: '👋 اختر الحساب',
      description: 'اختر الحساب الذي تريد العمل معه. يمكنك التبديل بين الحسابات في أي وقت.',
    },
    {
      id: 'connected',
      title: '🔗 الحسابات المتصلة',
      description: 'كل حساب يعرض عدد الحسابات المتصلة. انقر على الحساب للدخول إليه.',
    },
    {
      id: 'ready',
      title: '✨ هيا بنا!',
      description: 'اختر أحد الحسابات للبدء في إدارة حساباتك على وسائل التواصل.',
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const profilesJson = localStorage.getItem('nomo_profiles');
    if (profilesJson) {
      const allProfiles = JSON.parse(profilesJson);
      const userProfiles = allProfiles.filter((p: Profile) => p.userId === user.id);
      setProfiles(userProfiles);
    }
    setIsLoading(false);
  }, [user, router]);

  const selectProfile = (profileId: string) => {
    localStorage.setItem('currentProfileId', profileId);
    router.push('/app/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-slate-400">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 relative">
      <OnboardingTour
        steps={tourSteps}
        tourId="profile-select"
        isVisible={showTour}
        onComplete={completeTour}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            اختر الحساب
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            اختر الحساب الذي تريد العمل معه
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              لم يتم العثور على حسابات
            </p>
            <Button onClick={() => router.push('/onboarding')}>
              إنشاء حساب جديد
            </Button>
          </div>
        ) : (
          <>
            {/* Add New Profile Button */}
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-black dark:hover:border-white transition-colors text-right mb-6"
            >
              <h2 className="text-lg font-bold text-black dark:text-white mb-2">
                ➕ إضافة بروفايل جديد
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                أنشئ بروفايل جديد للإدارة
              </p>
            </button>

            {/* Profiles List */}
            <div className="grid gap-4">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => selectProfile(profile.id)}
                  className="p-6 border-2 border-gray-200 dark:border-slate-700 rounded-lg hover:border-black dark:hover:border-white transition-colors text-right"
                >
                  <h2 className="text-xl font-bold text-black dark:text-white mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                    {Object.keys(profile.connectedAccounts || {}).length} حساب متصل
                  </p>
                  <div className="flex items-center justify-start gap-2">
                    <ArrowLeft size={18} className="text-black dark:text-white" />
                    <span className="text-sm font-medium text-black dark:text-white">
                      الدخول إلى الحساب
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
