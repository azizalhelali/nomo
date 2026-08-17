'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import NotificationPanel from '@/components/common/NotificationPanel';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

interface PendingPost {
  id: string;
  content: string;
  scheduledDate: string;
  images?: string[];
}

export default function PendingPage() {
  const { user, currentProfile } = useAppStore();
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([
    {
      id: '1',
      content: 'محتوى بانتظار الموافقة #1',
      scheduledDate: '2024-01-15 14:00',
      images: [],
    },
    {
      id: '2',
      content: 'محتوى بانتظار الموافقة #2 - صورة جميلة من الطبيعة',
      scheduledDate: '2024-01-16 10:30',
      images: [],
    },
    {
      id: '3',
      content: 'منشور ترويجي خاص',
      scheduledDate: '2024-01-17 18:00',
      images: [],
    },
  ]);

  if (!user || !currentProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    setPendingPosts(pendingPosts.filter((post) => post.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingPosts(pendingPosts.filter((post) => post.id !== id));
  };

  const handleDelete = (id: string) => {
    setPendingPosts(pendingPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      <Header title="المحتوى بانتظار الموافقة" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {pendingPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا يوجد محتوى بانتظار الموافقة</h3>
            <p className="text-gray-500 dark:text-slate-400">جميع المنشورات تمت الموافقة عليها ✨</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-black dark:text-white font-medium mb-2">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        📅 {post.scheduledDate}
                      </p>
                    </div>
                    <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                      بانتظار
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(post.id)}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle size={16} />
                    الموافقة
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReject(post.id)}
                    className="flex-1 gap-2"
                  >
                    <XCircle size={16} />
                    رفض
                  </Button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <NotificationPanel />
    </div>
  );
}
