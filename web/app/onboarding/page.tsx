'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';
import OnboardingTour from '@/components/common/OnboardingTour';
import { useAppStore } from '@/store';
import { useTour } from '@/hooks/useTour';

interface ProfileSetup {
  id: string;
  name: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [profiles, setProfiles] = useState<ProfileSetup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showTour, completeTour } = useTour('onboarding');

  const tourSteps = [
    {
      id: 'welcome',
      title: '🎯 إنشاء الحسابات',
      description: 'الحساب هو مركز تحكم خاص بك. كل حساب يمكنه إدارة عدة حسابات على وسائل التواصل الاجتماعي.',
    },
    {
      id: 'add',
      title: '➕ إضافة حساب جديد',
      description: 'انقر على "إضافة حساب" لإنشاء حساب جديد. يمكنك إنشاء 2-3 حسابات أو أكثر.',
    },
    {
      id: 'name',
      title: '📝 تسمية الحساب',
      description: 'أعط كل حساب اسماً مميزاً مثل "Brand A" أو "Personal" أو "Business".',
    },
    {
      id: 'ready',
      title: '✨ أنت جاهز!',
      description: 'انقر على "ابدأ الآن" لإكمال الإعداد. ستتمكن من ربط حسابات وسائل التواصل في الخطوة التالية.',
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const addProfile = () => {
    const newProfile: ProfileSetup = {
      id: Date.now().toString(),
      name: '',
    };
    setProfiles([...profiles, newProfile]);
  };

  const removeProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const updateProfile = (id: string, name: string) => {
    setProfiles(profiles.map(p =>
      p.id === id ? { ...p, name } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (profiles.length === 0) {
      setError('يجب إضافة حساب واحد على الأقل');
      return;
    }

    for (const profile of profiles) {
      if (!profile.name.trim()) {
        setError('جميع الحسابات يجب أن تحتوي على اسم');
        return;
      }
    }

    setIsLoading(true);

    try {
      const setupProfiles = profiles.map(p => ({
        id: p.id,
        name: p.name,
        userId: user?.id,
        connectedAccounts: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // قراءة البروفايلات الموجودة وإضافة البروفايلات الجديدة
      const existingProfiles = localStorage.getItem('nomo_profiles');
      const allProfiles = existingProfiles
        ? [...JSON.parse(existingProfiles), ...setupProfiles]
        : setupProfiles;

      localStorage.setItem('nomo_profiles', JSON.stringify(allProfiles));
      localStorage.setItem('currentProfileId', setupProfiles[0].id);

      router.push('/profile-select');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الحسابات');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 relative">
      <OnboardingTour
        steps={tourSteps}
        tourId="onboarding"
        isVisible={showTour}
        onComplete={completeTour}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            أهلاً، {user.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            الآن قم بإنشاء الحسابات الخاصة بك
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {profiles.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-slate-400 mb-4">
                  لم تضف أي حساب بعد
                </p>
              </div>
            ) : (
              profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                      الحساب {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProfile(profile.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                      اسم الحساب
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile(profile.id, e.target.value)}
                      placeholder="مثال: Brand A, Personal"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={addProfile}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            إضافة حساب
          </button>

          <Button
            type="submit"
            disabled={isLoading || profiles.length === 0}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? 'جاري الحفظ...' : 'ابدأ الآن'}
            {!isLoading && <ArrowRight size={20} />}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-blue-900 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>ملاحظة:</strong> كل حساب يمكنه ربط عدة حسابات على وسائل التواصل من الإعدادات
          </p>
        </div>
      </div>
    </div>
  );
}
