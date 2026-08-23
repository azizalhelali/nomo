'use client';

import { useState, useEffect } from 'react';
import { SmartSchedulingService, ScheduledPost } from '@/lib/smartScheduling';
import { AIAgentTrainingService } from '@/lib/aiAgentTraining';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface WeeklyApprovalPageProps {
  profileId: string;
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  twitter: '𝕏',
  linkedin: '💼',
  facebook: '👥',
  tiktok: '🎵',
  youtube: '🎥',
  newsletter: '📧',
};

export default function WeeklyApprovalPage({ profileId }: WeeklyApprovalPageProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPosts();
  }, [profileId]);

  const loadPendingPosts = () => {
    setLoading(true);
    const pending = SmartSchedulingService.getPendingPosts(profileId);
    setPosts(pending);
    setLoading(false);
  };

  const handleApprove = (postId: string) => {
    SmartSchedulingService.approvePost(profileId, postId);

    // تدريب الوكيل على الموافقة
    const post = posts.find(p => p.id === postId);
    if (post) {
      AIAgentTrainingService.addApprovalTraining(
        profileId,
        postId,
        post.content,
        2
      );
    }

    loadPendingPosts();
  };

  const handleApproveWithTimeChange = (postId: string, newDateTime: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newDate = new Date(newDateTime);
    SmartSchedulingService.approvePost(profileId, postId, newDate);

    // تدريب الوكيل على تعديل الأوقات (وزن أعلى)
    const originalTime = post.suggestedTime.toLocaleTimeString('ar-SA');
    const newTimeStr = newDate.toLocaleTimeString('ar-SA');
    AIAgentTrainingService.addEditTraining(
      profileId,
      postId,
      `وقت النشر المقترح: ${originalTime}`,
      `وقت النشر المعدّل: ${newTimeStr}`,
      5 // وزن عالي - تعديل الوقت يدرب الوكيل
    );

    loadPendingPosts();
  };

  const handleReject = (postId: string) => {
    SmartSchedulingService.rejectPost(profileId, postId);

    // تدريب الوكيل على الرفض
    const post = posts.find(p => p.id === postId);
    if (post) {
      AIAgentTrainingService.addRejectionTraining(
        profileId,
        postId,
        post.content,
        'رفضه المستخدم',
        4
      );
    }

    loadPendingPosts();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-slate-400">
        جاري تحميل المنشورات المنتظرة...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-slate-400">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>لا توجد منشورات منتظرة للموافقة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
        <p className="text-blue-900 dark:text-blue-200 font-medium">
          📋 لديك {posts.length} منشور بانتظار الموافقة الأسبوعية
        </p>
      </div>

      <div className="space-y-3">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{PLATFORM_ICONS[post.platform] || '📱'}</span>
                  <div>
                    <p className="font-semibold text-black dark:text-white capitalize">
                      {post.platform}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      دقة الوكيل: {post.accuracy}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="bg-gray-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg text-right">
                <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold">
                  وقت النشر المقترح:
                </p>
                <p className="text-sm font-mono text-amber-800 dark:text-amber-300">
                  {post.suggestedTime.toLocaleString('ar-SA')}
                </p>
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-sm text-gray-700 dark:text-slate-300 line-clamp-3">
              {post.content.substring(0, 150)}
              {post.content.length > 150 && '...'}
            </div>

            {/* Edit Time Section */}
            {editingPostId === post.id ? (
              <div className="bg-blue-50 dark:bg-gray-900/20 p-3 rounded-lg space-y-2">
                <label className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  ✏️ عدّل وقت النشر:
                </label>
                <input
                  type="datetime-local"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveWithTimeChange(post.id, newTime)}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    ✅ وافق بالوقت الجديد
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-900"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(post.id)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                ✅ وافق بالوقت الحالي
              </button>

              <button
                onClick={() => {
                  setEditingPostId(post.id);
                  setNewTime(post.suggestedTime.toISOString().slice(0, 16));
                }}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                ✏️ عدّل الوقت أولاً
              </button>

              <button
                onClick={() => handleReject(post.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                ❌ رفض
              </button>
            </div>

            {/* Training Info */}
            <div className="text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 p-2 rounded">
              💡 تلميح: تعديل الوقت = أفضل طريقة لتدريب الوكيل على أفضل أوقات النشر
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mt-6">
        <p className="text-green-900 dark:text-green-200 font-medium">
          ✨ بعد الموافقة: جميع المنشورات تنشر تلقائياً في الأوقات المحددة
        </p>
      </div>
    </div>
  );
}
