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
}

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
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
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
      };
    }
  } catch (e) {
    console.error('Error reading database file:', e);
  }

  const initial: ServerDatabaseState = {
    users: [],
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
}
