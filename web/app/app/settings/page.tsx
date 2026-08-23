'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Eye, EyeOff, Instagram, Twitter, Music, Linkedin, Facebook, Youtube, Mail, Zap, Settings2, LogOut } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import FileUpload from '@/components/common/FileUpload';
import AgentInstructionsManager from '@/components/common/AgentInstructionsManager';
import { useAppStore } from '@/store';
import { AIAgentTrainingService } from '@/lib/aiAgentTraining';
import clsx from 'clsx';

interface Profile {
  id: string;
  name: string;
  userId: string;
  connectedAccounts: Record<string, ConnectedAccount>;
  createdAt: string;
  updatedAt: string;
}

interface ConnectedAccount {
  platform: string;
  accountName: string;
  apiKey: string;
  apiSecret: string;
  accessToken?: string;
  connectedAt: string;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter },
  { id: 'tiktok', name: 'TikTok', icon: Music },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'newsletter', name: 'النشرة البريدية', icon: Mail },
];

type Tab = 'accounts' | 'ai' | 'content' | 'general';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isDarkMode, toggleDarkMode } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('accounts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [formData, setFormData] = useState({ accountName: '', apiKey: '', apiSecret: '', accessToken: '' });
  const [showPasswords, setShowPasswords] = useState({ apiKey: false, apiSecret: false, accessToken: false });
  const [error, setError] = useState('');
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [agentApiKey, setAgentApiKey] = useState('');
  const [showAgentApiKey, setShowAgentApiKey] = useState(false);

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
    setIsLoading(false);
  }, [user, router]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.accountName.trim() || !formData.apiKey.trim() || !formData.apiSecret.trim()) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    if (!profile) return;

    const accountKey = `${selectedPlatform}_${Date.now()}`;
    const updatedProfile: Profile = {
      ...profile,
      connectedAccounts: {
        ...profile.connectedAccounts,
        [accountKey]: {
          platform: selectedPlatform,
          accountName: formData.accountName,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          accessToken: formData.accessToken || undefined,
          connectedAt: new Date().toISOString(),
        },
      },
    };

    const profilesJson = localStorage.getItem('nomo_profiles');
    const profiles = JSON.parse(profilesJson || '[]');
    const updatedProfiles = profiles.map((p: Profile) => (p.id === profile.id ? updatedProfile : p));

    localStorage.setItem('nomo_profiles', JSON.stringify(updatedProfiles));
    setProfile(updatedProfile);
    setFormData({ accountName: '', apiKey: '', apiSecret: '', accessToken: '' });
    setShowAddForm(false);
  };

  const handleDeleteAccount = (accountKey: string) => {
    if (!profile) return;

    const updatedConnectedAccounts = { ...profile.connectedAccounts };
    delete updatedConnectedAccounts[accountKey];

    const updatedProfile: Profile = {
      ...profile,
      connectedAccounts: updatedConnectedAccounts,
    };

    const profilesJson = localStorage.getItem('nomo_profiles');
    const profiles = JSON.parse(profilesJson || '[]');
    const updatedProfiles = profiles.map((p: Profile) => (p.id === profile.id ? updatedProfile : p));

    localStorage.setItem('nomo_profiles', JSON.stringify(updatedProfiles));
    setProfile(updatedProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('nomo_user');
    localStorage.removeItem('currentProfileId');
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

  if (!profile) {
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'accounts', label: 'الحسابات', icon: <Plus size={18} /> },
    { id: 'ai', label: 'وكيل الذكاء', icon: <Zap size={18} /> },
    { id: 'content', label: 'المحتوى', icon: <Mail size={18} /> },
    { id: 'general', label: 'عام', icon: <Settings2 size={18} /> },
  ];

  const platformInfo = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 relative">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">{profile.name}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">إدارة إعداداتك وحساباتك</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-slate-800 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-blue-600 text-black dark:text-white'
                  : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              {/* Connected Accounts */}
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white mb-4">الحسابات المتصلة</h2>
                {Object.keys(profile.connectedAccounts).length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600 dark:text-slate-400">لم تقم بربط أي حسابات بعد</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(profile.connectedAccounts).map(([key, account]) => {
                      const platformData = PLATFORMS.find(p => p.id === account.platform);
                      const PlatformIcon = platformData?.icon;
                      return (
                        <Card key={key} className="p-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {PlatformIcon && <PlatformIcon size={24} className="text-black dark:text-white" />}
                            <div>
                              <p className="font-semibold text-black dark:text-white">{account.accountName}</p>
                              <p className="text-sm text-gray-600 dark:text-slate-400">{platformData?.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAccount(key)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Account Form */}
              <div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  إضافة حساب جديد
                </button>

                {showAddForm && (
                  <Card className="p-6 mt-4">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">إضافة حساب</h3>

                    {error && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleAddAccount} className="space-y-4">
                      {/* Platform Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">المنصة</label>
                        <select
                          value={selectedPlatform}
                          onChange={(e) => setSelectedPlatform(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
                        >
                          {PLATFORMS.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Account Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">اسم الحساب</label>
                        <input
                          type="text"
                          value={formData.accountName}
                          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                          placeholder="مثال: حسابي الشخصي"
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
                        />
                      </div>

                      {/* API Key */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">API Key</label>
                        <div className="relative">
                          <input
                            type={showPasswords.apiKey ? 'text' : 'password'}
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            className="w-full px-4 pl-12 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, apiKey: !showPasswords.apiKey })}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                          >
                            {showPasswords.apiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* API Secret */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">API Secret</label>
                        <div className="relative">
                          <input
                            type={showPasswords.apiSecret ? 'text' : 'password'}
                            value={formData.apiSecret}
                            onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                            className="w-full px-4 pl-12 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, apiSecret: !showPasswords.apiSecret })}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                          >
                            {showPasswords.apiSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                          حفظ الحساب
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setFormData({ accountName: '', apiKey: '', apiSecret: '', accessToken: '' });
                            setError('');
                          }}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* AI Agent Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Enable/Disable Agent */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white">وكيل النمو الذكي</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      فعّل الوكيل ليتعلم من أسلوبك بطرق متعددة
                    </p>
                  </div>
                  <button
                    onClick={() => setAgentEnabled(!agentEnabled)}
                    className={clsx(
                      'w-14 h-7 rounded-full transition-colors flex items-center',
                      agentEnabled ? 'bg-gray-500' : 'bg-gray-300 dark:bg-slate-700'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full bg-white transition-transform',
                        agentEnabled ? 'translate-x-7' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              </Card>

              {agentEnabled && (
                <>
                  {/* API Key Configuration */}
                  <Card className="p-6">
                    <label className="block text-sm font-medium mb-2 text-black dark:text-white">مفتاح API</label>
                    <div className="relative mb-4">
                      <input
                        type={showAgentApiKey ? 'text' : 'password'}
                        value={agentApiKey}
                        onChange={(e) => setAgentApiKey(e.target.value)}
                        placeholder="أدخل مفتاح API"
                        className="w-full px-4 pl-12 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAgentApiKey(!showAgentApiKey)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        {showAgentApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Button className="w-full">حفظ المفتاح</Button>
                  </Card>

                  {/* Training Dashboard */}
                  <AIAgentTrainingDashboard profileId={profile.id} enabled={agentEnabled} />

                  {/* Training Methods Info */}
                  <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">طرق التدريب المتاحة</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <span className="text-2xl">📁</span>
                        <div>
                          <p className="font-semibold text-black dark:text-white">رفع الملفات</p>
                          <p className="text-gray-600 dark:text-slate-400">انقل مستندات وملفات نصية لتدريب الوكيل</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-2xl">👍</span>
                        <div>
                          <p className="font-semibold text-black dark:text-white">الموافقات</p>
                          <p className="text-gray-600 dark:text-slate-400">كل موافقة على محتوى = تدريب ضعيف</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-2xl">✏️</span>
                        <div>
                          <p className="font-semibold text-black dark:text-white">التعديلات</p>
                          <p className="text-gray-600 dark:text-slate-400">أقوى طرق التدريب - كل تعديل يحسّن الوكيل</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-semibold text-black dark:text-white">الرفض</p>
                          <p className="text-gray-600 dark:text-slate-400">يعلم الوكيل ما لا تفضله</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-2xl">📝</span>
                        <div>
                          <p className="font-semibold text-black dark:text-white">تعليمات مخصصة</p>
                          <p className="text-gray-600 dark:text-slate-400">أضف تعليمات دقيقة للوكيل لكل منصة</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Agent Instructions Manager */}
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">تعليمات الوكيل المخصصة</h3>
                    <AgentInstructionsManager profileId={profile.id} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <FileUpload
                label="إضافة محتوى (صور، نصوص، PDF، فيديو، صوت)"
                profileId={profile.id}
                multiple={true}
                accept="image/*,.pdf,.txt,.doc,.docx,.pptx,video/*,audio/*,.mp3,.mp4"
                maxSize={100 * 1024 * 1024}
              />

              <div>
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 border-2 border-blue-600 text-black dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors"
                >
                  عرض الملفات المرفوعة
                </button>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-black dark:text-white">الوضع الليلي</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">استخدم المظهر الداكن</p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={clsx(
                      'w-14 h-7 rounded-full transition-colors flex items-center',
                      isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full bg-white transition-transform',
                        isDarkMode ? 'translate-x-7' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-t-2 border-red-200 dark:border-red-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-black dark:text-white">تسجيل الخروج</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">تسجيل الخروج من حسابك</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
