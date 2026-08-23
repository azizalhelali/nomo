'use client';

import { useState, useEffect } from 'react';
import { AIAgentTrainingService } from '@/lib/aiAgentTraining';
import { Zap, FileText, ThumbsUp, Trash2, Eye, Upload } from 'lucide-react';
import clsx from 'clsx';

interface AIAgentTrainingDashboardProps {
  profileId: string;
  enabled: boolean;
}

export default function AIAgentTrainingDashboard({
  profileId,
  enabled
}: AIAgentTrainingDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentTrainings, setRecentTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    loadData();
  }, [profileId, enabled]);

  const loadData = () => {
    setLoading(true);
    const stats = AIAgentTrainingService.getTrainingStats(profileId);
    const recent = AIAgentTrainingService.getRecentTraining(profileId, 5);
    setStats(stats);
    setRecentTrainings(recent);
    setLoading(false);
  };

  if (!enabled) {
    return (
      <div className="p-6 bg-blue-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
        <p className="text-blue-900 dark:text-blue-200">
          فعّل وكيل النمو لبدء التدريب والعرض الإحصائيات
        </p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-600 dark:text-slate-400">
          جاري تحميل الإحصائيات...
        </div>
      </div>
    );
  }

  const trainingMethods = [
    {
      id: 'files',
      name: 'رفع الملفات',
      icon: Upload,
      count: stats.fileUploads,
      color: 'bg-gray-100 dark:bg-gray-900/30 text-black dark:text-white',
      description: 'تدريب الوكيل من الملفات والمستندات المرفوعة'
    },
    {
      id: 'approvals',
      name: 'الموافقات',
      icon: ThumbsUp,
      count: stats.approvalsUsed,
      color: 'bg-gray-100 dark:bg-green-900/30 text-black dark:text-green-400',
      description: 'موافقتك على المنشورات تدرب الوكيل'
    },
    {
      id: 'edits',
      name: 'التعديلات',
      icon: FileText,
      count: stats.editsUsed,
      color: 'bg-gray-100 dark:bg-purple-900/30 text-black dark:text-purple-400',
      description: 'تعديلاتك تعطي الوكيل أقوى إشارات التدريب'
    },
    {
      id: 'rejections',
      name: 'الرفض',
      icon: Eye,
      count: stats.rejectionsUsed,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      description: 'رفضك للمحتوى يعلم الوكيل ما لا تفضل'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">مجموع التدريبات</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-1">
                {stats.totalTrainings}
              </p>
            </div>
            <Zap size={32} className="text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">دقة الوكيل</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-1">
                {stats.averageAccuracy}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">{Math.round(stats.averageAccuracy / 10)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">أسلوب الكتابة</p>
            <div className="flex flex-wrap gap-2">
              {stats.writingPatterns.length > 0 ? (
                stats.writingPatterns.slice(0, 3).map((pattern: string) => (
                  <span
                    key={pattern}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-blue-700 dark:text-white text-xs rounded"
                  >
                    {pattern}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 dark:text-slate-400">قيد الاكتشاف...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Training Methods */}
      <div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">طرق التدريب</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingMethods.map(method => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={clsx(
                  'p-4 rounded-lg border-2 border-dashed',
                  method.color.split(' ').slice(0, -2).join(' '),
                  'border-opacity-30'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={20} />
                    <h4 className="font-semibold text-black dark:text-white">{method.name}</h4>
                  </div>
                  <span className="text-2xl font-bold">{method.count}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">{method.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">توزيع التدريبات</h3>
        <div className="space-y-3">
          {Object.entries(stats.trainingMethods.distribution).map(([key, value]: [string, any]) => {
            const total = stats.totalTrainings || 1;
            const percentage = (value / total) * 100;
            const labels: Record<string, string> = {
              fileUploads: 'رفع ملفات',
              approvals: 'موافقات',
              edits: 'تعديلات',
              rejections: 'رفض',
              styleGuides: 'أدلة أسلوب'
            };

            if (value === 0) return null;

            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-slate-300">{labels[key]}</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {value} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trainings */}
      {recentTrainings.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">آخر التدريبات</h3>
          <div className="space-y-3">
            {recentTrainings.map(training => {
              const typeLabels: Record<string, string> = {
                'file-upload': '📁 ملف',
                'approval': '👍 موافقة',
                'edit': '✏️ تعديل',
                'rejection': '❌ رفض',
                'style-guide': '📝 دليل أسلوب'
              };

              return (
                <div
                  key={training.id}
                  className="flex items-start justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      {typeLabels[training.type]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 truncate">
                      {training.source}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-blue-700 dark:text-white text-xs rounded-full">
                      وزن: {training.weight}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      {new Date(training.timestamp).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>نصيحة:</strong> كلما استخدمت طرقاً متنوعة للتدريب (ملفات، موافقات، تعديلات)، كلما تعلم الوكيل أسلوبك بشكل أفضل!
        </p>
      </div>
    </div>
  );
}
