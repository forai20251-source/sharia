import React from 'react';
import {
  Car,
  Building2,
  Laptop,
  Briefcase,
  Sparkles,
  LayoutGrid,
  Tag,
  ShieldCheck,
  Package,
  Smartphone,
  Home,
  Coffee,
  ShoppingBag,
  Wrench,
  Shield,
  Camera,
  Tv,
  Printer,
  Shirt,
  Book,
  Headphones,
  Bike,
  Watch,
  HeartHandshake,
} from 'lucide-react';
import { Category, Ad } from '../types';
import { toPersianDigits } from '../utils/jalali';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  ads: Ad[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Car,
  Building2,
  Laptop,
  Briefcase,
  Sparkles,
  Tag,
  LayoutGrid,
  Package,
  Smartphone,
  Home,
  Coffee,
  ShoppingBag,
  Wrench,
  Shield,
  Camera,
  Tv,
  Printer,
  Shirt,
  Book,
  Headphones,
  Bike,
  Watch,
  HeartHandshake,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  ads,
}) => {
  const getCategoryCount = (catId: string) => {
    if (!catId) return ads.filter(a => a.status === 'APPROVED').length;
    return ads.filter(a => a.categoryId === catId && a.status === 'APPROVED').length;
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-2xs" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {/* All categories button */}
        <button
          type="button"
          onClick={() => onSelectCategory('')}
          className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition border ${
            selectedCategoryId === ''
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>همه آگهی‌ها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategoryId === '' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {toPersianDigits(getCategoryCount(''))}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.filter(Boolean).map(cat => {
          const IconComp = ICON_MAP[cat.icon] || Tag;
          const isSelected = selectedCategoryId === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition border group ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat.defaultImage ? (
                <img
                  src={cat.defaultImage}
                  alt={cat?.title || ''}
                  className="w-4 h-4 rounded-md object-cover border border-black/10 shrink-0"
                />
              ) : (
                <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-rose-600'}`} />
              )}
              <span>{cat?.title || ''}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-rose-700 text-rose-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {toPersianDigits(count)}
              </span>

              {cat.managerName && (
                <span
                  className="hidden md:inline text-[9px] opacity-70 border-r border-current pr-1.5 mr-0.5"
                  title={`مدیر ناظر دسته: ${cat.managerName}`}
                >
                  <ShieldCheck className="w-2.5 h-2.5 inline ml-0.5" />
                  {cat.managerName.split(' ')[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
