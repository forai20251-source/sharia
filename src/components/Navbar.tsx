import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Bookmark,
  ShieldAlert,
  Building,
  UserCheck,
  ChevronDown,
  LogOut,
  RefreshCw,
  Server,
  Layers,
  Sparkles,
  UserCog,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { User, UserQuotaStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { toPersianDigits } from '../utils/jalali';

interface NavbarProps {
  currentUser: User | null;
  quotaStatus?: UserQuotaStatus;
  onOpenLogin: () => void;
  onOpenPostAd: () => void;
  onOpenAdmin: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
  bookmarksCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarksOnly: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBranch?: string;
  onBranchChange?: (b: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  quotaStatus,
  onOpenLogin,
  onOpenPostAd,
  onOpenAdmin,
  onOpenEditProfile,
  onLogout,
  bookmarksCount,
  showOnlyBookmarks,
  onToggleBookmarksOnly,
  searchQuery,
  onSearchChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { text: 'مدیر ارشد سیستم', color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'CATEGORY_MANAGER':
        return { text: 'مدیر دسته‌بندی', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      default:
        return { text: 'کاربر سازمانی', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
  };

  const roleInfo = currentUser ? getRoleLabel(currentUser.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Right section: Logo */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSearchChange('')}>
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-rose-600/20">
                د
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">دیـوار</span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    سازمانی
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">سامانه ثبت آگهی داخلی پرسنل</p>
              </div>
            </div>
          </div>

          {/* Center: Search bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="جست‌وجو در عنوان آگهی، مشخصات فنی، برند یا شماره داخلی..."
                className="w-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm rounded-xl pl-9 pr-10 py-2.5 border border-transparent focus:border-rose-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-3"
                >
                  پاک کردن
                </button>
              )}
            </div>
          </div>

          {/* Left section: Actions, Admin Panel & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title={theme === 'dark' ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
              aria-label="تغییر تم حالت شب و روز"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Admin & Reports button - strictly hidden from users and only visible to authenticated administrators */}
            {currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATEGORY_MANAGER') && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                title="پنل مدیریت، نظارت بر آگهی‌ها و گزارش‌گیری"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="hidden lg:inline">پنل مدیریت و گزارشات</span>
                <span className="lg:hidden">مدیریت</span>
              </button>
            )}

            {/* Bookmarks Toggle */}
            <button
              type="button"
              onClick={onToggleBookmarksOnly}
              className={`relative p-2 rounded-xl border transition ${
                showOnlyBookmarks
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="نشان‌شده‌ها"
            >
              <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-rose-600 dark:fill-rose-400' : ''}`} />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Post Ad Button (Divar Style) */}
            <button
              type="button"
              onClick={onOpenPostAd}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت آگهی جدید</span>
            </button>

            {/* Active Directory User Profile & Switcher OR Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                  </div>
                  <div className="hidden xl:block text-right leading-none">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.displayName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono tracking-tight">
                      {currentUser.username}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-40 text-right animate-in fade-in duration-100">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{currentUser.displayName}</span>
                          {roleInfo && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${roleInfo.color}`}>
                              {roleInfo.text}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1" dir="ltr">
                          {currentUser.username.includes('\\') ? currentUser.username.split('\\')[1] : currentUser.username}
                        </div>
                        {currentUser.department && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{currentUser.department}</span>
                          </div>
                        )}
                        <div className="mt-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg p-1.5 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>احراز هویت معتبر سازمانی</span>
                        </div>

                        {/* Solar Month Quota & Restrictions Badge */}
                        {quotaStatus && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400">
                                سهمیه ماه جاری ({quotaStatus.solarMonthName}):
                              </span>
                              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                                {toPersianDigits(quotaStatus.adsUsedThisMonth)} از {toPersianDigits(quotaStatus.maxAllowedThisMonth)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  quotaStatus.remainingThisMonth === 0 ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(
                                      (quotaStatus.adsUsedThisMonth /
                                        (quotaStatus.maxAllowedThisMonth || 1)) *
                                        100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                              <span>{toPersianDigits(quotaStatus.remainingThisMonth)} عدد باقیمانده</span>
                              <span>
                                فعال: {toPersianDigits(quotaStatus.activeAdsCount)}/{toPersianDigits(quotaStatus.maxActiveAllowed)}
                              </span>
                            </div>
                            {quotaStatus.isBlocked && (
                              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 p-1 rounded-lg border border-rose-200 dark:border-rose-900/60 text-center">
                                {quotaStatus.blockReason}
                              </div>
                            )}
                            {quotaStatus.hasCustomQuota && (
                              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold text-center">
                                ★ دارای سهمیه اختصاصی سازمانی
                              </div>
                            )}
                            {quotaStatus.isBypassed && (
                              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold text-center">
                                ✓ معاف از سهمیه‌بندی (دسترسی مدیر)
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenEditProfile();
                          }}
                          className="w-full text-right px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-2 font-bold transition"
                        >
                          <UserCog className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>ویرایش مشخصات پروفایل</span>
                        </button>

                        {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATEGORY_MANAGER') && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              onOpenAdmin();
                            }}
                            className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span>داشبورد مدیریتی و گزارش عملکرد</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenLogin();
                          }}
                          className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span>تغییر حساب کاربری (Active Directory)</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className="w-full text-right px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>خروج از حساب کاربری</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition shadow-xs"
              >
                <LogIn className="w-4 h-4 text-rose-400 dark:text-rose-600" />
                <span>ورود به حساب</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="جست‌وجو در آگهی‌ها، فیلدها و کالاها..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs rounded-xl pl-8 pr-9 py-2 border border-transparent focus:border-rose-500 dark:focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};

