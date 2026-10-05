import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Calendar,
  Clock,
  Phone,
  UserCheck,
  Layers,
  Edit2,
  Flame,
  Flag,
  AlertTriangle,
} from 'lucide-react';
import { Ad, Category, User } from '../types';
import { EditAdModal } from './EditAdModal';
import { OFFLINE_IMG_DEFAULT } from '../data/offlineImages';
import {
  formatPrice,
  formatJalaliDate,
  formatPersianRelativeTime,
  toPersianDigits,
} from '../utils/jalali';

interface AdDetailModalProps {
  ad: Ad;
  category?: Category;
  categories?: Category[];
  currentUser: User | null;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (adId: string) => void;
  onApproveAd?: (id: string, keepBadge?: boolean) => void;
  onRejectAd?: (id: string, reason: string) => void;
  onDeleteAd?: (id: string) => void;
  onUpdateAd?: (id: string, updates: Partial<Ad>) => void;
  onContactView?: (id: string) => void;
  onOpenReportAd?: (ad: Ad) => void;
  allowUserAdReporting?: boolean;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  category,
  categories = [],
  currentUser,
  isBookmarked,
  onClose,
  onToggleBookmark,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onUpdateAd,
  onContactView,
  onOpenReportAd,
  allowUserAdReporting = true,
}) => {
  const [currentAd, setCurrentAd] = useState<Ad>(ad);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const isDefaultCategoryImage = (!currentAd.images || currentAd.images.length === 0 || !currentAd.images[0]) && !!category?.defaultImage;
  const images = currentAd.images && currentAd.images.length > 0 && currentAd.images[0]
    ? currentAd.images
    : [category?.defaultImage || OFFLINE_IMG_DEFAULT];

  // Check if current user can moderate this ad
  const canModerate =
    !!currentUser &&
    (currentUser.role === 'SUPER_ADMIN' ||
      (currentUser.role === 'CATEGORY_MANAGER' &&
        currentUser.managedCategoryIds?.includes(currentAd.categoryId)));

  const handleShowPhone = () => {
    setShowPhone(true);
    if (onContactView) {
      onContactView(currentAd.id);
    }
  };

  const handleSaveAdEdits = (adId: string, updates: Partial<Ad>) => {
    setCurrentAd(prev => ({ ...prev, ...updates }));
    if (onUpdateAd) {
      onUpdateAd(adId, updates);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 transition-colors">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/60">
              {currentAd.categoryTitle || category?.title || 'آگهی سازمانی'}
            </span>
            {currentAd.status === 'APPROVED' && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                تایید شده
              </span>
            )}
            {currentAd.status === 'PENDING' && (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                در انتظار بررسی مدیر
              </span>
            )}
            {currentAd.status === 'REJECTED' && (
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
                رد شده
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canModerate && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                title="ویرایش مشخصات آگهی توسط مدیر"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>ویرایش آگهی (مدیر)</span>
              </button>
            )}
            {allowUserAdReporting && onOpenReportAd && (
              <button
                type="button"
                onClick={() => onOpenReportAd(currentAd)}
                className="p-2 rounded-xl transition text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                title="گزارش مشکل یا تخلف این آگهی"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleBookmark(currentAd.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isBookmarked ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="نشان کردن"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600 dark:fill-rose-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Right Column (Gallery & Description) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Image View */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-16/10 border border-slate-200 dark:border-slate-800">
              <img
                src={images[selectedImageIndex]}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              {currentAd.isUrgent && (
                <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                  آگهی فوری
                </div>
              )}
              {isDefaultCategoryImage && (
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg shadow-md border border-white/10 flex items-center gap-1.5">
                  <span>تصویر پیش‌فرض دسته‌بندی ({category?.title})</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                توضیحات و مشخصات آگهی
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentAd.description}
              </p>
            </div>

            {/* DYNAMIC CATEGORY FIELDS SPECIFICATION TABLE (Key prompt requirement) */}
            {category && category.fields && category.fields.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>ویژگی‌ها و مشخصات فنی ({category?.title || 'دسته‌بندی'})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {category.fields.map(fld => {
                    const rawVal = currentAd.customFields?.[fld.name];
                    let displayVal = 'نامشخص';

                    if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                      if (fld.type === 'boolean' || typeof rawVal === 'boolean') {
                        displayVal = rawVal ? 'دارد (بله)' : 'ندارد (خیر)';
                      } else {
                        const unit = fld.unit ? ` ${fld.unit}` : '';
                        displayVal = `${toPersianDigits(String(rawVal))}${unit}`;
                      }
                    }

                    return (
                      <div
                        key={fld.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 text-xs"
                      >
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{fld.label}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{displayVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Left Column (Metadata, Seller, Contact, Moderation) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Price Card */}
            <div className="space-y-3">
              <h1 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                {currentAd.title}
              </h1>

              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100/80 dark:border-rose-900/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">قیمت پیشنهادی</span>
                <span className="text-base font-extrabold text-rose-700 dark:text-rose-400">
                  {formatPrice(currentAd.price, currentAd.isAgreementPrice, currentAd.isFree)}
                </span>
              </div>

              {/* Time & Dates in Shamsi */}
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>زمان ثبت: {formatPersianRelativeTime(currentAd.createdAt)} ({currentAd.createdAtShamsi})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>اعتبار آگهی تا: {currentAd.expiryDateShamsi}</span>
                </div>
              </div>
            </div>

            {/* Active Directory Seller Card */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>اطلاعات آگهی‌دهنده (کاربر سازمانی)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">نام و نام خانوادگی:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentAd.authorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">واحد سازمانی:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{currentAd.authorDepartment}</span>
                </div>
              </div>

              {/* Contact Button / Revealed Details */}
              <div className="pt-2">
                {!showPhone ? (
                  <button
                    type="button"
                    onClick={handleShowPhone}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>نمایش اطلاعات تماس و داخلی فروشنده</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1.5 animate-in fade-in">
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">اطلاعات مستقیم تماس:</div>
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between">
                      <span>شماره موبایل و داخلی:</span>
                      <span dir="ltr" className="font-mono text-emerald-900 dark:text-emerald-300">{currentAd.authorPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Ad Card */}
            {allowUserAdReporting && onOpenReportAd && (
              <div className="p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <Flag className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>مشکلی در این آگهی وجود دارد؟</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  در صورت مشاهده مغایرت محتوا، قیمت غیرواقعی، عدم پاسخگویی یا واگذاری کالا، به مدیریت سامانه اطلاع دهید.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenReportAd(currentAd)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>ثبت گزارش تخلف یا مشکل این آگهی</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Ad Modal */}
      {isEditModalOpen && (
        <EditAdModal
          ad={currentAd}
          categories={categories}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveAdEdits}
        />
      )}
    </div>
  );
};
