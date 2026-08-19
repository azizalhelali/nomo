'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { setUser } = useAppStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username.trim()) {
      setError('اسم المستخدم مطلوب');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);

      const user = {
        id: userCredential.user.uid,
        username: formData.username,
        email: userCredential.user.email || formData.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/profiles');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('بريد إلكتروني أو كلمة مرور غير صحيحة');
      } else if (err.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else {
        setError(err.message || 'فشل تسجيل الدخول. حاول مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img src="/logo-nomo.svg" alt="NOMO Logo" className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">نمو</h1>
          <p className="text-gray-600 dark:text-slate-400">إدارة حساباتك على وسائل التواصل</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              اسم المستخدم
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="أدخل اسم المستخدم"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            دخول
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-8">
          اسم المستخدم: <span className="font-mono">demo</span> | كلمة المرور: <span className="font-mono">demo123</span>
        </p>
      </div>
    </div>
  );
}
