import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import {
  getCurrentJalali,
  getDaysInJalaliMonth,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEK_DAYS,
  toPersianDigits,
} from '../utils/jalali';

interface JalaliDatePickerProps {
  value?: string; // format: "۱۴۰۳/۰۶/۱۵" or empty
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
}

export const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'انتخاب تاریخ شمسی',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = getCurrentJalali();
  const [year, setYear] = useState(current.year);
  const [month, setMonth] = useState(current.month);

  const daysInMonth = getDaysInJalaliMonth(year, month);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const sm = month < 10 ? `۰${month}` : toPersianDigits(month);
    const sd = day < 10 ? `۰${day}` : toPersianDigits(day);
    const result = `${toPersianDigits(year)}/${sm}/${sd}`;
    onChange(result);
    setIsOpen(false);
  };

  return (
    <div className="relative text-right" dir="rtl">
      {label && <label className="block text-xs font-medium text-slate-700 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition shadow-xs text-slate-800"
      >
        <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header with Month / Year navigation */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-sm font-bold text-slate-800">
                {PERSIAN_MONTH_NAMES[month - 1]} {toPersianDigits(year)}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
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
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition ${
                      isToday
                        ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {toPersianDigits(dayNum)}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => handleSelectDay(current.day)}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                انتخاب امروز ({toPersianDigits(current.day)} {current.monthName})
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600"
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
