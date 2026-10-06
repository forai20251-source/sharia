import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Express } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'server_db.json');

export interface ReportReasonRecord {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  orderNum: number;
}

export interface ServerDatabaseState {
  users: any[];
  categories: any[];
  ads: any[];
  adReports: any[];
  reportReasons: ReportReasonRecord[];
  adPolicy: any;
  adConfig: any;
  auditLogs: any[];
  bookmarks: string[];
  adminLocalPassword: string;
  uiTexts?: Record<string, string>;
}

export const DEFAULT_USERS = [
  {
    id: 'usr-ad-admin',
    username: 'CORP\\admin',
    displayName: 'مهندس علیرضا رضایی (مدیر ارشد زیرساخت IT)',
    email: 'admin@corp.local',
    department: 'فناوری اطلاعات و ارتباطات (ICT)',
    internalPhone: '۱۰۱',
    mobilePhone: '۰۹۱۲۱۱۱۰۰۰۱',
    role: 'SUPER_ADMIN',
    adGroups: ['Domain Admins', 'Enterprise Admins', 'IT_Support'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۰۸:۳۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-kazemi',
    username: 'CORP\\m.kazemi',
    displayName: 'محمد کاظمی (مدیر نقلیه و خودرو)',
    email: 'm.kazemi@corp.local',
    department: 'ترابری و پشتیبانی نقلیه',
    internalPhone: '۲۰۵',
    mobilePhone: '۰۹۱۲۲۲۲۰۰۰۲',
    role: 'CATEGORY_MANAGER',
    managedCategoryIds: ['cat-vehicles'],
    adGroups: ['Domain Users', 'Transport_Managers'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'دیروز، ساعت ۱۶:۴۵',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-rahimi',
    username: 'CORP\\s.rahimi',
    displayName: 'سارا رحیمی (مدیر املاک و رفاهیات)',
    email: 's.rahimi@corp.local',
    department: 'امور رفاهی و منابع انسانی',
    internalPhone: '۳۱۲',
    mobilePhone: '۰۹۱۲۳۳۳۰۰۰۳',
    role: 'CATEGORY_MANAGER',
    managedCategoryIds: ['cat-real-estate'],
    adGroups: ['Domain Users', 'HR_Managers'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۰۹:۱۵',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-ebrahimi',
    username: 'CORP\\a.ebrahimi',
    displayName: 'علی‌رضا ابراهیمی (مدیر تجهیزات دیجیتال)',
    email: 'a.ebrahimi@corp.local',
    department: 'فناوری اطلاعات و پشتیبانی شبکه',
    internalPhone: '۱۰۸',
    mobilePhone: '۰۹۱۲۴۴۴۰۰۰۴',
    role: 'CATEGORY_MANAGER',
    managedCategoryIds: ['cat-digital'],
    adGroups: ['Domain Users', 'IT_Support'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۱۱:۰۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-hosseini',
    username: 'CORP\\f.hosseini',
    displayName: 'فاطمه حسینی (مدیر لوازم اداری و مصرفی)',
    email: 'f.hosseini@corp.local',
    department: 'تدارکات و انبار مرکزی',
    internalPhone: '۴۲۱',
    mobilePhone: '۰۹۱۲۵۵۵۰۰۰۵',
    role: 'CATEGORY_MANAGER',
    managedCategoryIds: ['cat-office'],
    adGroups: ['Domain Users', 'Procurement_Team'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: '۲ روز پیش',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-mohammadi',
    username: 'CORP\\h.mohammadi',
    displayName: 'حسن محمدی (مدیر خدمات و تشریفات)',
    email: 'h.mohammadi@corp.local',
    department: 'خدمات عمومی و رفاهی',
    internalPhone: '۵۰۲',
    mobilePhone: '۰۹۱۲۶۶۶۰۰۰۶',
    role: 'CATEGORY_MANAGER',
    managedCategoryIds: ['cat-services'],
    adGroups: ['Domain Users', 'Services_Team'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۱۰:۳۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-moradi',
    username: 'CORP\\z.moradi',
    displayName: 'زهرا مرادی (کارشناس ارشد گزینش و پرسنلی)',
    email: 'z.moradi@corp.local',
    department: 'منابع انسانی و آموزش',
    internalPhone: '۳۱۵',
    mobilePhone: '۰۹۱۲۷۷۷۰۰۰۷',
    role: 'USER',
    adGroups: ['Domain Users', 'HR_Staff'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: '۳ روز پیش',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-abbasi',
    username: 'CORP\\k.abbasi',
    displayName: 'کامران عباسی (رئیس اداره حسابداری)',
    email: 'k.abbasi@corp.local',
    department: 'امور مالی و حسابداری',
    internalPhone: '۶۰۱',
    mobilePhone: '۰۹۱۲۸۸۸۰۰۰۸',
    role: 'USER',
    adGroups: ['Domain Users', 'Finance_Staff'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'دیروز، ساعت ۱۴:۲۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-rostami',
    username: 'CORP\\p.rostami',
    displayName: 'پیمان رستمی (مسئول حراست و انتظامات)',
    email: 'p.rostami@corp.local',
    department: 'حراست و امنیت فیزیکی',
    internalPhone: '۱۱۰',
    mobilePhone: '۰۹۱۲۹۹۹۰۰۰۹',
    role: 'USER',
    adGroups: ['Domain Users', 'Security_Staff'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۰۷:۴۵',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-karimi',
    username: 'CORP\\n.karimi',
    displayName: 'نیلوفر کریمی (کارشناس بازرگانی و قراردادها)',
    email: 'n.karimi@corp.local',
    department: 'امور حقوقی و قراردادها',
    internalPhone: '۷۰۴',
    mobilePhone: '۰۹۱۹۱۱۱۰۰۱۰',
    role: 'USER',
    adGroups: ['Domain Users', 'Legal_Team'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۱۲:۱۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-taheri',
    username: 'CORP\\s.taheri',
    displayName: 'سعید طاهری (کارشناس روابط عمومی)',
    email: 's.taheri@corp.local',
    department: 'روابط عمومی و امور بین‌الملل',
    internalPhone: '۸۰۲',
    mobilePhone: '۰۹۱۹۲۲۲۰۰۱۱',
    role: 'USER',
    adGroups: ['Domain Users', 'PR_Staff'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: '۴ روز پیش',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-safari',
    username: 'CORP\\b.safari',
    displayName: 'بهنام صفری (کارشناس بازرسی و نظارت)',
    email: 'b.safari@corp.local',
    department: 'بازرسی و رسیدگی به شکایات',
    internalPhone: '۱۱۵',
    mobilePhone: '۰۹۱۹۳۳۳۰۰۱۲',
    role: 'USER',
    adGroups: ['Domain Users', 'Inspection_Staff'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۰۸:۵۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-farhadi',
    username: 'CORP\\m.farhadi',
    displayName: 'مهدی فرهادی (کارشناس زیرساخت شبکه و سرور)',
    email: 'm.farhadi@corp.local',
    department: 'فناوری اطلاعات و شبکه',
    internalPhone: '۱۰۶',
    mobilePhone: '۰۹۱۹۴۴۴۰۰۱۳',
    role: 'USER',
    adGroups: ['Domain Users', 'IT_Support'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'امروز، ساعت ۱۰:۰۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
  {
    id: 'usr-ad-salehi',
    username: 'CORP\\j.salehi',
    displayName: 'جواد صالحی (سرپرست انبار مرکزی)',
    email: 'j.salehi@corp.local',
    department: 'تدارکات و انبار مرکزی',
    internalPhone: '۴۲۵',
    mobilePhone: '۰۹۱۹۵۵۵۰۰۱۴',
    role: 'USER',
    adGroups: ['Domain Users', 'Procurement_Team'],
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    lastLoginShamsi: 'دیروز، ساعت ۱۱:۳۰',
    status: 'ACTIVE',
    profileCompleted: true,
  },
];

const DEFAULT_REPORT_REASONS: ReportReasonRecord[] = [
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

const DEFAULT_POLICY = {
  enabled: true,
  maxAdsPerSolarMonth: 3,
  maxActiveAdsPerUser: 5,
  maxUrgentBadgesPerMonth: 2,
  coolDownHours: 0,
  bypassForAdminsAndManagers: true,
  minTitleLength: 3,
  maxTitleLength: 120,
  userCustomQuotas: {},
  allowUserAdReporting: true,
};

const DEFAULT_CATEGORIES = [
  {
    id: 'cat-vehicles',
    title: 'وسایل نقلیه و خودرو',
    slug: 'vehicles',
    icon: 'Car',
    description: 'خرید و فروش خودروهای شخصی، اداری، سازمانی و قطعات یدکی',
    color: 'from-blue-500 to-indigo-600',
    managerId: '',
    managerName: 'تعیین نشده',
    managerDepartment: '',
    allowAutoApprove: false,
    defaultImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><text x="300" y="200" font-family="sans-serif" font-size="24" fill="%2394a3b8" text-anchor="middle">خودرو و وسایل نقلیه</text></svg>',
    fields: [
      {
        id: 'f-v-model',
        categoryId: 'cat-vehicles',
        name: 'car_model',
        label: 'مدل / سال ساخت',
        type: 'text',
        required: true,
        placeholder: 'مثال: ۱۴۰۱ یا ۲۰۲۲',
        showInCard: true,
        order: 1,
      },
      {
        id: 'f-v-mileage',
        categoryId: 'cat-vehicles',
        name: 'mileage',
        label: 'کارکرد',
        type: 'number',
        unit: 'کیلومتر',
        required: true,
        placeholder: 'مثال: ۴۵۰۰۰',
        showInCard: true,
        order: 2,
      },
      {
        id: 'f-v-gearbox',
        categoryId: 'cat-vehicles',
        name: 'gearbox',
        label: 'نوع گیربکس',
        type: 'select',
        options: ['اتوماتیک', 'دستی'],
        required: true,
        showInCard: true,
        order: 3,
      },
    ],
  },
  {
    id: 'cat-real-estate',
    title: 'املاک و مسکن سازمانی',
    slug: 'real-estate',
    icon: 'Home',
    description: 'رهن، اجاره و فروش آپارتمان و ویلا برای همکاران',
    color: 'from-emerald-500 to-teal-600',
    managerId: '',
    managerName: 'تعیین نشده',
    managerDepartment: '',
    allowAutoApprove: false,
    defaultImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><text x="300" y="200" font-family="sans-serif" font-size="24" fill="%2394a3b8" text-anchor="middle">املاک و مسکن</text></svg>',
    fields: [
      {
        id: 'f-re-area',
        categoryId: 'cat-real-estate',
        name: 'area_sqm',
        label: 'متراژ (متر مربع)',
        type: 'number',
        unit: 'متر',
        required: true,
        placeholder: 'مثال: ۹۵',
        showInCard: true,
        order: 1,
      },
      {
        id: 'f-re-rooms',
        categoryId: 'cat-real-estate',
        name: 'rooms',
        label: 'تعداد اتاق',
        type: 'select',
        options: ['یک خوابه', 'دو خوابه', 'سه خوابه', 'چهار خوابه یا بیشتر'],
        required: true,
        showInCard: true,
        order: 2,
      },
    ],
  },
  {
    id: 'cat-digital',
    title: 'کالای دیجیتال و الکترونیک',
    slug: 'digital',
    icon: 'Laptop',
    description: 'لپ‌تاپ، تبلت، گوشی موبایل، مانیتور و تجهیزات شبکه',
    color: 'from-amber-500 to-orange-600',
    managerId: '',
    managerName: 'تعیین نشده',
    managerDepartment: '',
    allowAutoApprove: false,
    defaultImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><text x="300" y="200" font-family="sans-serif" font-size="24" fill="%2394a3b8" text-anchor="middle">کالای دیجیتال</text></svg>',
    fields: [
      {
        id: 'f-d-brand',
        categoryId: 'cat-digital',
        name: 'brand',
        label: 'برند / سازنده',
        type: 'text',
        required: true,
        placeholder: 'مثال: Apple، Asus، Dell، Samsung',
        showInCard: true,
        order: 1,
      },
      {
        id: 'f-d-condition',
        categoryId: 'cat-digital',
        name: 'condition',
        label: 'وضعیت دستگاه',
        type: 'select',
        options: ['نو (آکبند)', 'در حد نو', 'کارکرده سالم'],
        required: true,
        showInCard: true,
        order: 2,
      },
    ],
  },
];

let dbState: ServerDatabaseState;

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): ServerDatabaseState {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);

      const rawUsers = Array.isArray(parsed.users) ? parsed.users : [];
      // Merge with DEFAULT_USERS so that corporate Active Directory staff are always present
      const usersMap = new Map();
      for (const u of DEFAULT_USERS) {
        usersMap.set(u.id, u);
      }
      for (const u of rawUsers) {
        usersMap.set(u.id, { ...usersMap.get(u.id), ...u });
      }
      const effectiveUsers = Array.from(usersMap.values());

      const state: ServerDatabaseState = {
        users: effectiveUsers,
        categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES,
        ads: Array.isArray(parsed.ads) ? parsed.ads : [],
        adReports: Array.isArray(parsed.adReports) ? parsed.adReports : [],
        reportReasons: Array.isArray(parsed.reportReasons) && parsed.reportReasons.length > 0 ? parsed.reportReasons : DEFAULT_REPORT_REASONS,
        adPolicy: parsed.adPolicy || DEFAULT_POLICY,
        adConfig: parsed.adConfig || {
          serverHost: '127.0.0.1',
          port: 389,
          domainName: 'corp.local',
          baseDn: 'DC=corp,DC=local',
          bindUserDn: 'CN=Administrator,CN=Users,DC=corp,DC=local',
          groupAdminDn: 'CN=DivarAdmins,CN=Users,DC=corp,DC=local',
          groupManagerDn: 'CN=CategoryManagers,CN=Users,DC=corp,DC=local',
          useSsl: false,
          autoCreateUser: true,
        },
        auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
        adminLocalPassword: parsed.adminLocalPassword || '',
        uiTexts: parsed.uiTexts && typeof parsed.uiTexts === 'object' ? parsed.uiTexts : {},
      };

      // If database file had fewer users than effectiveUsers, re-save it
      if (rawUsers.length < effectiveUsers.length) {
        saveDatabase(state);
      }

      return state;
    }
  } catch (e) {
    console.error('Error reading database file:', e);
  }

  const initial: ServerDatabaseState = {
    users: [...DEFAULT_USERS],
    categories: DEFAULT_CATEGORIES,
    ads: [],
    adReports: [],
    reportReasons: DEFAULT_REPORT_REASONS,
    adPolicy: DEFAULT_POLICY,
    adConfig: {
      serverHost: '127.0.0.1',
      port: 389,
      domainName: 'corp.local',
      baseDn: 'DC=corp,DC=local',
      bindUserDn: 'CN=Administrator,CN=Users,DC=corp,DC=local',
      groupAdminDn: 'CN=DivarAdmins,CN=Users,DC=corp,DC=local',
      groupManagerDn: 'CN=CategoryManagers,CN=Users,DC=corp,DC=local',
      useSsl: false,
      autoCreateUser: true,
    },
    auditLogs: [],
    bookmarks: [],
    adminLocalPassword: '',
    uiTexts: {},
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(state: ServerDatabaseState): void {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to database file:', e);
  }
}

dbState = loadDatabase();

export function registerDatabaseRoutes(app: Express, getDbPool: () => any): void {
  // 1. Bootstrap: Fetch all data from database on startup
  app.get('/api/db/bootstrap', async (req, res) => {
    try {
      dbState = loadDatabase();
      res.json({
        success: true,
        dbSource: 'DATABASE',
        users: dbState.users,
        categories: dbState.categories,
        ads: dbState.ads,
        adReports: dbState.adReports,
        reportReasons: dbState.reportReasons,
        adPolicy: dbState.adPolicy,
        adConfig: dbState.adConfig,
        auditLogs: dbState.auditLogs,
        bookmarks: dbState.bookmarks,
        adminLocalPassword: dbState.adminLocalPassword,
        uiTexts: dbState.uiTexts || {},
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 2. Report Reasons: GET, POST, DELETE
  app.get('/api/db/report-reasons', (req, res) => {
    res.json({ success: true, reasons: dbState.reportReasons });
  });

  app.post('/api/db/report-reasons', async (req, res) => {
    try {
      const reason: ReportReasonRecord = req.body;
      if (!reason.id || !reason.label) {
        return res.status(400).json({ success: false, message: 'عنوان دلیل گزارش الزامی است.' });
      }

      const existingIndex = dbState.reportReasons.findIndex(r => r.id === reason.id);
      if (existingIndex >= 0) {
        dbState.reportReasons[existingIndex] = {
          ...dbState.reportReasons[existingIndex],
          ...reason,
        };
      } else {
        dbState.reportReasons.push({
          id: reason.id,
          label: reason.label.trim(),
          description: (reason.description || '').trim(),
          isActive: reason.isActive !== undefined ? Boolean(reason.isActive) : true,
          orderNum: Number(reason.orderNum) || dbState.reportReasons.length + 1,
        });
      }

      saveDatabase(dbState);

      // Attempt MySQL replication if connected
      try {
        const pool = getDbPool();
        await pool.query(
          `INSERT INTO ad_report_reasons (id, label, description, is_active, order_num)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE label = VALUES(label), description = VALUES(description), is_active = VALUES(is_active), order_num = VALUES(order_num)`,
          [reason.id, reason.label, reason.description || '', reason.isActive ? 1 : 0, reason.orderNum || 0]
        );
      } catch {}

      res.json({ success: true, reasons: dbState.reportReasons });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.put('/api/db/report-reasons/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const index = dbState.reportReasons.findIndex(r => r.id === id);
      if (index >= 0) {
        dbState.reportReasons[index] = {
          ...dbState.reportReasons[index],
          ...updates,
          id, // ensure ID is preserved
        };
        saveDatabase(dbState);

        try {
          const pool = getDbPool();
          await pool.query(
            `UPDATE ad_report_reasons SET label = ?, description = ?, is_active = ?, order_num = ? WHERE id = ?`,
            [
              dbState.reportReasons[index].label,
              dbState.reportReasons[index].description || '',
              dbState.reportReasons[index].isActive ? 1 : 0,
              dbState.reportReasons[index].orderNum || 0,
              id,
            ]
          );
        } catch {}
      }
      res.json({ success: true, reasons: dbState.reportReasons });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/db/report-reasons/:id', async (req, res) => {
    try {
      const { id } = req.params;
      dbState.reportReasons = dbState.reportReasons.filter(r => r.id !== id);
      saveDatabase(dbState);

      try {
        const pool = getDbPool();
        await pool.query('DELETE FROM ad_report_reasons WHERE id = ?', [id]);
      } catch {}

      res.json({ success: true, reasons: dbState.reportReasons });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 3. Ad Reports: POST, PUT, DELETE
  app.post('/api/db/reports', async (req, res) => {
    try {
      const report = req.body;
      if (!report.id || !report.adId) {
        return res.status(400).json({ success: false, message: 'اطلاعات گزارش نامعتبر است.' });
      }

      dbState.adReports.unshift(report);

      // Increment reportsCount on the target ad
      const targetAd = dbState.ads.find(a => a.id === report.adId);
      if (targetAd) {
        targetAd.reportsCount = (targetAd.reportsCount || 0) + 1;
      }

      saveDatabase(dbState);

      try {
        const pool = getDbPool();
        await pool.query(
          `INSERT INTO ad_reports (id, ad_id, ad_title, ad_category_title, author_id, author_name, reporter_id, reporter_name, reporter_department, reason_id, reason_label, description, created_at_shamsi, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            report.id,
            report.adId,
            report.adTitle,
            report.adCategoryTitle || '',
            report.authorId,
            report.authorName,
            report.reporterId,
            report.reporterName,
            report.reporterDepartment || '',
            report.reason || '',
            report.reasonLabel || '',
            report.description || '',
            report.createdAtShamsi,
            report.status || 'PENDING',
          ]
        );
      } catch {}

      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.put('/api/db/reports/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const index = dbState.adReports.findIndex(r => r.id === id);
      if (index >= 0) {
        dbState.adReports[index] = {
          ...dbState.adReports[index],
          ...updates,
        };
        saveDatabase(dbState);

        try {
          const pool = getDbPool();
          await pool.query(
            `UPDATE ad_reports SET status = ?, admin_note = ?, resolved_at_shamsi = ?, resolved_by_name = ? WHERE id = ?`,
            [updates.status, updates.adminNote || '', updates.resolvedAtShamsi || '', updates.resolvedByName || '', id]
          );
        } catch {}
      }
      res.json({ success: true, report: dbState.adReports[index] });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/db/reports/:id', async (req, res) => {
    try {
      const { id } = req.params;
      dbState.adReports = dbState.adReports.filter(r => r.id !== id);
      saveDatabase(dbState);

      try {
        const pool = getDbPool();
        await pool.query('DELETE FROM ad_reports WHERE id = ?', [id]);
      } catch {}

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 4. Ads: POST, PUT, DELETE
  app.post('/api/db/ads', async (req, res) => {
    try {
      const ad = req.body;
      const index = dbState.ads.findIndex(a => a.id === ad.id);
      if (index >= 0) {
        dbState.ads[index] = ad;
      } else {
        dbState.ads.unshift(ad);
      }
      saveDatabase(dbState);
      res.json({ success: true, ad });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.put('/api/db/ads/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const index = dbState.ads.findIndex(a => a.id === id);
      if (index >= 0) {
        dbState.ads[index] = { ...dbState.ads[index], ...updates };
        saveDatabase(dbState);
      }
      res.json({ success: true, ad: dbState.ads[index] });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/db/ads/:id', async (req, res) => {
    try {
      const { id } = req.params;
      dbState.ads = dbState.ads.filter(a => a.id !== id);
      saveDatabase(dbState);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 5. Categories: POST, DELETE
  app.post('/api/db/categories', async (req, res) => {
    try {
      const category = req.body;
      const index = dbState.categories.findIndex(c => c.id === category.id);
      if (index >= 0) {
        dbState.categories[index] = category;
      } else {
        dbState.categories.push(category);
      }
      saveDatabase(dbState);
      res.json({ success: true, category });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/db/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      dbState.categories = dbState.categories.filter(c => c.id !== id);
      saveDatabase(dbState);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 6. Users: POST
  app.post('/api/db/users', async (req, res) => {
    try {
      const user = req.body;
      const index = dbState.users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        dbState.users[index] = { ...dbState.users[index], ...user };
      } else {
        dbState.users.push(user);
      }
      saveDatabase(dbState);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 7. Policy: POST
  app.post('/api/db/policy', async (req, res) => {
    try {
      dbState.adPolicy = { ...dbState.adPolicy, ...req.body };
      saveDatabase(dbState);
      res.json({ success: true, policy: dbState.adPolicy });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 8. Admin Password: POST
  app.post('/api/db/admin-password', async (req, res) => {
    try {
      const { password } = req.body;
      dbState.adminLocalPassword = String(password || '').trim();
      saveDatabase(dbState);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 9. AD Config: POST
  app.post('/api/db/ad-config', async (req, res) => {
    try {
      dbState.adConfig = { ...dbState.adConfig, ...req.body };
      saveDatabase(dbState);
      res.json({ success: true, config: dbState.adConfig });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 10. Audit Log: POST
  app.post('/api/db/audit', async (req, res) => {
    try {
      const log = req.body;
      dbState.auditLogs.unshift(log);
      if (dbState.auditLogs.length > 300) {
        dbState.auditLogs = dbState.auditLogs.slice(0, 300);
      }
      saveDatabase(dbState);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 11. Bookmarks: POST
  app.post('/api/db/bookmarks', async (req, res) => {
    try {
      const { bookmarks } = req.body;
      if (Array.isArray(bookmarks)) {
        dbState.bookmarks = bookmarks;
        saveDatabase(dbState);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 12. UI Texts CMS (Dynamic System Text Overrides): GET, POST, DELETE, RESET
  app.get('/api/db/ui-texts', (req, res) => {
    res.json({ success: true, texts: dbState.uiTexts || {} });
  });

  app.post('/api/db/ui-texts', async (req, res) => {
    try {
      const { key, value, texts } = req.body;
      if (!dbState.uiTexts) dbState.uiTexts = {};
      if (texts && typeof texts === 'object') {
        dbState.uiTexts = { ...dbState.uiTexts, ...texts };
      } else if (key) {
        dbState.uiTexts[key] = String(value ?? '');
      }
      saveDatabase(dbState);
      res.json({ success: true, texts: dbState.uiTexts });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/db/ui-texts/:key', async (req, res) => {
    try {
      const { key } = req.params;
      if (dbState.uiTexts && key in dbState.uiTexts) {
        delete dbState.uiTexts[key];
        saveDatabase(dbState);
      }
      res.json({ success: true, texts: dbState.uiTexts || {} });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/db/ui-texts/reset', async (req, res) => {
    try {
      dbState.uiTexts = {};
      saveDatabase(dbState);
      res.json({ success: true, texts: {} });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 12. Active Directory Users Endpoint
  app.get('/api/ad/users', async (req, res) => {
    try {
      dbState = loadDatabase();
      res.json({
        success: true,
        users: dbState.users,
        total: dbState.users.length,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 13. Category Manager Assignment Endpoint (Updates category and user roles)
  app.post('/api/categories/:id/manager', async (req, res) => {
    try {
      const { id } = req.params;
      const { managerId } = req.body;
      const catIndex = dbState.categories.findIndex(c => c.id === id);
      if (catIndex === -1) {
        return res.status(404).json({ success: false, message: 'دسته‌بندی یافت نشد.' });
      }

      const oldManagerId = dbState.categories[catIndex].managerId;
      const newManager = dbState.users.find(u => u.id === managerId);

      if (!newManager && managerId) {
        return res.status(404).json({ success: false, message: 'کاربر مورد نظر در اکتیو دایرکتوری یافت نشد.' });
      }

      // Update category
      dbState.categories[catIndex] = {
        ...dbState.categories[catIndex],
        managerId: newManager ? newManager.id : '',
        managerName: newManager ? newManager.displayName : 'تعیین نشده',
        managerDepartment: newManager ? newManager.department : '',
      };

      // Promote new manager to CATEGORY_MANAGER if not SUPER_ADMIN
      if (newManager) {
        const uIdx = dbState.users.findIndex(u => u.id === newManager.id);
        if (uIdx >= 0) {
          const currentManaged = Array.isArray(dbState.users[uIdx].managedCategoryIds)
            ? dbState.users[uIdx].managedCategoryIds
            : [];
          dbState.users[uIdx] = {
            ...dbState.users[uIdx],
            role: dbState.users[uIdx].role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CATEGORY_MANAGER',
            managedCategoryIds: Array.from(new Set([...currentManaged, id])),
          };
        }
      }

      // Cleanup old manager if different and doesn't manage other categories
      if (oldManagerId && oldManagerId !== managerId) {
        const oldIdx = dbState.users.findIndex(u => u.id === oldManagerId);
        if (oldIdx >= 0 && dbState.users[oldIdx].role !== 'SUPER_ADMIN') {
          const remaining = dbState.categories.filter(c => c.id !== id && c.managerId === oldManagerId);
          dbState.users[oldIdx] = {
            ...dbState.users[oldIdx],
            role: remaining.length > 0 ? 'CATEGORY_MANAGER' : 'USER',
            managedCategoryIds: (dbState.users[oldIdx].managedCategoryIds || []).filter((cid: string) => cid !== id),
          };
        }
      }

      saveDatabase(dbState);
      res.json({
        success: true,
        category: dbState.categories[catIndex],
        users: dbState.users,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}
