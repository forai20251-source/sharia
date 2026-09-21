import React, { useState } from 'react';
import {
  X,
  Plus,
  Upload,
  Sparkles,
  Camera,
  CheckCircle2,
  DollarSign,
  Flame,
  AlertCircle,
  Building,
  Layers,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { Category, Ad, User } from '../types';
import { JalaliDatePicker } from './JalaliDatePicker';
import { getCurrentJalali, toPersianDigits, formatPersianNumber } from '../utils/jalali';

interface PostAdModalProps {
  categories: Category[];
  currentUser: User;
  onClose: () => void;
  onSubmitAd: (adData: Partial<Ad>) => void;
}

const PRESET_IMAGE_OPTIONS = [
  { label: 'خودرو سفید', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80' },
  { label: 'خودرو مشکی لوکس', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80' },
  { label: 'آپارتمان سالن نورگیر', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80' },
  { label: 'دفتر کار و اتاق اداری', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80' },
  { label: 'لپ‌تاپ مهندسی', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80' },
  { label: 'گوشی موبایل هوشمند', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80' },
  { label: 'صندلی ارگونومیک اداری', url: 'https://images.unsplash.com/photo-1580481077194-0f2c4a96b27e?w=800&auto=format&fit=crop&q=80' },
  { label: 'سرویس و خدمات رفت‌وآمد', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80' },
];

export const PostAdModal: React.FC<PostAdModalProps> = ({
  categories,
  currentUser,
  onClose,
  onSubmitAd,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isAgreementPrice, setIsAgreementPrice] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [departmentLocation, setDepartmentLocation] = useState(currentUser.department || 'ساختمان مرکزی');
  const [authorPhone, setAuthorPhone] = useState(`${currentUser.mobilePhone} (داخلی ${currentUser.internalPhone})`);
  const [selectedImages, setSelectedImages] = useState<string[]>([PRESET_IMAGE_OPTIONS[0].url]);
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [expiryDateShamsi, setExpiryDateShamsi] = useState('');

  const currentCategory = categories.find(c => c.id === categoryId);

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAddPresetImage = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter(u => u !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate file upload with FileReader preview
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setSelectedImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('لطفاً عنوان آگهی را وارد نمایید.');
      return;
    }

    onSubmitAd({
      title,
      categoryId,
      categoryTitle: currentCategory?.title,
      description,
      isFree,
      isAgreementPrice,
      price: isFree || isAgreementPrice ? 0 : price,
      isUrgent,
      departmentLocation,
      authorPhone,
      images: selectedImages.length > 0
        ? selectedImages
        : (currentCategory?.defaultImage ? [currentCategory.defaultImage] : [PRESET_IMAGE_OPTIONS[0].url]),
      customFields,
      expiryDateShamsi: expiryDateShamsi || '۱۴۰۳/۰۸/۳۰',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">ثبت آگهی رایگان سازمانی</h2>
              <p className="text-[11px] text-slate-500">بدون هزینه و کارمزد در بستر شبکه داخلی سازمان</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Wizard Indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                step === 1 ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>۱. مشخصات پایه و دسته</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                step === 2 ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>۲. ویژگی‌های اختصاصی دسته</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                step === 3 ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>۳. تصاویر و قیمت‌گذاری</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  انتخاب دسته‌بندی <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(cat.id);
                        setCustomFields({}); // Reset custom fields when changing category
                      }}
                      className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                        categoryId === cat.id
                          ? 'border-rose-600 bg-rose-50/70 text-rose-900 ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{cat.title}</span>
                      <span className="text-[10px] text-slate-400 mt-1">مدیر: {cat.managerName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  عنوان آگهی <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: پژو ۲۰۷i مدل ۱۴۰۲ سفید ارتقا یافته، یا آپارتمان ۹۵ متری"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  در عنوان آگهی به موارد مهم مانند برند، مدل یا مشخصه اصلی اشاره کنید.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  توضیحات تکمیلی آگهی <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="جزییات و شرایط کالا یا خدمت، ساعت‌های پاسخگویی، وضعیت و نحوه تحویل حضوری در سازمان..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition"
                />
              </div>

              {/* Location in Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    محل تحویل یا استقرار در سازمان
                  </label>
                  <input
                    type="text"
                    value={departmentLocation}
                    onChange={e => setDepartmentLocation(e.target.value)}
                    placeholder="مثال: ساختمان مرکزی - طبقه ۳ واحد مالی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    شماره تماس و داخلی
                  </label>
                  <input
                    type="text"
                    value={authorPhone}
                    onChange={e => setAuthorPhone(e.target.value)}
                    placeholder="شماره موبایل و داخلی سازمان"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  <span>مرحله بعد: ویژگی‌های دسته</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Category-Specific Dynamic Fields */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="text-xs text-indigo-900">
                  <span className="font-bold">فیلدهای اختصاصی دسته‌بندی «{currentCategory?.title}»</span>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    این فیلدها متناسب با نوع دسته تعیین شده‌اند تا جستجو و مقایسه آگهی‌ها دقیق‌تر شود.
                  </p>
                </div>
              </div>

              {currentCategory && currentCategory.fields.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {currentCategory.fields.map(field => {
                    const value = customFields[field.name];

                    if (field.type === 'select') {
                      return (
                        <div key={field.id}>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            {field.label} {field.required && <span className="text-rose-600">*</span>}
                          </label>
                          <select
                            value={value || ''}
                            onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                            required={field.required}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                          >
                            <option value="">انتخاب کنید...</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    if (field.type === 'boolean') {
                      return (
                        <div key={field.id} className="sm:col-span-2">
                          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
                            <div>
                              <span className="text-xs font-bold text-slate-800">{field.label}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">دارای این امکان می‌باشد</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={e => handleCustomFieldChange(field.name, e.target.checked)}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                          </label>
                        </div>
                      );
                    }

                    if (field.type === 'number' || field.type === 'price') {
                      return (
                        <div key={field.id}>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            {field.label} {field.unit ? `(${field.unit})` : ''} {field.required && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="number"
                            value={value ?? ''}
                            onChange={e => handleCustomFieldChange(field.name, e.target.value ? Number(e.target.value) : '')}
                            placeholder={field.placeholder || `مقدار عددی به ${field.unit || 'واحد'}`}
                            required={field.required}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                          />
                        </div>
                      );
                    }

                    // Text
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {field.label} {field.required && <span className="text-rose-600">*</span>}
                        </label>
                        <input
                          type="text"
                          value={value || ''}
                          onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                          placeholder={field.placeholder || `وارد نمایید...`}
                          required={field.required}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  برای این دسته‌بندی فیلد اختصاصی ویژه‌ای تعریف نشده است.
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-xs font-medium px-4 py-2 rounded-xl transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  <span>مرحله بعد: تصاویر و قیمت</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Images & Pricing & Expiry */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Category Default Image Notice */}
              {currentCategory?.defaultImage && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentCategory.defaultImage}
                      alt={currentCategory.title}
                      className="w-12 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        تصویر پیش‌فرض دسته‌بندی «{currentCategory.title}»
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        در صورت عدم انتخاب تصویر دیگر، این تصویر برای آگهی اعمال می‌شود.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedImages.includes(currentCategory.defaultImage!)) {
                        setSelectedImages(prev => [currentCategory.defaultImage!, ...prev]);
                      }
                    }}
                    className="shrink-0 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-rose-600 hover:border-rose-300 text-xs font-bold rounded-xl transition shadow-2xs"
                  >
                    افزودن به گالری
                  </button>
                </div>
              )}

              {/* Image Picker / Upload Simulator */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  انتخاب تصویر آگهی (یا آپلود از رایانه)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_IMAGE_OPTIONS.map((item, idx) => {
                    const isSelected = selectedImages.includes(item.url);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetImage(item.url)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition ${
                          isSelected ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-slate-300 opacity-80'
                        }`}
                      >
                        <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 truncate px-1 text-center">
                          {item.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* File Upload Input */}
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-rose-300 p-3 rounded-2xl cursor-pointer bg-slate-50 hover:bg-rose-50/30 transition text-xs font-semibold text-slate-700">
                  <Upload className="w-4 h-4 text-rose-600" />
                  <span>آپلود تصویر جدید از حافظه دستگاه</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Pricing */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>تعیین قیمت پیشنهادی</span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    بدون درگاه پرداخت و کاملاً رایگان
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFree(true);
                      setIsAgreementPrice(false);
                      setPrice(0);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      isFree ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    رایگان / هدیه سازمانی
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAgreementPrice(true);
                      setIsFree(false);
                      setPrice(0);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      isAgreementPrice ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    توافقی با همکار
                  </button>
                </div>

                {!isFree && !isAgreementPrice && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      قیمت به تومان
                    </label>
                    <input
                      type="number"
                      value={price || ''}
                      onChange={e => setPrice(Number(e.target.value))}
                      placeholder="مثال: ۱۵۰۰۰۰۰۰"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                    {price > 0 && (
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        معادل: {formatPersianNumber(price)} تومان
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Expiration date in Shamsi */}
              <div>
                <JalaliDatePicker
                  value={expiryDateShamsi}
                  onChange={setExpiryDateShamsi}
                  label="مدت اعتبار و تاریخ انقضای آگهی به شمسی (اختیاری)"
                  placeholder="پیش‌فرض: ۳۰ روز آینده"
                />
              </div>

              {/* Urgent Flag */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-amber-900">نشان‌دار کردن به عنوان آگهی فوری</span>
                    <span className="text-[11px] text-amber-700 block">
                      آگهی شما با نشان متمایز قرمز در بالای فهرست نمایش داده می‌شود.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
              </label>

              {/* Final submission buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-xs font-medium px-4 py-2 rounded-xl transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ثبت نهایی آگهی</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
