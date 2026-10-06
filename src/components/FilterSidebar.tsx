import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Tag,
  CheckCircle2,
  ArrowDownUp,
  Layers,
} from 'lucide-react';
import { Category, FilterState } from '../types';
import { toPersianDigits, formatPersianNumber } from '../utils/jalali';
import { useText } from '../context/TextContext';

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeCategory?: Category;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  activeCategory,
}) => {
  const { t } = useText();

  const handleCustomFieldChange = (key: string, value: any) => {
    const updated = {
      ...filters.customFieldFilters,
      [key]: value,
    };
    if (value === '' || value === undefined || value === null) {
      delete updated[key];
    }
    onFilterChange({ customFieldFilters: updated });
  };

  const hasActiveFilters =
    filters.categoryId !== '' ||
    filters.onlyFree ||
    filters.onlyUrgent ||
    filters.onlyWithImages ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    Object.keys(filters.customFieldFilters).length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-6 transition-colors" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t('filters.header_title', 'فیلترهای پیشرفته')}</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('filters.reset_btn', 'حذف فیلترها')}</span>
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <ArrowDownUp className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{t('filters.sort_label', 'ترتیب نمایش')}</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onFilterChange({ sortBy: e.target.value as any })}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
        >
          <option value="NEWEST">{t('filters.sort_newest', 'جدیدترین آگهی‌ها')}</option>
          <option value="PRICE_ASC">{t('filters.sort_cheapest', 'ارزان‌ترین')}</option>
          <option value="PRICE_DESC">{t('filters.sort_expensive', 'گران‌ترین')}</option>
          <option value="VIEWS">{t('filters.sort_views', 'پربازدیدترین‌ها')}</option>
        </select>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{t('filters.categories_label', 'انتخاب دسته‌بندی')}</span>
        </label>
        <select
          value={filters.categoryId}
          onChange={e => {
            onFilterChange({
              categoryId: e.target.value,
              customFieldFilters: {}, // reset category dynamic filters
            });
          }}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
        >
          <option value="">{t('filters.all_categories', 'همه دسته‌بندی‌ها')}</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t('filters.price_range', 'محدوده قیمت (تومان)')}</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-1">{t('filters.min_price', 'از (حداقل)')}</span>
              <input
                type="number"
                value={filters.minPrice ?? ''}
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  onFilterChange({ minPrice: val });
                }}
                placeholder="مثلاً ۱,۰۰۰,۰۰۰"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-1">{t('filters.max_price', 'تا (حداکثر)')}</span>
              <input
                type="number"
                value={filters.maxPrice ?? ''}
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  onFilterChange({ maxPrice: val });
                }}
                placeholder="مثلاً ۵۰,۰۰۰,۰۰۰"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
          </div>
        </div>

      {/* DYNAMIC CATEGORY FIELDS FILTER (Crucial requirement) */}
      {activeCategory && activeCategory.fields && activeCategory.fields.length > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>ویژگی‌های اختصاصی {activeCategory?.title || ''}</span>
          </div>

          <div className="space-y-3">
            {activeCategory.fields.map(field => {
              const currentVal = filters.customFieldFilters[field.name];

              if (field.type === 'select' && field.options) {
                return (
                  <div key={field.id}>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {field.label}
                    </label>
                    <select
                      value={currentVal || ''}
                      onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    >
                      <option value="">همه گزینه‌ها</option>
                      {field.options.map(opt => (
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
                  <label
                    key={field.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/80 cursor-pointer transition text-xs"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">{field.label} دار</span>
                    <input
                      type="checkbox"
                      checked={!!currentVal}
                      onChange={e => handleCustomFieldChange(field.name, e.target.checked ? true : undefined)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-600"
                    />
                  </label>
                );
              }

              if (field.type === 'number') {
                return (
                  <div key={field.id}>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      حداقل {field.label} {field.unit ? `(${field.unit})` : ''}
                    </label>
                    <input
                      type="number"
                      value={currentVal || ''}
                      onChange={e =>
                        handleCustomFieldChange(field.name, e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder={field.placeholder || `مثال: ۱۰`}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}

      {/* Enterprise Notice */}
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
        <div className="font-bold flex items-center gap-1 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('filters.direct_notice_title', 'ارتباط مستقیم سازمانی')}</span>
        </div>
        {t('filters.direct_notice_desc', 'درج آگهی و تبادل خدمات در این سامانه به صورت مستقیم میان همکاران انجام شده و هیچ‌گونه کارمزد یا واسطه‌ای وجود ندارد.')}
      </div>
    </div>
  );
};
