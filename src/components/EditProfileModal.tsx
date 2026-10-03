import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Phone,
  PhoneCall,
  Building,
  ShieldCheck,
  ShieldAlert,
  Upload,
  Camera,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { User as UserType, Category } from '../types';
import { MALE_FACELESS_AVATARS, DEFAULT_MALE_AVATAR } from '../data/defaultAvatars';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserType;
  currentUser: UserType | null;
  onSave: (userId: string, updates: Partial<UserType>) => void;
  categories: Category[];
}

const PRESET_DEPARTMENTS = [
  'مدیریت فناوری اطلاعات و امنیت شبکه',
  'مرکز داده و زیرساخت سخت‌افزار',
  'ترابری و خدمات ناوگان',
  'مدیریت املاک و پشتیبانی سازمانی',
  'منابع انسانی و امور اداری',
  'امور مالی و حسابداری',
  'روابط عمومی و امور بین‌الملل',
  'بازرگانی و تدارکات داخلی',
  'تحقیق و توسعه (R&D)',
  'حقوقی و قراردادها',
  'بازرسی و حراست',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  onSave,
  categories,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(targetUser.displayName);
  const [username, setUsername] = useState(targetUser.username);
  const [department, setDepartment] = useState(targetUser.department || '');
  const [internalPhone, setInternalPhone] = useState(targetUser.internalPhone || '');
  const [mobilePhone, setMobilePhone] = useState(targetUser.mobilePhone || '');
  const [avatar, setAvatar] = useState(targetUser.avatar || DEFAULT_MALE_AVATAR);
  const [role, setRole] = useState(targetUser.role);
  const [status, setStatus] = useState(targetUser.status);
  const [managedCategoryIds, setManagedCategoryIds] = useState<string[]>(
    targetUser.managedCategoryIds || []
  );
  const [adGroupsInput, setAdGroupsInput] = useState(
    (targetUser.adGroups || []).join('، ')
  );
  const [customMonthlyQuota, setCustomMonthlyQuota] = useState<number | undefined>(
    targetUser.customMonthlyQuota
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Sync state whenever targetUser changes or modal opens
  useEffect(() => {
    setDisplayName(targetUser.displayName);
    setUsername(targetUser.username);
    setDepartment(targetUser.department || '');
    setInternalPhone(targetUser.internalPhone || '');
    setMobilePhone(targetUser.mobilePhone || '');
    setAvatar(targetUser.avatar || DEFAULT_MALE_AVATAR);
    setRole(targetUser.role);
    setStatus(targetUser.status);
    setManagedCategoryIds(targetUser.managedCategoryIds || []);
    setAdGroupsInput((targetUser.adGroups || []).join('، '));
    setCustomMonthlyQuota(targetUser.customMonthlyQuota);
    setErrors({});
    setIsSavedSuccess(false);
  }, [targetUser, isOpen]);

  if (!isOpen) return null;

  const isSelf = currentUser?.id === targetUser.id;
  const isAdmin = currentUser?.role === 'SUPER_ADMIN';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleCategory = (catId: string) => {
    setManagedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // 1. Full name is required
    if (!displayName.trim()) {
      newErrors.displayName = 'نام و نام خانوادگی الزامی است.';
    }

    // 2. Mobile phone is required
    if (!mobilePhone.trim()) {
      newErrors.mobilePhone = 'شماره تلفن همراه الزامی است.';
    }

    // 3. Organizational internal phone is required (mandatory per requirement)
    if (!internalPhone.trim()) {
      newErrors.internalPhone = 'شماره تلفن داخلی سازمانی الزامی است.';
    }

    // Notice: Department is explicitly optional (no error check)
    // Notice: Email is completely removed (no error check or storage)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const adGroups = adGroupsInput
      .split(/[,،]/)
      .map(g => g.trim())
      .filter(Boolean);

    const updates: Partial<UserType> = {
      displayName: displayName.trim(),
      department: department.trim(),
      internalPhone: internalPhone.trim(),
      mobilePhone: mobilePhone.trim(),
      avatar,
    };

    // Only admin can view and change active directory username, role, status, managed categories, and ad groups
    if (isAdmin) {
      updates.username = username.trim();
      updates.role = role;
      updates.status = status;
      updates.managedCategoryIds = role === 'CATEGORY_MANAGER' ? managedCategoryIds : [];
      updates.adGroups = adGroups.length > 0 ? adGroups : targetUser.adGroups;
      updates.customMonthlyQuota = customMonthlyQuota && customMonthlyQuota > 0 ? customMonthlyQuota : undefined;
    }

    onSave(targetUser.id, updates);
    setIsSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {isSelf ? 'ویرایش پروفایل من' : `ویرایش پروفایل کاربر: ${targetUser.displayName}`}
                </h2>
                {!isSelf && isAdmin && (
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                    پنل مدیریت
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isSelf
                  ? 'بروزرسانی مشخصات فردی و اطلاعات تماس سازمانی'
                  : 'مدیریت و اصلاح اطلاعات کاربر، سطح دسترسی و مشخصات پرسنلی'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {isSavedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>مشخصات پروفایل با موفقیت در سامانه ذخیره گردید.</span>
            </div>
          )}

          {/* Section 1: Avatar selection - Faceless Male Icons */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-600" />
                <span>تصویر پروفایل سازمانی (آیکون‌های بدون چهره)</span>
              </label>
              <span className="text-[11px] text-slate-400">آیکون‌های متنوع مردانه بدون چهره</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/50 shadow-sm bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                  title="تغییر تصویر"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="text-[11px] text-slate-600 font-medium">
                  آیکون‌های پیش‌فرض رسمی (بدون چهره - انواع سبک‌های مردانه):
                </div>
                <div className="grid grid-cols-4 sm:flex items-center gap-2 overflow-x-auto pb-1">
                  {MALE_FACELESS_AVATARS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvatar(item.url)}
                      title={item.label}
                      className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition relative ${
                        avatar === item.url
                          ? 'border-rose-600 ring-2 ring-rose-500/30 scale-105 shadow-xs'
                          : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>بارگذاری عکس یا آیکون از سیستم</span>
                  </button>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    بدون چهره برای حفظ هویت سازمانی
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>مشخصات هویتی و پرسنلی</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name (Mandatory) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نام و نام خانوادگی <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    placeholder="مثال: علیرضا تهرانی"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.displayName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Internal Phone (Mandatory per requirement) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  شماره تلفن داخلی سازمانی <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={internalPhone}
                    onChange={e => setInternalPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    placeholder="مثال: ۱۰۱ یا ۴۳۲۱"
                  />
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.internalPhone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.internalPhone}</p>
                )}
              </div>

              {/* Mobile Phone (Mandatory) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  شماره تلفن همراه <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mobilePhone}
                    onChange={e => setMobilePhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-right"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.mobilePhone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.mobilePhone}</p>
                )}
              </div>

              {/* Department (Optional per requirement) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  واحد سازمانی / دپارتمان <span className="text-[11px] font-normal text-slate-400">(اختیاری)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    list="departments-list"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    placeholder="نام واحد سازمانی (اختیاری)"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <datalist id="departments-list">
                    {PRESET_DEPARTMENTS.map(d => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Active Directory Username - STRICTLY visible ONLY to Admin users */}
              {isAdmin && (
                <div className="sm:col-span-2 bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/90 mt-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      <span>نام کاربری اکتیو دایرکتوری (ویندوز)</span>
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
                      فقط قابل مشاهده و ویرایش توسط مدیر ارشد
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      dir="ltr"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      placeholder="username"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Roles and Admin Permissions (Only for Admins) */}
          {isAdmin ? (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>تنظیمات نقش و دسترسی‌های سازمانی (دسترسی مدیر ارشد)</span>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                  ویژه ادمین
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* System Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نقش کاربری در سامانه
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="USER">کاربر سازمانی (عادی)</option>
                    <option value="CATEGORY_MANAGER">مدیر ناظر دسته‌بندی</option>
                    <option value="SUPER_ADMIN">مدیر ارشد سیستم (Super Admin)</option>
                  </select>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    وضعیت حساب کاربری
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="ACTIVE">فعال (ACTIVE)</option>
                    <option value="SUSPENDED">معلق / مسدود شده (SUSPENDED)</option>
                  </select>
                </div>
              </div>

              {/* If Category Manager: choose managed categories */}
              {role === 'CATEGORY_MANAGER' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>دسته‌بندی‌های تحت نظارت این مدیر:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {categories.map(c => {
                      const checked = managedCategoryIds.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                            checked
                              ? 'bg-amber-100 border-amber-300 font-bold text-amber-950'
                              : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleCategory(c.id)}
                            className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                          />
                          <span>{c.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AD Security Groups */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  گروه‌های امنیتی Active Directory (تفکیک با ویرگول)
                </label>
                <input
                  type="text"
                  value={adGroupsInput}
                  onChange={e => setAdGroupsInput(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 text-right outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="Domain Users, IT_Security"
                />
              </div>

              {/* Custom Monthly Solar Quota */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>سهمیه ماهانه اختصاصی ثبت آگهی (ماه شمسی)</span>
                  <span className="text-[10px] text-slate-500 font-normal">خالی = سقف عمومی سامانه</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={customMonthlyQuota !== undefined ? customMonthlyQuota : ''}
                  onChange={e => setCustomMonthlyQuota(e.target.value === '' ? undefined : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="مثال: ۱۰ (سقف ماهانه)"
                />
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-slate-600 dark:text-slate-400">سطح دسترسی شما:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {role === 'SUPER_ADMIN'
                    ? 'مدیر ارشد سامانه'
                    : role === 'CATEGORY_MANAGER'
                    ? 'مدیر ناظر دسته‌بندی'
                    : 'کاربر سازمانی'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                تنظیمات نقش توسط مدیر سیستم مدیریت می‌شود
              </span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ذخیره تغییرات پروفایل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
