'use client';

import { useState, useEffect } from 'react';
import { AgentInstructionsService, AgentInstruction } from '@/lib/agentInstructions';
import { Plus, Trash2, Edit2, Save, X, Copy } from 'lucide-react';
import clsx from 'clsx';

interface AgentInstructionsManagerProps {
  profileId: string;
}

const PLATFORMS = [
  { id: 'newsletter', name: 'النشرة البريدية', icon: '📧' },
  { id: 'instagram', name: 'إنستقرام', icon: '📸' },
  { id: 'twitter', name: 'تويتر', icon: '𝕏' },
  { id: 'tiktok', name: 'تيك توك', icon: '🎵' },
  { id: 'linkedin', name: 'لينكدإن', icon: '💼' },
  { id: 'facebook', name: 'فيسبوك', icon: '👥' },
  { id: 'youtube', name: 'يوتيوب', icon: '🎥' },
];

export default function AgentInstructionsManager({
  profileId
}: AgentInstructionsManagerProps) {
  const [instructions, setInstructions] = useState<AgentInstruction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'instagram',
    instruction: '',
    priority: 5,
    examples: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructions();
  }, [profileId]);

  const loadInstructions = () => {
    setLoading(true);
    const instr = AgentInstructionsService.getProfileInstructions(profileId);
    setInstructions(instr);
    setLoading(false);
  };

  const handleAddInstruction = () => {
    if (!formData.title.trim() || !formData.instruction.trim()) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    if (editingId) {
      AgentInstructionsService.updateInstruction(profileId, editingId, {
        title: formData.title,
        platform: formData.platform,
        instruction: formData.instruction,
        priority: formData.priority,
        examples: formData.examples ? formData.examples.split('\n').filter(e => e.trim()) : undefined,
      });
      setEditingId(null);
    } else {
      AgentInstructionsService.addInstruction(
        profileId,
        formData.title,
        formData.instruction,
        formData.platform,
        formData.priority,
        formData.examples ? formData.examples.split('\n').filter(e => e.trim()) : undefined
      );
    }

    setFormData({ title: '', platform: 'instagram', instruction: '', priority: 5, examples: '' });
    setShowAddForm(false);
    loadInstructions();
  };

  const handleDeleteInstruction = (id: string) => {
    if (confirm('هل تريد حذف هذه التعليمة؟')) {
      AgentInstructionsService.deleteInstruction(profileId, id);
      loadInstructions();
    }
  };

  const handleEditInstruction = (instr: AgentInstruction) => {
    setFormData({
      title: instr.title,
      platform: instr.platform || 'instagram',
      instruction: instr.instruction,
      priority: instr.priority,
      examples: instr.examples?.join('\n') || '',
    });
    setEditingId(instr.id);
    setShowAddForm(true);
  };

  const handleApplyTemplate = (template: AgentInstruction) => {
    const newInstr = AgentInstructionsService.addInstruction(
      profileId,
      template.title,
      template.instruction,
      template.platform,
      template.priority,
      template.examples
    );
    loadInstructions();
  };

  const getPlatformName = (platform?: string) => {
    return PLATFORMS.find(p => p.id === platform)?.name || 'عام';
  };

  const getPlatformIcon = (platform?: string) => {
    return PLATFORMS.find(p => p.id === platform)?.icon || '📝';
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-slate-400">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-slate-400">إجمالي التعليمات</p>
          <p className="text-3xl font-bold text-black dark:text-white mt-1">{instructions.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-slate-400">الفعالة</p>
          <p className="text-3xl font-bold text-black dark:text-white mt-1">
            {instructions.filter(i => i.enabled).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-slate-400">الأولويات العالية</p>
          <p className="text-3xl font-bold text-black dark:text-white mt-1">
            {instructions.filter(i => i.priority >= 7).length}
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            إضافة تعليمة جديدة للوكيل
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {editingId ? 'تعديل التعليمة' : 'إضافة تعليمة جديدة'}
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                عنوان التعليمة
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: النشرة البريدية - صيغة HTML"
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">المنصة</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
              >
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Instruction */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">التعليمة</label>
              <textarea
                value={formData.instruction}
                onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                placeholder="اكتب التعليمات التفصيلية التي يجب على الوكيل أن يتبعها عند إنشاء محتوى..."
                rows={6}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                الأولوية: {formData.priority}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">أمثلة (اختياري)</label>
              <textarea
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                placeholder="اكتب أمثلة على التطبيق (سطر واحد لكل مثال)"
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-black dark:text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddInstruction}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({ title: '', platform: 'instagram', instruction: '', priority: 5, examples: '' });
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} />
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions List */}
      <div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">التعليمات المحفوظة</h3>
        {instructions.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-slate-400">
            لم تضف أي تعليمات بعد
          </div>
        ) : (
          <div className="space-y-4">
            {instructions.sort((a, b) => b.priority - a.priority).map(instr => (
              <div
                key={instr.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getPlatformIcon(instr.platform)}</span>
                      <div>
                        <h4 className="font-bold text-black dark:text-white">{instr.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {getPlatformName(instr.platform)} • أولوية: {instr.priority}/10
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditInstruction(instr)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded text-black dark:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteInstruction(instr.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Instruction Text */}
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                  {instr.instruction}
                </div>

                {/* Examples */}
                {instr.examples && instr.examples.length > 0 && (
                  <div className="bg-blue-50 dark:bg-gray-900/20 p-3 rounded text-sm">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">أمثلة:</p>
                    {instr.examples.map((ex, idx) => (
                      <p key={idx} className="text-blue-800 dark:text-blue-300 text-xs mb-1">• {ex}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-4">قوالب مسبقة</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          استخدم هذه القوالب كنقطة انطلاق
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(AgentInstructionsService.getTemplates()).map(template => (
            <div
              key={template.id}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3"
            >
              <div>
                <p className="font-semibold text-black dark:text-white">{template.title}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{template.description}</p>
              </div>
              <button
                onClick={() => handleApplyTemplate(template)}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                استخدام هذا القالب
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
