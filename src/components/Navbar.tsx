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
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onOpenLogin: () => void;
  onOpenPostAd: () => void;
  onOpenAdmin: () => void;
  bookmarksCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarksOnly: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBranch: string;
  onBranchChange: (b: string) => void;
}

const BRANCHES = [
  'همه واحدها و شعب',
  'ساختمان مرکزی (تهران)',
  'مرکز فناوری و دیتا سنتر',
  'مجتمع مهندسی و ترابری',
  'کارخانه و شهرک صنعتی',
  'شعبه مشهد و شمال شرق',
  'شعبه اصفهان و جنوب',
];

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onOpenPostAd,
  onOpenAdmin,
  bookmarksCount,
  showOnlyBookmarks,
  onToggleBookmarksOnly,
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
}) => {
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { text: 'مدیر ارشد سیستم', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'CATEGORY_MANAGER':
        return { text: 'مدیر دسته‌بندی', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { text: 'کاربر سازمانی', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const roleInfo = getRoleLabel(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Right section: Logo & Branch picker */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSearchChange('')}>
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-rose-600/20">
                د
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">دیـوار</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                    سازمانی
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">سامانه ثبت آگهی داخلی پرسنل</p>
              </div>
            </div>

            {/* Branch / Department selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/80 transition"
              >
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[110px] sm:max-w-none truncate">{selectedBranch}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBranchMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowBranchMenu(false)} />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-40">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                      انتخاب موقعیت یا شعبه سازمانی
                    </div>
                    {BRANCHES.map(branch => (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => {
                          onBranchChange(branch);
                          setShowBranchMenu(false);
                        }}
                        className={`w-full text-right px-3 py-2 text-xs transition flex items-center justify-between ${
                          selectedBranch === branch
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{branch}</span>
                        {selectedBranch === branch && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl pl-9 pr-10 py-2.5 border border-transparent focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-xs text-slate-400 hover:text-slate-600 absolute left-3 top-3"
                >
                  پاک کردن
                </button>
              )}
            </div>
          </div>

          {/* Left section: Actions, Admin Panel & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Admin & Reports button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 border border-slate-200 transition"
              title="پنل مدیریت، نظارت بر آگهی‌ها و گزارش‌گیری"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="hidden lg:inline">پنل مدیریت و گزارشات</span>
              <span className="lg:hidden">مدیریت</span>
            </button>

            {/* Bookmarks Toggle */}
            <button
              type="button"
              onClick={onToggleBookmarksOnly}
              className={`relative p-2 rounded-xl border transition ${
                showOnlyBookmarks
                  ? 'bg-rose-50 text-rose-600 border-rose-200 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="نشان‌شده‌ها"
            >
              <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-rose-600' : ''}`} />
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
              <span>ثبت آگهی رایگان</span>
            </button>

            {/* Active Directory User Profile & Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden xl:block text-right leading-none">
                  <div className="text-xs font-bold text-slate-800">{currentUser.displayName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight">
                    {currentUser.username}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-40 text-right animate-in fade-in duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{currentUser.displayName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${roleInfo.color}`}>
                          {roleInfo.text}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-1" dir="ltr">
                        {currentUser.username}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{currentUser.department}</span>
                      </div>
                      <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-800 rounded-lg p-1.5 border border-emerald-200 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>احراز هویت شده از طریق Active Directory (ویندوز)</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-right px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-slate-500" />
                        <span>داشبورد مدیریتی و گزارش عملکرد</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenLogin();
                        }}
                        className="w-full text-right px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                        <span>تغییر کاربر و شبیه‌ساز لاگین اکتیو دایرکتوری</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenLogin();
                        }}
                        className="w-full text-right px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج از حساب کاربری</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
              className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl pl-8 pr-9 py-2 border border-transparent focus:border-rose-500 focus:bg-white outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
