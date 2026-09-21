import React, { useState } from 'react';
import {
  X,
  Server,
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  users: UserType[];
  currentUser: UserType;
  onClose: () => void;
  onSelectUser: (user: UserType) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  users,
  currentUser,
  onClose,
  onSelectUser,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [domain, setDomain] = useState('CORP');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('لطفاً نام کاربری ویندوز (sAMAccountName) را وارد نمایید.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate Active Directory LDAP query
    setTimeout(() => {
      setLoading(false);
      const cleanUser = usernameInput.replace(/^(corp\\|corp\/)/i, '').toLowerCase();
      const matched = users.find(u =>
        u.username.toLowerCase().includes(cleanUser) ||
        u.email.toLowerCase().includes(cleanUser)
      );

      if (matched) {
        onSelectUser(matched);
        onClose();
      } else {
        // Create an authentic user from AD dynamically
        const newAdUser: UserType = {
          id: `usr-ad-${Date.now()}`,
          username: `${domain}\\${cleanUser}`,
          displayName: cleanUser.toUpperCase(),
          email: `${cleanUser}@corp.local`,
          department: 'واحد سازمانی جدید (AD)',
          internalPhone: '۱۰۰',
          mobilePhone: '۰۹۱۲۰۰۰۰۰۰۰',
          role: 'USER',
          adGroups: ['Domain Users'],
          status: 'ACTIVE',
          lastLoginShamsi: 'هم‌اکنون',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        onSelectUser(newAdUser);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">احراز هویت مرکزی Active Directory</h3>
              <p className="text-xs text-slate-300 mt-0.5">اتصال مستقیم به کنترلر دامنه ویندوز سازمان</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>پروتکل امن Kerberos / LDAPS متصل به ad.company.local</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Windows Domain Credentials Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="text-xs font-bold text-slate-800">
              ورود با نام کاربری و رمز عبور ویندوز:
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">دامنه سازمانی</label>
                <input
                  type="text"
                  value={domain}
                  onChange={e => setDomain(e.target.value.toUpperCase())}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 text-center uppercase"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">نام کاربری ویندوز</label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="مثال: a.tehrani یا s.mohammadi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">رمز عبور ویندوز (Active Directory)</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="رمز عبور حساب کاربری شبکه"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>در حال اعتبارسنجی با Active Directory...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ورود با احراز هویت شبکه ویندوز</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Role Switcher (Preset Profiles) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>ورود سریع آزمایشی با نقش‌های مختلف سازمانی:</span>
              <span className="text-[10px] text-slate-400 font-normal">تغییر فوری نقش</span>
            </div>

            <div className="space-y-2">
              {users.map(u => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-right transition flex items-center justify-between ${
                      isCurrent
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.displayName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{u.displayName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-rose-100 text-rose-800'
                                : u.role === 'CATEGORY_MANAGER'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role === 'SUPER_ADMIN'
                              ? 'مدیر ارشد سیستم'
                              : u.role === 'CATEGORY_MANAGER'
                              ? 'مدیر دسته‌بندی'
                              : 'کاربر عادی'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono" dir="ltr">
                          {u.username} • {u.department}
                        </div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>فعال</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 hover:text-slate-700">انتخاب</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
