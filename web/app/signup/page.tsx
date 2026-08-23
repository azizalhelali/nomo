'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/common/Button';
import OnboardingTour from '@/components/common/OnboardingTour';
import { useAppStore } from '@/store';
import { useTour } from '@/hooks/useTour';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { setUser } = useAppStore();
  const { showTour, completeTour } = useTour('signup');

  const tourSteps = [
    {
      id: 'welcome',
      title: '👋 مرحباً بك في نمو',
      description: 'تطبيق شامل لإدارة جميع حسابات وسائل التواصل الاجتماعي من مكان واحد. دعنا ننشئ حسابك الأول!',
      image: '/nomo-logo.png',
    },
    {
      id: 'form',
      title: '📝 ملء البيانات الأساسية',
      description: 'ابدأ بإدخال اسمك الكامل وبريدك الإلكتروني. تأكد من أن كلمة المرور آمنة وتحتوي على 6 أحرف على الأقل.',
    },
    {
      id: 'password',
      title: '🔐 كلمة المرور',
      description: 'يمكنك إظهار وإخفاء كلمة المرور باستخدام أيقونة العين. تأكد من تطابق كلمتي المرور.',
    },
    {
      id: 'ready',
      title: '✨ أنت جاهز!',
      description: 'انقر على "إنشاء حساب" لمتابعة إنشاء البروفايلات الخاصة بك.',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('الاسم الكامل مطلوب');
      return false;
    }

    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Get all users from localStorage
      const usersJson = localStorage.getItem('nomo_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email === formData.email)) {
        setError('هذا البريد الإلكتروني مسجل بالفعل');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('nomo_users', JSON.stringify(users));

      // Set current user
      const user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/onboarding');
    } catch (err: any) {
      setError('فشل التسجيل. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 relative">
      <OnboardingTour
        steps={tourSteps}
        tourId="signup"
        isVisible={showTour}
        onComplete={completeTour}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img src="/nomo-logo.png" alt="NOMO Logo" className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">نمو</h1>
          <p className="text-gray-600 dark:text-slate-400">إنشاء حساب جديد</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              الاسم الكامل
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="أعد إدخال كلمة المرور"
                className="w-full px-4 pl-12 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-slate-400">
          لديك حساب بالفعل؟{' '}
          <Link
            href="/login"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
