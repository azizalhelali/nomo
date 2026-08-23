'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import NotificationPanel from '@/components/common/NotificationPanel';
import Card from '@/components/common/Card';
import ProfileSwitcher from '@/components/common/ProfileSwitcher';
import { useAppStore } from '@/store';
import { SmartSchedulingService } from '@/lib/smartScheduling';

interface Profile {
  id: string;
  name: string;
  userId: string;
  connectedAccounts: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

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
    const currentProfile = profiles.find((p: Profile) => p.id === profileId);

    if (!currentProfile) {
      router.push('/profile-select');
      return;
    }

    setProfile(currentProfile);

    // عد المنشورات
    const pending = SmartSchedulingService.getPendingPosts(profileId);
    const approved = SmartSchedulingService.getApprovedPosts(profileId);
    setPendingCount(pending.length);
    setApprovedCount(approved.length);

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const connectedAccountsCount = Object.keys(profile.connectedAccounts || {}).length;
  const hasAlerts = connectedAccountsCount === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile section */}
        <div className="mb-8">
          <button
            onClick={() => setIsProfileSwitcherOpen(true)}
            className="group hover:opacity-70 transition-opacity"
          >
            <h1 className="text-3xl font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-white text-right">
              {profile.name} ↓
            </h1>
          </button>
        </div>

        {/* Quick Stats */}
        <Card className="p-6 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-4">نظرة سريعة</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-black dark:text-white">{pendingCount}</p>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">بانتظار الموافقة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-black dark:text-white">{approvedCount}</p>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">مجدولة للنشر</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-black dark:text-white">{connectedAccountsCount}</p>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">حسابات متصلة</p>
            </div>
          </div>
        </Card>

        {/* Alerts - Only if there are issues */}
        {hasAlerts && (
          <Card className="p-4 bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-700 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-black dark:text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-black dark:text-white text-sm">لم تربط أي حسابات بعد</p>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">انتقل إلى الإعدادات لربط حسابات وسائل التواصل</p>
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-4">الحالة الحالية</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-slate-800">
              <span className="text-sm text-gray-600 dark:text-slate-400">المنشورات المنتظرة</span>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600 dark:text-slate-400" />
                <span className="font-semibold text-black dark:text-white">{pendingCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-slate-800">
              <span className="text-sm text-gray-600 dark:text-slate-400">المجدولة للنشر</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-gray-600 dark:text-slate-400" />
                <span className="font-semibold text-black dark:text-white">{approvedCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-slate-400">الحسابات المتصلة</span>
              <span className="font-semibold text-black dark:text-white">{connectedAccountsCount}/7</span>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
      <NotificationPanel />

      <ProfileSwitcher
        isOpen={isProfileSwitcherOpen}
        onClose={() => setIsProfileSwitcherOpen(false)}
        currentProfileId={profile?.id || ''}
      />
    </div>
  );
}
