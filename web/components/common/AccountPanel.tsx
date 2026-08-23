'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Upload, Settings, Bell, Lock, HelpCircle, LogOut, X, ChevronRight, Plus, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store';

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountPanel({ isOpen, onClose }: AccountPanelProps) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, unreadCount } = useAppStore();
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userAvatar');
    }
    return null;
  });

  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || 'المستخدم@مثال.com';
    }
    return 'المستخدم@مثال.com';
  });

  const [activeView, setActiveView] = useState<'main' | 'profile' | 'settings' | 'notifications'>('main');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ حجم الملف أكبر من 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatar(result);
        localStorage.setItem('userAvatar', result);
        setMessage('✅ تم تحديث الصورة');
        setTimeout(() => setMessage(''), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    localStorage.removeItem('userAvatar');
    setMessage('✅ تم حذف الصورة');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('nomo_user');
    localStorage.removeItem('currentProfileId');
    router.push('/login');
    onClose();
  };

  if (!isOpen) return null;

  // Main View
  if (activeView === 'main') {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

        <div className="fixed top-16 left-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-black dark:text-white">حسابي</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <X size={18} className="text-black dark:text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-slate-700 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                {avatar ? (
                  <img src={avatar} alt="حسابي" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-gray-600 dark:text-slate-400" />
                )}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black dark:text-white truncate">حسابي</p>
                <p className="text-sm text-gray-600 dark:text-slate-400 truncate">{email}</p>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">اضغط على الصورة للتغيير</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Profiles List */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">حسابات</h3>
            <div className="space-y-2">
              <div className="p-3 bg-black dark:bg-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                <p className="font-medium text-white dark:text-black text-sm">Personal</p>
                <p className="text-xs text-gray-300 dark:text-gray-600">0 حساب متصل</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-slate-900 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                <p className="font-medium text-black dark:text-white text-sm">Brand A</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">0 حساب متصل</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-slate-900 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                <p className="font-medium text-black dark:text-white text-sm">Business</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">0 حساب متصل</p>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 mb-2">
            <div className="relative p-2">
              <Bell size={18} className="text-black dark:text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {Math.min(unreadCount, 9)}
                </span>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-black dark:text-white" />
              ) : (
                <Moon size={18} className="text-black dark:text-white" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {/* Profile Settings */}
            <button
              onClick={() => setActiveView('profile')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <User size={18} className="text-black dark:text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-black dark:text-white text-sm">حسابي</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">بيانات الحساب والصورة</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setActiveView('notifications')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <Bell size={18} className="text-black dark:text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-black dark:text-white text-sm">الإشعارات</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">تفضيلات التنبيهات</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
            </button>

            {/* Account Settings */}
            <button
              onClick={() => setActiveView('settings')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <Settings size={18} className="text-black dark:text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-black dark:text-white text-sm">الإعدادات</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">كلمة المرور والأمان</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
            </button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </>
    );
  }

  // Profile View
  if (activeView === 'profile') {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

        <div className="fixed top-16 left-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-black dark:text-white">الملف الشخصي</h2>
            <button
              onClick={() => setActiveView('main')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <ChevronRight size={18} className="text-black dark:text-white rotate-180" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Avatar Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-black dark:text-white">الصورة الشخصية</h3>
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-slate-700">
                  {avatar ? (
                    <img src={avatar} alt="صورتي" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-gray-600 dark:text-slate-400" />
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors hover:opacity-80 text-sm flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  رفع صورة
                </button>
                {avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 text-sm"
                  >
                    حذف
                  </button>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <label className="text-sm font-medium text-black dark:text-white block mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                defaultValue={email}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
              />
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">سيتم إرسال رابط تأكيد البريد</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white block mb-2">الاسم الكامل</label>
              <input
                type="text"
                defaultValue="عزيز"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white block mb-2">عن نفسك</label>
              <textarea
                placeholder="أخبرنا عن اهتماماتك..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white resize-none"
                rows={3}
              />
            </div>

            {/* Message */}
            {message && (
              <div className="p-3 rounded-lg text-sm text-center font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                {message}
              </div>
            )}

            {/* Save Button */}
            <button className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors hover:opacity-80 text-sm">
              حفظ التغييرات
            </button>
          </div>
        </div>
      </>
    );
  }

  // Notifications View
  if (activeView === 'notifications') {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

        <div className="fixed top-16 left-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-black dark:text-white">الإشعارات</h2>
            <button
              onClick={() => setActiveView('main')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <ChevronRight size={18} className="text-black dark:text-white rotate-180" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Email Notifications */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">البريد الإلكتروني</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">المنشورات المجدولة</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">طلبات الموافقة</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">إحصائيات الأداء</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">تعليقات وردود</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">الإشعارات الفورية</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">تنبيهات مهمة</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">الصوت والاهتزاز</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Do Not Disturb */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">عدم الإزعاج</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">تفعيل وضع عدم الإزعاج</span>
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                </div>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm text-center"
                  defaultValue="22:00"
                />
                <span className="text-xs text-gray-500 dark:text-slate-500 text-center block">إلى</span>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm text-center"
                  defaultValue="08:00"
                />
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors hover:opacity-80 text-sm mt-4">
              حفظ التفضيلات
            </button>
          </div>
        </div>
      </>
    );
  }

  // Settings View
  if (activeView === 'settings') {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

        <div className="fixed top-16 left-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-black dark:text-white">الإعدادات</h2>
            <button
              onClick={() => setActiveView('main')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <ChevronRight size={18} className="text-black dark:text-white rotate-180" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Change Password */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">كلمة المرور</h3>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              <button className="w-full px-4 py-2 mt-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors hover:opacity-80 text-sm">
                تحديث كلمة المرور
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">المصادقة الثنائية</h3>
              <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-black dark:text-white">تفعيل المصادقة الثنائية</span>
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500">حماية إضافية لحسابك</p>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">الجلسات النشطة</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg text-sm">
                  <div className="font-medium text-black dark:text-white mb-1">هذا الجهاز</div>
                  <div className="text-xs text-gray-500 dark:text-slate-500">Chrome on macOS</div>
                  <div className="text-xs text-gray-500 dark:text-slate-500">قبل ساعة واحدة</div>
                </div>
              </div>
              <button className="w-full px-4 py-2 mt-2 border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 text-sm">
                تسجيل الخروج من جميع الأجهزة
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 mb-3 uppercase">الخصوصية</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">السماح بالبحث عن حسابي</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm text-black dark:text-white">عرض آخر نشاط</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4 border-red-200 dark:border-red-900">
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400 mb-3 uppercase">منطقة الخطر</h3>
              <button className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-sm">
                حذف الحساب بشكل دائم
              </button>
              <p className="text-xs text-gray-500 dark:text-slate-500 text-center mt-2">لا يمكن التراجع عن هذا الإجراء</p>
            </div>

            {/* Security Info */}
            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs text-gray-600 dark:text-slate-400 text-center border-t border-gray-200 dark:border-slate-700 mt-4">
              🔒 حسابك محمي بتشفير آمن من الدرجة العسكرية
            </div>
          </div>
        </div>
      </>
    );
  }
}
