import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  Building,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MessageCircle,
  Layers,
  Edit2,
  Flame,
} from 'lucide-react';
import { Ad, Category, User } from '../types';
import { EditAdModal } from './EditAdModal';
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
  currentUser: User;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (adId: string) => void;
  onApproveAd?: (id: string, keepBadge?: boolean) => void;
  onRejectAd?: (id: string, reason: string) => void;
  onDeleteAd?: (id: string) => void;
  onUpdateAd?: (id: string, updates: Partial<Ad>) => void;
  onContactView?: (id: string) => void;
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
}) => {
  const [currentAd, setCurrentAd] = useState<Ad>(ad);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const isDefaultCategoryImage = (!currentAd.images || currentAd.images.length === 0 || !currentAd.images[0]) && !!category?.defaultImage;
  const images = currentAd.images && currentAd.images.length > 0 && currentAd.images[0]
    ? currentAd.images
    : [category?.defaultImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'];

  // Check if current user can moderate this ad
  const canModerate =
    currentUser.role === 'SUPER_ADMIN' ||
    (currentUser.role === 'CATEGORY_MANAGER' &&
      currentUser.managedCategoryIds?.includes(currentAd.categoryId));

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
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
              {currentAd.categoryTitle || category?.title || 'آگهی سازمانی'}
            </span>
            {currentAd.status === 'APPROVED' && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                تایید شده
              </span>
            )}
            {currentAd.status === 'PENDING' && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                در انتظار بررسی مدیر
              </span>
            )}
            {currentAd.status === 'REJECTED' && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                رد شده
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canModerate && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs"
                title="ویرایش مشخصات آگهی توسط مدیر"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>ویرایش آگهی (مدیر)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleBookmark(currentAd.id)}
              className={`p-2 rounded-xl transition ${
                isBookmarked ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="نشان کردن"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-16/10 border border-slate-200">
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
                      selectedImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                توضیحات و مشخصات آگهی
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {currentAd.description}
              </p>
            </div>

            {/* DYNAMIC CATEGORY FIELDS SPECIFICATION TABLE (Key prompt requirement) */}
            {category && category.fields.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>ویژگی‌ها و مشخصات فنی ({category.title})</span>
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
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <span className="text-slate-500 font-medium">{fld.label}</span>
                        <span className="font-bold text-slate-800">{displayVal}</span>
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
              <h1 className="text-lg font-black text-slate-900 leading-snug">
                {currentAd.title}
              </h1>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800">قیمت پیشنهادی</span>
                <span className="text-base font-extrabold text-rose-700">
                  {formatPrice(currentAd.price, currentAd.isAgreementPrice, currentAd.isFree)}
                </span>
              </div>

              {/* Time & Dates in Shamsi */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>زمان ثبت: {formatPersianRelativeTime(currentAd.createdAt)} ({currentAd.createdAtShamsi})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>اعتبار آگهی تا: {currentAd.expiryDateShamsi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>محل: {currentAd.departmentLocation || currentAd.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>تعداد بازدید: {toPersianDigits(currentAd.viewsCount || 0)} بار</span>
                </div>
              </div>
            </div>

            {/* Active Directory Seller Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>اطلاعات آگهی‌دهنده (کاربر سازمانی)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  تایید هویت AD
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">نام و نام خانوادگی:</span>
                  <span className="font-bold text-slate-800">{currentAd.authorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">نام کاربری ویندوز:</span>
                  <span className="font-mono text-slate-700" dir="ltr">{currentAd.authorUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">واحد سازمانی:</span>
                  <span className="font-medium text-slate-800">{currentAd.authorDepartment}</span>
                </div>
              </div>

              {/* Contact Button / Revealed Details */}
              <div className="pt-2">
                {!showPhone ? (
                  <button
                    type="button"
                    onClick={handleShowPhone}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>نمایش اطلاعات تماس و داخلی فروشنده</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 animate-in fade-in">
                    <div className="text-[11px] text-emerald-800 font-bold">اطلاعات مستقیم تماس:</div>
                    <div className="text-xs text-slate-800 font-bold flex items-center justify-between">
                      <span>شماره موبایل و داخلی:</span>
                      <span dir="ltr" className="font-mono text-emerald-900">{currentAd.authorPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Moderation Actions (for Category Manager or Super Admin) */}
            {canModerate && (
              <div className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>پنل بررسی و نظارت مدیر</span>
                  </div>
                  <span className="text-[11px] text-amber-800">قبل و بعد از تایید آگهی</span>
                </div>

                {/* Badge Request Management Box */}
                {(currentAd.badgeRequested || currentAd.isUrgent) && (
                  <div className="p-3 bg-gradient-to-r from-amber-100/90 via-amber-50 to-rose-100/70 border border-amber-300 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <Flame className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                        <span>درخواست نشان‌دار کردن (آگهی فوری سازمانی)</span>
                      </div>
                      {currentAd.badgeApproved === false && (
                        <span className="text-[10px] font-bold text-slate-700 bg-white/90 border border-slate-300 px-2 py-0.5 rounded-md">
                          نشان رد شده (آگهی عادی)
                        </span>
                      )}
                      {(currentAd.badgeApproved === true || (currentAd.isUrgent && currentAd.status === 'APPROVED')) && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                          نشان فوری فعال
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      کاربر متقاضی اعطای نشان متمایز فوری به این آگهی بوده است. شما به عنوان مدیر می‌توانید آگهی را <b>همراه با نشان فوری</b> تایید کنید، یا <b>آگهی را به صورت عادی تایید نموده و با نشان‌دار بودنش موافقت نکنید</b>.
                    </p>

                    {currentAd.status !== 'APPROVED' && onApproveAd && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onApproveAd(currentAd.id, true);
                            setCurrentAd(prev => ({ ...prev, status: 'APPROVED', isUrgent: true, badgeApproved: true }));
                          }}
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-xs"
                          title="تایید آگهی همراه با نشان متمایز قرمز فوری"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-300" />
                          <span>تایید با نشان فوری</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onApproveAd(currentAd.id, false);
                            setCurrentAd(prev => ({ ...prev, status: 'APPROVED', isUrgent: false, badgeApproved: false }));
                          }}
                          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-xs"
                          title="تایید آگهی بدون نشان فوری (تبدیل به آگهی عادی)"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>تایید عادی (بدون نشان)</span>
                        </button>
                      </div>
                    )}

                    {currentAd.status === 'APPROVED' && onApproveAd && (
                      <div className="pt-1 flex items-center gap-2">
                        {currentAd.isUrgent ? (
                          <button
                            type="button"
                            onClick={() => {
                              onApproveAd(currentAd.id, false);
                              setCurrentAd(prev => ({ ...prev, isUrgent: false, badgeApproved: false }));
                            }}
                            className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold py-1.5 rounded-xl transition"
                          >
                            <span>حذف نشان فوری از این آگهی (تبدیل به عادی)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onApproveAd(currentAd.id, true);
                              setCurrentAd(prev => ({ ...prev, isUrgent: true, badgeApproved: true }));
                            }}
                            className="flex-1 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-1.5 rounded-xl transition shadow-2xs"
                          >
                            <Flame className="w-3.5 h-3.5 text-amber-100" />
                            <span>اعطای مجدد نشان فوری به آگهی</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {/* EDIT AD BUTTON - Can edit before or after approval */}
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold py-2 rounded-xl transition shadow-2xs"
                  >
                    <Edit2 className="w-4 h-4 text-indigo-600" />
                    <span>ویرایش و اصلاح کامل آگهی توسط مدیر</span>
                  </button>

                  {/* Standard approve button if NOT urgent / badge requested */}
                  {currentAd.status !== 'APPROVED' && onApproveAd && !currentAd.badgeRequested && !currentAd.isUrgent && (
                    <button
                      type="button"
                      onClick={() => {
                        onApproveAd(currentAd.id, false);
                        setCurrentAd(prev => ({ ...prev, status: 'APPROVED' }));
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>تایید و انتشار آگهی</span>
                    </button>
                  )}

                  {currentAd.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => setIsRejecting(!isRejecting)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold py-2 rounded-xl transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رد آگهی</span>
                    </button>
                  )}

                  {onDeleteAd && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('آیا از حذف کامل این آگهی اطمینان دارید؟')) {
                          onDeleteAd(currentAd.id);
                          onClose();
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition"
                      title="حذف کامل آگهی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isRejecting && onRejectAd && (
                  <div className="pt-2 space-y-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="علت رد آگهی (مثال: عدم درج مشخصات کامل، قیمت نامتعارف)..."
                      className="w-full text-xs p-2 rounded-xl border border-rose-200 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onRejectAd(currentAd.id, rejectReason || 'عدم رعایت آیین‌نامه معاملات سازمانی');
                        setCurrentAd(prev => ({ ...prev, status: 'REJECTED', rejectionReason: rejectReason }));
                        setIsRejecting(false);
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 rounded-xl transition"
                    >
                      ثبت رد با ذکر دلیل
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Corporate Safety Note */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>راهنمای معامله امن درون‌سازمانی</span>
              </div>
              تمامی کاربران این سامانه با حساب ویندوز اکتیو دایرکتوری شناسایی شده‌اند. بازدید و تحویل کالا ترجیحاً در ساعات اداری و محوطه سازمان انجام پذیرد.
            </div>
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
