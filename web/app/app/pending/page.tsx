'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Edit2, Calendar } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import NotificationPanel from '@/components/common/NotificationPanel';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

interface PendingContent {
  id: string;
  content: string;
  platform: string;
  accountName: string;
  image?: string;
  createdAt: string;
  scheduledAt?: string;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter / X', icon: '𝕏' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'youtube', name: 'YouTube', icon: '🎥' },
  { id: 'newsletter', name: 'النشرة البريدية', icon: '✉️' },
];

export default function PendingPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingContents, setPendingContents] = useState<PendingContent[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const profileId = localStorage.getItem('currentProfileId');
    const profilesJson = localStorage.getItem('nomo_profiles');

    if (!profileId || !profilesJson) {
      router.push('/profile-select');
      return;
    }

    const profiles = JSON.parse(profilesJson);
    const currentProfile = profiles.find((p: any) => p.id === profileId);

    if (!currentProfile) {
      router.push('/profile-select');
      return;
    }

    // Generate mock pending content from connected accounts
    const contents: PendingContent[] = [];
    const accounts = Object.entries(currentProfile.connectedAccounts || {});

    if (accounts.length > 0) {
      accounts.forEach(([key, account]: [string, any], index) => {
        contents.push({
          id: `pending-${key}-1`,
          content: `محتوى جاهز للنشر على ${account.platform}. هذا المحتوى ينتظر موافقتك قبل النشر. يمكنك الموافقة أو تعديله حسب رغبتك!`,
          platform: account.platform,
          accountName: account.accountName,
          image: index % 2 === 0 ? undefined : '/nomo-logo.png',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      });
    }

    setPendingContents(contents);
    setIsLoading(false);
  }, [user, router]);

  const handleApprove = (id: string) => {
    setPendingContents(pendingContents.filter(c => c.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingContents(pendingContents.filter(c => c.id !== id));
  };

  const handleEdit = () => {
    alert('تعديل المحتوى - قريباً');
  };

  const getPlatformInfo = (platformId: string) => {
    return PLATFORMS.find(p => p.id === platformId);
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
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 relative">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">في انتظار الموافقة</h1>
          <p className="text-gray-600 dark:text-slate-400">
            المحتوى الجاهز من جميع حساباتك والذي ينتظر موافقتك قبل النشر
          </p>
        </div>

        {pendingContents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              لا يوجد محتوى في انتظار الموافقة
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              كل المحتوى جاهز ومنشور!
            </p>
            <Button onClick={() => router.push('/app/dashboard')} className="inline-block">
              العودة إلى لوحة التحكم
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingContents.map(content => {
              const platformInfo = getPlatformInfo(content.platform);
              return (
                <Card key={content.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Image */}
                    {content.image && (
                      <div className="md:col-span-1">
                        <img
                          src={content.image}
                          alt="content"
                          className="w-full h-48 object-cover rounded-lg bg-gray-200 dark:bg-slate-800"
                        />
                      </div>
                    )}

                    {/* Content Details */}
                    <div className={content.image ? 'md:col-span-2' : 'md:col-span-3'}>
                      {/* Platform Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{platformInfo?.icon}</span>
                        <div>
                          <h3 className="font-bold text-black dark:text-white">
                            {content.accountName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {platformInfo?.name}
                          </p>
                        </div>
                      </div>

                      {/* Content Text */}
                      <p className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed">
                        {content.content}
                      </p>

                      {/* Date Info */}
                      {content.scheduledAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-6">
                          <Calendar size={16} />
                          <span>
                            موعد النشر المقترح: {new Date(content.scheduledAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 flex-wrap">
                        <Button
                          onClick={() => handleApprove(content.id)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Check size={18} />
                          موافقة
                        </Button>
                        <Button
                          onClick={() => handleEdit()}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit2 size={18} />
                          تعديل
                        </Button>
                        <button
                          onClick={() => handleReject(content.id)}
                          className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                        >
                          <X size={18} />
                          رفض
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
      <NotificationPanel />
    </div>
  );
}
