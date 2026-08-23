'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Eye, EyeOff, Fingerprint } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [savedBiometric, setSavedBiometric] = useState(false);
  const { setUser } = useAppStore();

  useEffect(() => {
    // Create demo account if not exists
    const usersJson = localStorage.getItem('nomo_users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const demoExists = users.some((u: any) => u.email === 'demo@demo.com');

    if (!demoExists) {
      const demoUser = {
        id: Date.now().toString(),
        username: 'Demo User',
        email: 'demo@demo.com',
        password: 'demo123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(demoUser);
      localStorage.setItem('nomo_users', JSON.stringify(users));
    }

    // Check for remembered user
    const rememberedUser = localStorage.getItem('remembered_user');
    if (rememberedUser) {
      try {
        const user = JSON.parse(rememberedUser);
        setUser(user);
        router.push('/profile-select');
      } catch (err) {
        localStorage.removeItem('remembered_user');
      }
    }

    // Check for biometric availability
    checkBiometricAvailability();
  }, [router, setUser]);

  const checkBiometricAvailability = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.credentials) {
        const available = await navigator.credentials.preventSilentAccess?.() !== undefined;
        setBiometricAvailable(true);
        const savedBio = localStorage.getItem('biometric_enrolled');
        setSavedBiometric(!!savedBio);
      }
    } catch (err) {
      console.log('Biometric not available');
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // في تطبيق حقيقي، هنا يتم استدعاء WebAuthn API
      // للآن، نحاكي الدخول البيومتري
      const savedBioData = localStorage.getItem('biometric_data');

      if (!savedBioData) {
        setError('لم تقم بتسجيل بيومتريا من قبل');
        setIsLoading(false);
        return;
      }

      const bioData = JSON.parse(savedBioData);
      const user = bioData.user;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // تذكري تلقائي عند الدخول البيومتري
      localStorage.setItem('remembered_user', JSON.stringify(user));

      router.push('/profile-select');
    } catch (err: any) {
      setError('فشل الدخول البيومتري. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

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
      setError('اسم المستخدم أو البريد الإلكتروني مطلوب');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      // Get all users from localStorage
      const usersJson = localStorage.getItem('nomo_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user by email or username (full name)
      const foundUser = users.find((u: any) =>
        u.email === formData.username || u.username === formData.username
      );

      if (!foundUser || foundUser.password !== formData.password) {
        setError('اسم المستخدم/البريد الإلكتروني أو كلمة مرور غير صحيحة');
        setIsLoading(false);
        return;
      }

      const user = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
        updatedAt: new Date().toISOString(),
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Save remembered user if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('remembered_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('remembered_user');
      }

      router.push('/profile-select');
    } catch (err: any) {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img src="/nomo-logo.png" alt="NOMO Logo" className="w-full h-full" />
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
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="أدخل اسمك أو بريدك الإلكتروني"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <div className="mb-2">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                className="w-full px-4 pl-12 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-4 h-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="absolute inset-0 w-4 h-4 opacity-0 cursor-pointer"
              />
              <div
                className={`w-4 h-4 rounded border border-gray-400 dark:border-slate-500 transition-all ${
                  rememberMe
                    ? 'bg-black dark:bg-white'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-full h-full text-white dark:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors">
              تذكرني
            </span>
          </label>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            دخول
          </Button>

          {/* Biometric Option */}
          {biometricAvailable && savedBiometric && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={isLoading}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Fingerprint size={18} />
                دخول بالبيومتريا
              </button>
            </div>
          )}
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-slate-400">
          ليس لديك حساب؟{' '}
          <Link
            href="/signup"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-8">
          designed by | Aziz Alhelali
        </p>
      </div>
    </div>
  );
}
