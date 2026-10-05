import { ReportReasonConfig } from '../types';

export const DEFAULT_REPORT_REASONS: ReportReasonConfig[] = [
  {
    id: 'INAPPROPRIATE_CONTENT',
    label: 'محتوای نامناسب یا مغایر با شئون سازمانی',
    description: 'تصاویر نامناسب، الفاظ غیراخلاقی، متن توهین‌آمیز یا مغایر با قوانین اداری',
    isActive: true,
    orderNum: 1,
  },
  {
    id: 'FRAUD_OR_SUSPICIOUS',
    label: 'اطلاعات نادرست، فریبنده یا مشکوک',
    description: 'عدم تطابق کالای واقعی با مشخصات درج شده، اطلاعات گمراه‌کننده یا ادعای کذب',
    isActive: true,
    orderNum: 2,
  },
  {
    id: 'WRONG_PRICE',
    label: 'قیمت‌گذاری غیرواقعی یا نامتعارف',
    description: 'قیمت‌های غیرمنطقی، صوری یا اعلام قیمت متفاوت در تماس نسبت به آگهی',
    isActive: true,
    orderNum: 3,
  },
  {
    id: 'SOLD_OR_UNAVAILABLE',
    label: 'کالا فروخته شده یا واگذار گردیده است',
    description: 'آگهی‌دهنده پاسخگو نیست یا کالا دیگر موجود نمی‌باشد',
    isActive: true,
    orderNum: 4,
  },
  {
    id: 'WRONG_CATEGORY',
    label: 'دسته‌بندی یا مشخصات فنی اشتباه',
    description: 'درج آگهی در گروه نامربوط یا ثبت مشخصات اشتباه برای کالا',
    isActive: true,
    orderNum: 5,
  },
  {
    id: 'DUPLICATE_SPAM',
    label: 'آگهی تکراری یا اسپم',
    description: 'ارسال مکرر یک آگهی یکسان یا محتوای تبلیغاتی نامربوط',
    isActive: true,
    orderNum: 6,
  },
  {
    id: 'OTHER',
    label: 'سایر موارد و تخلفات',
    description: 'هرگونه مشکل دیگری که نیازمند بررسی و مداخله مدیران سامانه است',
    isActive: true,
    orderNum: 7,
  },
];
