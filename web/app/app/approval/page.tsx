'use client';

import { useState, useEffect } from 'react';
import WeeklyApprovalPage from '@/components/common/WeeklyApprovalPage';

export default function ApprovalPage() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');

  useEffect(() => {
    // جلب البروفايلات المحفوظة
    try {
      const stored = localStorage.getItem('nomo_profiles');
      if (stored) {
        const parsedProfiles = JSON.parse(stored);
        setProfiles(parsedProfiles);
        if (parsedProfiles.length > 0) {
          setSelectedProfile(parsedProfiles[0].id);
          setProfileId(parsedProfiles[0].id);
        }
      }
    } catch (err) {
      console.error('خطأ في جلب البروفايلات:', err);
    }
  }, []);

  const handleProfileChange = (newProfileId: string) => {
    setSelectedProfile(newProfileId);
    setProfileId(newProfileId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            📋 الموافقة الأسبوعية
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            راجع جميع المنشورات التي ولدها الوكيل ووافق عليها أو عدّلها
          </p>
        </div>

        {/* Profile Selector */}
        {profiles.length > 1 && (
          <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              اختر البروفايل:
            </label>
            <select
              value={selectedProfile}
              onChange={(e) => handleProfileChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white"
            >
              {profiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Main Content */}
        {profileId ? (
          <WeeklyApprovalPage profileId={profileId} />
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-slate-400">
            <p>لم يتم العثور على أي بروفايلات</p>
          </div>
        )}
      </div>
    </div>
  );
}
