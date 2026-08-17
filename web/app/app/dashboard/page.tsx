'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, Heart, MessageCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import NotificationPanel from '@/components/common/NotificationPanel';
import Card from '@/components/common/Card';
import { useAppStore } from '@/store';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, currentProfile, posts, setPosts } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Mock posts data
  const mockPosts = [
    {
      id: '1',
      profileId: currentProfile?.id || '',
      content: 'أول منشور لي! 🎉',
      status: 'published' as const,
      engagements: { likes: 245, comments: 12, shares: 5 },
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      profileId: currentProfile?.id || '',
      content: 'محتوى جديد قادم قريباً 📸',
      status: 'scheduled' as const,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (!user || !currentProfile) {
      router.push('/profiles');
      return;
    }

    setIsLoading(false);
    setPosts(mockPosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentProfile, router, setPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      label: 'المتابعون',
      value: (currentProfile?.followers || 0).toLocaleString(),
      icon: <Users size={24} />,
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'الإعجابات',
      value: '462',
      icon: <Heart size={24} />,
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    },
    {
      label: 'التعليقات',
      value: '89',
      icon: <MessageCircle size={24} />,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'الإحصائيات',
      value: '8.2K',
      icon: <BarChart3 size={24} />,
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{currentProfile?.name}</h2>
          <p className="text-gray-600 dark:text-slate-400">{currentProfile?.handle}</p>
          {currentProfile?.bio && (
            <p className="text-gray-600 dark:text-slate-400 mt-2">{currentProfile.bio}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-black dark:text-white">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-xl font-bold mb-4">آخر المنشورات</h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-black dark:text-white line-clamp-2">
                    {post.content}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : post.status === 'scheduled'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                    }`}
                  >
                    {post.status === 'published'
                      ? 'منشور'
                      : post.status === 'scheduled'
                      ? 'مجدول'
                      : 'مسودة'}
                  </span>
                </div>

                {post.engagements && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                    <span>❤️ {post.engagements.likes}</span>
                    <span>💬 {post.engagements.comments}</span>
                    <span>↗️ {post.engagements.shares}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
      <NotificationPanel />
    </div>
  );
}
