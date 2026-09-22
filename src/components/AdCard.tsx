import React from 'react';
import { Bookmark, Clock, MapPin, Sparkles, CheckCircle, Flame, Eye } from 'lucide-react';
import { Ad, Category } from '../types';
import { formatPrice, formatPersianRelativeTime, toPersianDigits } from '../utils/jalali';

interface AdCardProps {
  ad: Ad;
  category?: Category;
  isBookmarked: boolean;
  onToggleBookmark: (adId: string) => void;
  onClick: (ad: Ad) => void;
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  category,
  isBookmarked,
  onToggleBookmark,
  onClick,
}) => {
  // Extract custom fields that are configured with `showInCard = true`
  const dynamicBadges: string[] = [];
  if (category && ad.customFields) {
    category.fields
      .filter(f => f.showInCard)
      .forEach(f => {
        const val = ad.customFields[f.name];
        if (val !== undefined && val !== null && val !== '') {
          if (typeof val === 'boolean') {
            if (val) {
              dynamicBadges.push(f.label);
            }
          } else {
            const unit = f.unit ? ` ${f.unit}` : '';
            dynamicBadges.push(`${toPersianDigits(String(val))}${unit}`);
          }
        }
      });
  }

  const isDefaultCategoryImage = (!ad.images || ad.images.length === 0 || !ad.images[0]) && !!category?.defaultImage;
  const mainImage = ad.images && ad.images.length > 0 && ad.images[0]
    ? ad.images[0]
    : category?.defaultImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => onClick(ad)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
      dir="rtl"
    >
      <div>
        {/* Card Image & Badges */}
        <div className="relative aspect-16/10 sm:aspect-4/3 w-full bg-slate-100 overflow-hidden">
          <img
            src={mainImage}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
            loading="lazy"
          />

          {/* Top badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5 z-10">
            {ad.isUrgent && (
              <span className="flex items-center gap-1 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                <Flame className="w-3 h-3" />
                فوری
              </span>
            )}
            {ad.status === 'PENDING' && (
              <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                در انتظار تایید
              </span>
            )}
            {isDefaultCategoryImage && (
              <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-lg shadow-xs border border-white/10">
                تصویر پیش‌فرض دسته
              </span>
            )}
          </div>

          {/* Bookmark button */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleBookmark(ad.id);
            }}
            className={`absolute top-2.5 left-2.5 p-1.5 rounded-xl backdrop-blur-md transition ${
              isBookmarked
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            title="نشان کردن آگهی"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>

          {/* Views badge */}
          <div className="absolute bottom-2 left-2.5 bg-black/40 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{toPersianDigits(ad.viewsCount || 0)}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 space-y-2">
          {/* Category title */}
          <div className="text-[11px] font-medium text-rose-600">
            {ad.categoryTitle || category?.title || 'عمومی'}
          </div>

          {/* Ad Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-rose-600 transition">
            {ad.title}
          </h3>

          {/* Dynamic Highlighted Custom Fields */}
          {dynamicBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {dynamicBadges.slice(0, 3).map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Time/Location */}
      <div className="p-3.5 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-slate-900">
            {formatPrice(ad.price, ad.isAgreementPrice, ad.isFree)}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatPersianRelativeTime(ad.createdAt)}</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{ad.departmentLocation || ad.city}</span>
        </div>
      </div>
    </div>
  );
};
