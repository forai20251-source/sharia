/**
 * Persian / Jalali Calendar Utilities and Number Formatting
 */

// Convert English digits to Persian digits
export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  const str = String(n);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
}

// Convert Persian or Arabic digits to English
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (w) => String(w.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (w) => String(w.charCodeAt(0) - 1632));
}

// Format numbers with comma separator and Persian digits e.g. "۱۵,۰۰۰,۰۰۰"
export function formatPersianNumber(n: number | string | undefined | null): string {
  if (n === undefined || n === null || n === '') return '۰';
  const num = typeof n === 'string' ? parseFloat(toEnglishDigits(n)) : n;
  if (isNaN(num)) return '۰';
  const parts = Math.floor(num).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toPersianDigits(parts.join('.'));
}

// Format price in Toman
export function formatPrice(price: number, isAgreement = false, isFree = false): string {
  if (isFree) return 'رایگان';
  if (isAgreement || price === 0) return 'توافقی';
  return `${formatPersianNumber(price)} تومان`;
}

// Accurate Gregorian to Jalali converter
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return [jy, jm, jd];
}

// Jalali to Gregorian converter
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy = (jy <= 979) ? 621 : 1600;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
}

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEK_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

// Get formatted Jalali string e.g. "۱۴۰۳/۰۶/۱۵" or "۱۵ شهریور ۱۴۰۳"
export function formatJalaliDate(dateInput: Date | string | number, format: 'short' | 'long' | 'with-time' = 'long'): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());

  if (format === 'short') {
    const sm = jm < 10 ? `۰${jm}` : toPersianDigits(jm);
    const sd = jd < 10 ? `۰${jd}` : toPersianDigits(jd);
    return `${toPersianDigits(jy)}/${sm}/${sd}`;
  }

  const monthName = PERSIAN_MONTH_NAMES[jm - 1];
  const dateStr = `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`;

  if (format === 'with-time') {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${dateStr} ساعت ${toPersianDigits(hours)}:${toPersianDigits(minutes)}`;
  }

  return dateStr;
}

// Relative time in Persian e.g. "دقایقی پیش", "۲ ساعت پیش", "دیروز"
export function formatPersianRelativeTime(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'همین الان';
  if (diffMin < 60) return `${toPersianDigits(diffMin)} دقیقه پیش`;
  if (diffHour < 24) return `${toPersianDigits(diffHour)} ساعت پیش`;
  if (diffDay === 1) return 'دیروز';
  if (diffDay < 7) return `${toPersianDigits(diffDay)} روز پیش`;
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${toPersianDigits(weeks)} هفته پیش`;
  }
  return formatJalaliDate(d, 'long');
}

// Get current Jalali year, month, day
export function getCurrentJalali(): { year: number; month: number; day: number; monthName: string } {
  const now = new Date();
  const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return {
    year: jy,
    month: jm,
    day: jd,
    monthName: PERSIAN_MONTH_NAMES[jm - 1],
  };
}

// Number of days in a Jalali month
export function getDaysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  // Leap year check in 33-year cycle
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jump = 0;
  for (let j = 1; j < breaks.length; j++) {
    const jmBreak = breaks[j];
    jump = jmBreak - jp;
    if (year < jmBreak) break;
    jp = jmBreak;
  }
  let n = year - jp;
  if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
  let leap = ((((n + 1) % 33) - 1) % 4);
  if (leap === -1) leap = 4;
  return leap === 0 ? 30 : 29;
}
