import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  EyeOff,
  WifiOff,
  Check,
  RefreshCw,
  Info,
} from 'lucide-react';
import { User as UserType } from '../types';
import { storageService } from '../services/storageService';

interface LoginModalProps {
  users: UserType[];
  currentUser: UserType | null;
  onClose: () => void;
  onSelectUser: (user: UserType) => void;
  loginNotice?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  users,
  currentUser,
  onClose,
  onSelectUser,
  loginNotice,
}) => {
  const adConfig = storageService.getActiveDirectoryConfig();

  const [authTab, setAuthTab] = useState<'ACTIVE_DIRECTORY' | 'DEMO_PROFILES'>('ACTIVE_DIRECTORY');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [domain, setDomain] = useState(adConfig.domainName || 'CORP');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Live Active Directory reachability probe
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState('');

  const probeStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const res = await storageService.checkActiveDirectoryStatus();
      setIsConnected(res.connected);
      setStatusText(res.message);
    } catch {
      setIsConnected(false);
      setStatusText('عدم برقراری ارتباط با سرویس اکتیو دایرکتوری');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    probeStatus();
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('لطفاً نام کاربری ویندوز (sAMAccountName) را وارد نمایید.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('لطفاً کلمه عبور شبکه ویندوز را وارد نمایید.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // allowOfflineFallback = true ensures users are never locked out when AD is physically unreachable
      const res = await storageService.loginWithActiveDirectory(usernameInput, passwordInput, domain, true);
      if (res.success && res.user) {
        if (res.isOffline) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onSelectUser(res.user!);
            onClose();
          }, 600);
        } else {
          onSelectUser(res.user);
          onClose();
        }
      } else {
        setErrorMsg(res.message || 'احراز هویت در اکتیو دایرکتوری ناموفق بود.');
      }
    } catch (err: any) {
      setErrorMsg(`خطای ارتباط با سرور: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">احراز هویت سازمانی (ورود به سامانه)</h3>
              <p className="text-xs text-slate-300 mt-0.5">اتصال مستقیم به اکتیو دایرکتوری یا حساب‌های سازمانی</p>
            </div>
          </div>

          {/* Genuine Connection Status (Never falsified) */}
          <div className="mt-4 flex items-center justify-between gap-2 text-[11px] bg-white/10 px-3 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              {isCheckingStatus ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-300 animate-spin shrink-0" />
                  <span className="text-slate-300">در حال سنجش وضعیت اتصال به کنترلر دامنه...</span>
                </>
              ) : isConnected ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-bold">
                    متصل به کنترلر دامنه ({adConfig.serverHost}:{adConfig.port})
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-rose-300 font-bold">عدم اتصال به کنترلر دامنه</span>
                    <span className="text-slate-300 mr-1.5 text-[10px]" dir="ltr">
                      ({adConfig.serverHost}:{adConfig.port})
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={probeStatus}
              disabled={isCheckingStatus}
              className="text-[10px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
              title="تست مجدد اتصال به شبکه اکتیو دایرکتوری"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>تست اتصال</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setAuthTab('ACTIVE_DIRECTORY');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'ACTIVE_DIRECTORY'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>احراز هویت اکتیو دایرکتوری</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTab('DEMO_PROFILES');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'DEMO_PROFILES'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>حساب‌های آماده سازمانی (سریع)</span>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {loginNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div>ورود به حساب کاربری الزامی است:</div>
                <div className="font-normal text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">{loginNotice}</div>
              </div>
            </div>
          )}

          {/* TAB 1: REAL ACTIVE DIRECTORY AUTHENTICATION */}
          {authTab === 'ACTIVE_DIRECTORY' && (
            <form onSubmit={handleManualLogin} className="space-y-4 animate-in fade-in duration-150">
              {!isConnected && !isCheckingStatus && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-in fade-in">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>کنترلر دامین متصل نیست (حالت دایرکتوری سازمانی فعال است):</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    سرور اکتیودایرکتوری در آدرس <span className="font-mono font-bold" dir="ltr">{adConfig.serverHost}:{adConfig.port}</span> در این شبکه در دسترس نمی‌باشد. برای اینکه در استفاده از سامانه متوقف نشوید، احراز هویت در حالت «دایرکتوری سازمانی آفلاین» به صورت خودکار پشتیبانی می‌شود و می‌توانید با هر یک از شناسه‌های سازمانی زیر یا نام کاربری دلخواه خود وارد شوید.
                  </p>
                </div>
              )}

              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                مشخصات حساب کاربری ویندوز (شبکه سازمان):
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    دامنه (Domain)
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value.toUpperCase())}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 text-center uppercase outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    نام کاربری شبکه (sAMAccountName)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={e => setUsernameInput(e.target.value)}
                      placeholder="مثال: admin.system یا sara.khodro"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Fast Autocomplete Chips */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>انتخاب سریع نام کاربری پرسنل سازمان:</span>
                  <span className="text-[9px] text-slate-400">کلیک جهت تکمیل خودکار</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { user: 'admin.system', label: 'مدیر کل سیستم', role: 'SUPER_ADMIN' },
                    { user: 'sara.khodro', label: 'مدیر ناوگان', role: 'CATEGORY_MANAGER' },
                    { user: 'ali.amlak', label: 'مدیر املاک', role: 'CATEGORY_MANAGER' },
                    { user: 'maryam.hesabdari', label: 'مریم حسینی', role: 'USER' },
                    { user: 'reza.karimi', label: 'رضا کریمی', role: 'USER' },
                  ].map(item => (
                    <button
                      key={item.user}
                      type="button"
                      onClick={() => {
                        setUsernameInput(item.user);
                        setPasswordInput('123456');
                        setErrorMsg('');
                      }}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                        usernameInput === item.user
                          ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-300 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                      }`}
                    >
                      <span className="font-mono">{item.user}</span>
                      <span className="text-[9px] opacity-75">({item.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  رمز عبور شبکه ویندوز (Active Directory)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder={isConnected ? 'رمز عبور حساب کاربری شبکه' : 'رمز عبور (در حالت آفلاین هر رمزی معتبر است)'}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-bold">{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال اعتبارسنجی با سرویس سازمانی...</span>
                  </>
                ) : isConnected ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>ورود با احراز هویت زنده Active Directory</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>ورود با حساب کاربری ویندوز (دایرکتوری سازمانی)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: DEMO PRESET PROFILES */}
          {authTab === 'DEMO_PROFILES' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
                <span className="font-bold">انتخاب مستقیم:</span> بدون نیاز به وارد کردن کلمه عبور، مستقیماً با کلیک روی هر یک از پرسنل وارد سامانه شوید:
              </div>

              <div className="space-y-2">
                {users.map(u => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        storageService.setCurrentUser(u);
                        onSelectUser(u);
                        onClose();
                      }}
                      className={`w-full p-2.5 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>{u.displayName}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                u.role === 'SUPER_ADMIN'
                                  ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                                  : u.role === 'CATEGORY_MANAGER'
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {u.role === 'SUPER_ADMIN'
                                ? 'مدیر ارشد سیستم'
                                : u.role === 'CATEGORY_MANAGER'
                                ? 'مدیر دسته‌بندی'
                                : 'کاربر عادی'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono" dir="ltr">
                            {u.username} • {u.department || 'واحد عمومی'}
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>فعال</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                          انتخاب
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
