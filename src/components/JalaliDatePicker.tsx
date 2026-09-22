import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import {
  getCurrentJalali,
  getDaysInJalaliMonth,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEK_DAYS,
  toPersianDigits,
  padPersianDigits,
  getJalaliDateFromNow,
  compareJalaliDates,
} from '../utils/jalali';

interface JalaliDatePickerProps {
  value?: string; // format: "۱۴۰۳/۰۶/۱۵" or empty
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  maxDaysFromNow?: number; // e.g. 30 (1 month)
  minDateToday?: boolean;
  placement?: 'auto' | 'top' | 'bottom';
}

export const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'انتخاب تاریخ شمسی',
  maxDaysFromNow = 30,
  minDateToday = true,
  placement = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [actualPlacement, setActualPlacement] = useState<'top' | 'bottom'>('bottom');

  const current = getCurrentJalali();
  const maxTarget = getJalaliDateFromNow(maxDaysFromNow);

  const [year, setYear] = useState(current.year);
  const [month, setMonth] = useState(current.month);

  const daysInMonth = getDaysInJalaliMonth(year, month);

  const isPrevDisabled =
    minDateToday &&
    (year < current.year || (year === current.year && month <= current.month));

  const isNextDisabled =
    maxDaysFromNow !== undefined &&
    (year > maxTarget.year || (year === maxTarget.year && month >= maxTarget.month));

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      if (placement === 'top') {
        setActualPlacement('top');
      } else if (placement === 'bottom') {
        setActualPlacement('bottom');
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        // The calendar popup is ~330px high
        if (spaceBelow < 360 && spaceAbove > 280) {
          setActualPlacement('top');
        } else {
          setActualPlacement('bottom');
        }
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (dropdownRef.current) {
          dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextDisabled) return;
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const sm = padPersianDigits(month, 2);
    const sd = padPersianDigits(day, 2);
    const result = `${toPersianDigits(year)}/${sm}/${sd}`;
    onChange(result);
    setIsOpen(false);
  };

  const isDayDisabled = (dayNum: number): boolean => {
    const checkDate = { year, month, day: dayNum };
    if (minDateToday && compareJalaliDates(checkDate, current) < 0) {
      return true;
    }
    if (maxDaysFromNow !== undefined && compareJalaliDates(checkDate, maxTarget) > 0) {
      return true;
    }
    return false;
  };

  return (
    <div ref={containerRef} className="relative text-right" dir="rtl">
      <div className="flex items-center justify-between mb-1.5">
        {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
        {maxDaysFromNow && (
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60">
            حداکثر ۱ ماه (تا {maxTarget.formattedShort})
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition shadow-xs ${
          isOpen ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200'
        }`}
      >
        <span className={value ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1.5">
          {value && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
              انتخاب شده
            </span>
          )}
          <CalendarIcon className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {/* Quick Presets Directly Visible */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-[11px] text-slate-400 font-medium">انتخاب سریع:</span>
        <button
          type="button"
          onClick={() => onChange(getJalaliDateFromNow(7).formattedShort)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border active:scale-95 ${
            value === getJalaliDateFromNow(7).formattedShort
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          ۷ روزه
        </button>
        <button
          type="button"
          onClick={() => onChange(getJalaliDateFromNow(15).formattedShort)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border active:scale-95 ${
            value === getJalaliDateFromNow(15).formattedShort
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          ۱۵ روزه
        </button>
        <button
          type="button"
          onClick={() => onChange(maxTarget.formattedShort)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border active:scale-95 ${
            value === maxTarget.formattedShort
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-rose-50/70 hover:bg-rose-100 text-rose-700 border-rose-200'
          }`}
        >
          ۳۰ روزه (پیش‌فرض)
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-slate-400 hover:text-rose-600 mr-auto font-medium transition"
          >
            پاک کردن
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={dropdownRef}
            className={`absolute right-0 z-50 w-76 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 ${
              actualPlacement === 'top'
                ? 'bottom-full mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150'
                : 'top-full mt-2 animate-in fade-in slide-in-from-top-2 duration-150'
            }`}
          >
            {/* Quick Presets inside dropdown */}
            <div className="mb-3 pb-2.5 border-b border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>مدت زمان اعتبار آگهی:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onChange(getJalaliDateFromNow(7).formattedShort);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition text-center border ${
                    value === getJalaliDateFromNow(7).formattedShort
                      ? 'bg-rose-600 text-white border-rose-600 font-bold'
                      : 'bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border-slate-200'
                  }`}
                >
                  ۷ روزه
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(getJalaliDateFromNow(15).formattedShort);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition text-center border ${
                    value === getJalaliDateFromNow(15).formattedShort
                      ? 'bg-rose-600 text-white border-rose-600 font-bold'
                      : 'bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border-slate-200'
                  }`}
                >
                  ۱۵ روزه
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(maxTarget.formattedShort);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition text-center border ${
                    value === maxTarget.formattedShort
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                >
                  ۳۰ روزه (حداکثر)
                </button>
              </div>
            </div>

            {/* Header with Month / Year navigation */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="ماه قبل"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-sm font-bold text-slate-800">
                {PERSIAN_MONTH_NAMES[month - 1]} {toPersianDigits(year)}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={isNextDisabled}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="ماه بعد (حداکثر ۱ ماه)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {PERSIAN_WEEK_DAYS.map((wd, i) => (
                <span key={i} className="text-[11px] font-medium text-slate-400 py-1">
                  {wd.slice(0, 1)}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = current.year === year && current.month === month && current.day === dayNum;
                const disabled = isDayDisabled(dayNum);
                const sm = padPersianDigits(month, 2);
                const sd = padPersianDigits(dayNum, 2);
                const dayFormatted = `${toPersianDigits(year)}/${sm}/${sd}`;
                const isSelected = value === dayFormatted;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition ${
                      disabled
                        ? 'text-slate-300 bg-slate-50/40 cursor-not-allowed line-through decoration-slate-300'
                        : isSelected
                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {toPersianDigits(dayNum)}
                  </button>
                );
              })}
            </div>

            {/* Info notice about 1 month restriction */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="text-slate-500 flex items-center gap-1 truncate">
                <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">حداکثر تاریخ مجاز: {maxTarget.formattedShort}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-medium shrink-0 mr-2"
              >
                پاک کردن
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

