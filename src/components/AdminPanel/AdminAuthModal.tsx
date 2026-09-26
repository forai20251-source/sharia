import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
  users: User[];
  currentUser: User | null;
  verifyCredentials: (
    username: string,
    password: string
  ) => { success: boolean; user?: User; error?: string };
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  users,
  currentUser,
  verifyCredentials,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default username suggestion when opened
  useEffect(() => {
    if (isOpen) {
      if (currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATEGORY_MANAGER')) {
        setUsername(currentUser.username.replace(/^(corp\\|corp\/)/i, ''));
      } else {
        const firstAdmin = users.find(u => u.role === 'SUPER_ADMIN');
        setUsername(firstAdmin ? firstAdmin.username.replace(/^(corp\\|corp\/)/i, '') : 'admin');
      }
      setPassword('');
      setErrorMsg('');
      setShowPassword(false);
      setLoading(false);
    }
  }, [isOpen, currentUser, users]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('لطفاً نام کاربری مدیر را وارد نمایید.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('لطفاً کلمه عبور را وارد نمایید.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = verifyCredentials(username, password);
      setLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'نام کاربری یا کلمه عبور اشتباه است.');
      }
    }, 350);
  };

  const handleQuickFill = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full z-10 overflow-hidden border border-slate-200/80 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">احراز هویت بخش مدیریت</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">ورود به پنل نظارت و تنظیمات سامانه</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] bg-slate-800/90 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>نیازمند نام کاربری و رمز عبور با مجوز Super Admin یا Category Manager</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              نام کاربری مدیر
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="مثلاً: admin یا sara.khodro"
                className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono outline-none transition pr-10 text-left"
                dir="ltr"
                autoFocus
              />
              <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              کلمه عبور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="کلمه عبور حساب مدیر..."
                className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono outline-none transition pr-10 pl-10 text-left"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Access Chips */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">حساب‌های کاربری پیش‌فرض:</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">رمز: admin123</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="text-right p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-800 hover:text-rose-700 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition flex items-center justify-between cursor-pointer"
              >
                <div className="truncate">
                  <div className="font-bold truncate">علیرضا تهرانی</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">admin</div>
                </div>
                <span className="text-[9px] bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-1 py-0.5 rounded font-bold shrink-0">
                  مدیر ارشد
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('sara.khodro', 'admin123')}
                className="text-right p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-200 dark:hover:border-amber-800 hover:text-amber-700 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition flex items-center justify-between cursor-pointer"
              >
                <div className="truncate">
                  <div className="font-bold truncate">سارا محمدی</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">sara.khodro</div>
                </div>
                <span className="text-[9px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1 py-0.5 rounded font-bold shrink-0">
                  مدیر خودرو
                </span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              {loading ? (
                <span>در حال بررسی اعتبارسنجی...</span>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>تایید و ورود به بخش مدیریت</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
