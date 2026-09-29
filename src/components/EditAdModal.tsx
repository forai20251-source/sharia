import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  AlertCircle,
  MapPin,
  Phone,
  Flame,
  Image as ImageIcon,
  Plus,
  Trash2,
  Building2,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Upload,
} from 'lucide-react';
import { Ad, Category, AdStatus } from '../types';
import { JalaliDatePicker } from './JalaliDatePicker';
import { OFFLINE_IMG_DEFAULT } from '../data/offlineImages';
import {
  toPersianDigits,
  formatPrice,
  getJalaliDateFromNow,
} from '../utils/jalali';

interface EditAdModalProps {
  ad: Ad;
  categories: Category[];
  onClose: () => void;
  onSave: (adId: string, updates: Partial<Ad>) => void;
}

export const EditAdModal: React.FC<EditAdModalProps> = ({
  ad,
  categories,
  onClose,
  onSave,
}) => {
  // Form state initialized with current ad values
  const [title, setTitle] = useState(ad?.title || '');
  const [description, setDescription] = useState(ad?.description || '');
  const [categoryId, setCategoryId] = useState(ad?.categoryId || categories[0]?.id || '');
  const [priceType, setPriceType] = useState<'fixed' | 'agreement'>(
    ad?.isAgreementPrice || ad?.isFree ? 'agreement' : 'fixed'
  );
  const [price, setPrice] = useState<number>(ad?.price || 0);
  const [city, setCity] = useState(ad?.city || 'تهران');
  const [departmentLocation, setDepartmentLocation] = useState(ad?.departmentLocation || '');
  const [authorPhone, setAuthorPhone] = useState(ad?.authorPhone || '');
  const [expiryDateShamsi, setExpiryDateShamsi] = useState(ad?.expiryDateShamsi || '');
  const [isUrgent, setIsUrgent] = useState(!!ad?.isUrgent);
  const [status, setStatus] = useState<AdStatus>(ad?.status || 'PENDING');
  const [rejectionReason, setRejectionReason] = useState(ad?.rejectionReason || '');
  const [images, setImages] = useState<string[]>(ad?.images || []);
  const [customFields, setCustomFields] = useState<Record<string, any>>(ad?.customFields || {});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCategory = categories.find(c => c.id === categoryId);

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMessage('حجم تصویر نباید بیشتر از ۲.۵ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setImages(prev => [...prev, event.target!.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('وارد کردن عنوان آگهی الزامی است.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('وارد کردن توضیحات آگهی الزامی است.');
      return;
    }

    if (status === 'REJECTED' && !rejectionReason.trim()) {
      setErrorMessage('در صورت رد آگهی، ثبت دلیل رد الزامی است.');
      return;
    }

    const finalPrice = priceType === 'fixed' ? Number(price) : 0;
    const finalIsFree = false;
    const finalIsAgreement = priceType === 'agreement';

    const updates: Partial<Ad> = {
      title: title.trim(),
      description: description.trim(),
      categoryId,
      categoryTitle: currentCategory?.title || ad.categoryTitle,
      price: finalPrice,
      isFree: finalIsFree,
      isAgreementPrice: finalIsAgreement,
      city,
      departmentLocation: departmentLocation.trim(),
      authorPhone: authorPhone.trim(),
      expiryDateShamsi: expiryDateShamsi || ad.expiryDateShamsi,
      isUrgent,
      badgeApproved: ad.badgeRequested ? isUrgent : (isUrgent ? true : ad.badgeApproved),
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason.trim() : undefined,
      images: images.length > 0 ? images : [currentCategory?.defaultImage || OFFLINE_IMG_DEFAULT],
      customFields,
    };

    onSave(ad.id, updates);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Pinned Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">ویرایش آگهی توسط مدیر سامانه</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : status === 'PENDING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {status === 'APPROVED'
                    ? 'تایید شده'
                    : status === 'PENDING'
                    ? 'در انتظار بررسی'
                    : 'رد شده'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                امکان بازبینی، اصلاح مشخصات، تایید یا تعیین وضعیت آگهی‌های قبل و بعد از انتشار
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Info Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <UserCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>ثبت‌کننده:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{ad.authorName}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">({ad.authorUsername})</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300">{ad.authorDepartment}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>تاریخ ثبت: {toPersianDigits(ad.createdAtShamsi)}</span>
            <span>بازدید: {toPersianDigits(ad.viewsCount || 0)}</span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain"
        >
          {/* Error message alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* SECTION 1: Status & Moderation Decision */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>تعیین وضعیت انتشار آگهی توسط مدیر</span>
              </span>
              <span className="text-[11px] text-slate-400">امکان تغییر در هر زمان</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setStatus('APPROVED');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                  status === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تایید و انتشار آگهی</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus('PENDING');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                  status === 'PENDING'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>در انتظار بررسی مجدد</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus('REJECTED');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                  status === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>رد آگهی (با ذکر علت)</span>
              </button>
            </div>

            {status === 'REJECTED' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="block text-xs font-semibold text-rose-800 mb-1">
                  علت رد آگهی (جهت اطلاع کاربر و لاگ نظارتی):
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={e => {
                    setRejectionReason(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="مثال: عکس نامناسب، عدم انطباق با قوانین اداری، قیمت نامتعارف..."
                  className="w-full text-xs p-2.5 rounded-xl border border-rose-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            )}
          </div>

          {/* SECTION 2: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>مشخصات و دسته‌بندی آگهی</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  عنوان آگهی <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                  placeholder="عنوان آگهی..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  دسته‌بندی آگهی <span className="text-rose-600">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-rose-500"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (مدیر: {c.managerName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                توضیحات تکمیلی و شرح وضعیت کالا یا خدمات <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-rose-500 leading-relaxed"
                placeholder="توضیحات و جزییات کامل آگهی..."
              />
            </div>
          </div>

          {/* SECTION 3: Dynamic Category Fields */}
          {currentCategory && currentCategory.fields.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                فیلدهای اختصاصی دسته‌بندی «{currentCategory?.title || ''}»:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCategory.fields.map(field => {
                  const val = customFields[field.name] ?? '';
                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {field.label} {field.unit ? `(${field.unit})` : ''}
                        {field.required && <span className="text-rose-600 mr-1">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={val}
                          onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                        >
                          <option value="">انتخاب کنید...</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'boolean' ? (
                        <div className="flex items-center gap-4 py-1.5">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name={`field-${field.id}`}
                              checked={val === true || val === 'بله'}
                              onChange={() => handleCustomFieldChange(field.name, 'بله')}
                            />
                            <span>بله</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name={`field-${field.id}`}
                              checked={val === false || val === 'خیر'}
                              onChange={() => handleCustomFieldChange(field.name, 'خیر')}
                            />
                            <span>خیر</span>
                          </label>
                        </div>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={val}
                          onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: Price & Financials */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
              قیمت‌گذاری و نوع توافق مالی
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriceType('fixed')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  priceType === 'fixed'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                قیمت مقطوع
              </button>

              <button
                type="button"
                onClick={() => setPriceType('agreement')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  priceType === 'agreement'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                قیمت توافقی
              </button>
            </div>

            {priceType === 'fixed' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  مبلغ به تومان:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={price || ''}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                    placeholder="مثال: ۱۵۰۰۰۰۰"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                    تومان
                  </span>
                </div>
                {price > 0 && (
                  <div className="text-xs text-emerald-700 font-bold">
                    معادل: {formatPrice(price)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: Location, Phone, Expiry, Urgent */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
              اطلاعات تماس، موقعیت و تاریخ انقضا
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>محل فیزیکی در سازمان (ساختمان / طبقه)</span>
                </label>
                <input
                  type="text"
                  value={departmentLocation}
                  onChange={e => setDepartmentLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-rose-500"
                  placeholder="مثال: ساختمان مرکزی - طبقه ۳ - اتاق ۳۰۴"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>شماره تماس و داخلی سازمانی</span>
                </label>
                <input
                  type="text"
                  value={authorPhone}
                  onChange={e => setAuthorPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-rose-500"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹ (داخلی ۴۳۲۱)"
                />
              </div>
            </div>

            {/* Jalali Expiration Date */}
            <div>
              <JalaliDatePicker
                value={expiryDateShamsi}
                onChange={setExpiryDateShamsi}
                label="مدت اعتبار و تاریخ انقضای آگهی به شمسی (حداکثر ۱ ماه)"
                placeholder={`پیش‌فرض: ۳۰ روز آینده (${getJalaliDateFromNow(30).formattedShort})`}
                maxDaysFromNow={30}
                minDateToday={true}
                placement="top"
              />
            </div>

            {/* Urgent Flag & Badge Request */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-900">نشان‌دار کردن به عنوان آگهی فوری</span>
                    <span className="text-[11px] text-amber-700 block">
                      نمایش با برچسب متمایز قرمز رنگ در بالای فهرست آگهی‌ها
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </label>

              {ad.badgeRequested && (
                <div className="text-[11px] pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-amber-900">
                  <span className="font-semibold">
                    وضعیت درخواست ثبت‌کننده: <b>کاربر متقاضی نشان‌دار بودن بوده است</b>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    isUrgent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isUrgent ? 'موافقت با نشان فوری' : 'عدم موافقت با نشان (عادی)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 6: Images Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                <span>مدیریت تصاویر آگهی</span>
              </h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن تصویر جدید</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video"
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 left-1 p-1 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition shadow-xs"
                    title="حذف این تصویر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 right-1 text-[10px] bg-slate-900/80 text-white px-1.5 py-0.2 rounded font-medium">
                      تصویر اصلی
                    </span>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-200 hover:border-rose-400 aspect-video flex flex-col items-center justify-center text-slate-400 hover:text-rose-600 transition"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">بارگذاری عکس</span>
              </button>
            </div>
          </div>
        </form>

        {/* Pinned Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
          >
            انصراف
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition active:scale-[0.98] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره تغییرات آگهی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
