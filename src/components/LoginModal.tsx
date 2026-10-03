import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { User as UserType } from '../types';
import { storageService } from '../services/storageService';

interface LoginModalProps {
  users?: UserType[];
  currentUser?: UserType | null;
  onClose: () => void;
  onSelectUser: (user: UserType) => void;
  loginNotice?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onSelectUser,
  loginNotice,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('لطفاً نام کاربری خود را وارد نمایید.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('لطفاً کلمه عبور خود را وارد نمایید.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await storageService.login(usernameInput.trim(), passwordInput);
      if (res.success && res.user) {
        onSelectUser(res.user);
        onClose();
      } else {
        // Sanitize error message to prevent leaking domain infrastructure details to regular users
        const rawMsg = res.message || '';
        if (
          rawMsg.includes('عدم برقراری ارتباط') ||
          rawMsg.includes('در دسترس نیست') ||
          rawMsg.includes('تنظیم نشده است') ||
          rawMsg.includes('پورت') ||
          rawMsg.includes('IP')
        ) {
          setErrorMsg('سرویس احراز هویت در حال حاضر در دسترس نیست. لطفاً با مدیر سیستم تماس بگیرید.');
        } else {
          setErrorMsg(rawMsg || 'نام کاربری یا کلمه عبور اشتباه است.');
        }
      }
    } catch {
      setErrorMsg('خطای برقراری ارتباط با سامانه. لطفاً لحظاتی دیگر تلاش فرمایید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">ورود به حساب کاربری</h3>
              <p className="text-xs text-slate-300 mt-0.5">ورود به سامانه پرسنلی سازمان</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {loginNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div>ورود به حساب کاربری الزامی است:</div>
                <div className="font-normal text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">{loginNotice}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                نام کاربری
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="نام کاربری سازمانی..."
                  dir="ltr"
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition pr-10 text-left font-mono"
                />
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
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
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="کلمه عبور..."
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition pr-10 pl-10 text-left font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال بررسی مشخصات...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>ورود به سامانه</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
