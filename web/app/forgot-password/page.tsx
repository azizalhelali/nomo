'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [timer, setTimer] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const generateCode = () => {
    return Math.random().toString().slice(2, 8).padEnd(6, '0');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      setIsLoading(false);
      return;
    }

    try {
      const usersJson = localStorage.getItem('nomo_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const userExists = users.some((u: any) => u.email === email);

      if (!userExists) {
        setError('البريد الإلكتروني غير مسجل');
        setIsLoading(false);
        return;
      }

      // Generate and store verification code
      const code = generateCode();
      setGeneratedCode(code);
      localStorage.setItem('reset_code', code);
      localStorage.setItem('reset_email', email);
      setTimer(180); // 3 minutes
      setStep('code');
    } catch (err) {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode.trim()) {
      setError('الرمز مطلوب');
      return;
    }

    if (verificationCode !== generatedCode) {
      setError('الرمز غير صحيح');
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    try {
      const usersJson = localStorage.getItem('nomo_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const updatedUsers = users.map((u: any) =>
        u.email === email ? { ...u, password: newPassword } : u
      );

      localStorage.setItem('nomo_users', JSON.stringify(updatedUsers));
      localStorage.removeItem('reset_code');
      localStorage.removeItem('reset_email');

      setStep('success');
    } catch (err) {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
    localStorage.setItem('reset_code', code);
    setVerificationCode('');
    setTimer(180);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/nomo-logo.png" alt="NOMO Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">نمو</h1>
          <p className="text-gray-600 dark:text-slate-400">استعادة كلمة المرور</p>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full px-4 pl-10 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              إرسال رمز التحقق
            </Button>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                <strong>الرمز:</strong> {generatedCode}
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-300 text-center mt-2">
                في الإنتاج، سيتم إرسال الرمز إلى بريدك الإلكتروني
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                رمز التحقق
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="أدخل الرمز المكون من 6 أرقام"
                maxLength={6}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200 text-center text-lg font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" size="lg">
                التحقق
              </Button>
              <Button
                type="button"
                onClick={handleResendCode}
                disabled={timer > 0}
                className={`flex-1 text-sm ${
                  timer > 0
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                    : ''
                }`}
                size="lg"
              >
                {timer > 0 ? `إعادة الإرسال (${timer}s)` : 'إعادة إرسال الرمز'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
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

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              تعيين كلمة المرور
            </Button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2">
                تم إعادة تعيين كلمة المرور
              </h2>
              <p className="text-sm text-green-800 dark:text-green-300">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
              </p>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full">العودة إلى تسجيل الدخول</Button>
            </Link>
          </div>
        )}

        {/* Back to Login Link */}
        {step !== 'success' && (
          <p className="text-center mt-6 text-gray-600 dark:text-slate-400">
            تذكرت كلمة المرور؟{' '}
            <Link
              href="/login"
              className="text-black dark:text-white font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
