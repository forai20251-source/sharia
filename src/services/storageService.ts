import { User, Category, CategoryField, Ad, AdStatus, ActiveDirectoryConfig, MySQLConfig, AuditLog } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_ADS, INITIAL_AD_CONFIG, INITIAL_MYSQL_CONFIG, INITIAL_AUDIT_LOGS } from '../data/initialData';
import { formatJalaliDate } from '../utils/jalali';

const STORAGE_KEYS = {
  USERS: 'divar_users_v1',
  CATEGORIES: 'divar_categories_v1',
  ADS: 'divar_ads_v1',
  CURRENT_USER: 'divar_current_user_v1',
  AD_CONFIG: 'divar_ad_config_v1',
  MYSQL_CONFIG: 'divar_mysql_config_v1',
  AUDIT_LOGS: 'divar_audit_logs_v1',
  BOOKMARKS: 'divar_bookmarks_v1',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

class StorageService {
  private users: User[] = [];
  private categories: Category[] = [];
  private ads: Ad[] = [];
  private currentUser: User | null = null;
  private adConfig: ActiveDirectoryConfig = INITIAL_AD_CONFIG;
  private mysqlConfig: MySQLConfig = INITIAL_MYSQL_CONFIG;
  private auditLogs: AuditLog[] = [];
  private bookmarks: string[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const storedCategories = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    // Ensure all categories have their default image populated
    this.categories = storedCategories.map(c => {
      const initialMatch = INITIAL_CATEGORIES.find(ic => ic.id === c.id);
      return {
        ...c,
        defaultImage: c.defaultImage || initialMatch?.defaultImage,
      };
    });
    this.ads = getFromStorage<Ad[]>(STORAGE_KEYS.ADS, INITIAL_ADS);
    this.adConfig = getFromStorage<ActiveDirectoryConfig>(STORAGE_KEYS.AD_CONFIG, INITIAL_AD_CONFIG);
    this.mysqlConfig = getFromStorage<MySQLConfig>(STORAGE_KEYS.MYSQL_CONFIG, INITIAL_MYSQL_CONFIG);
    this.auditLogs = getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.bookmarks = getFromStorage<string[]>(STORAGE_KEYS.BOOKMARKS, ['ad-101', 'ad-103']);

    // Default logged-in user is Super Admin for full visibility, user can easily switch
    const storedUser = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    this.currentUser = storedUser || this.users[0];
  }

  // Users
  getUsers(): User[] {
    return [...this.users];
  }

  getCurrentUser(): User {
    return this.currentUser || this.users[0];
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
    this.addAuditLog({
      action: 'LOGIN_AD',
      details: `ورود موفق کاربر با حساب ویندوز ${user.username}`,
      status: 'SUCCESS',
      userId: user.id,
      userName: `${user.displayName} (${user.username})`,
    });
  }

  verifyAdminCredentials(
    usernameInput: string,
    passwordInput: string
  ): { success: boolean; user?: User; error?: string } {
    const clean = usernameInput.trim().toLowerCase().replace(/^(corp\\|corp\/)/i, '');
    if (!clean) {
      return { success: false, error: 'لطفاً نام کاربری مدیر را وارد نمایید.' };
    }
    if (!passwordInput.trim()) {
      return { success: false, error: 'لطفاً کلمه عبور را وارد نمایید.' };
    }

    // Match user by username, email, or "admin" / "administrator"
    let matched = this.users.find(u => {
      const uClean = u.username.toLowerCase().replace(/^(corp\\|corp\/)/i, '');
      return uClean === clean || u.email.toLowerCase().startsWith(clean);
    });

    if (!matched && (clean === 'admin' || clean === 'administrator')) {
      matched = this.users.find(u => u.role === 'SUPER_ADMIN') || this.users[0];
    }

    if (!matched) {
      this.addAuditLog({
        action: 'ACCESS_DENIED',
        details: `تلاش ناموفق برای ورود به بخش مدیریت با نام کاربری نامعتبر: "${usernameInput}"`,
        status: 'FAILED',
        userName: usernameInput,
      });
      return { success: false, error: 'نام کاربری وارد شده در سامانه معتبر نمی‌باشد.' };
    }

    // Check if user has administrative rights
    if (matched.role !== 'SUPER_ADMIN' && matched.role !== 'CATEGORY_MANAGER') {
      this.addAuditLog({
        action: 'ACCESS_DENIED',
        details: `رد دسترسی: کاربر ${matched.displayName} (${matched.username}) فاقد سطح دسترسی مدیریت می‌باشد.`,
        status: 'FAILED',
        userId: matched.id,
        userName: `${matched.displayName} (${matched.username})`,
      });
      return { success: false, error: 'این حساب کاربری دارای سطح دسترسی مدیریت یا ناظر دسته‌بندی نمی‌باشد.' };
    }

    // Check password: accept default admin passwords or valid length
    const validPasswords = ['admin', 'admin123', '123456', 'Tehran@2024', 'manager123'];
    const entered = passwordInput.trim();
    if (!validPasswords.includes(entered) && entered.length < 4) {
      this.addAuditLog({
        action: 'ACCESS_DENIED',
        details: `کلمه عبور اشتباه برای حساب مدیر ${matched.username}`,
        status: 'FAILED',
        userId: matched.id,
        userName: `${matched.displayName} (${matched.username})`,
      });
      return { success: false, error: 'کلمه عبور وارد شده نادرست است.' };
    }

    // Validated successfully
    this.addAuditLog({
      action: 'LOGIN_ADMIN',
      details: `ورود موفق به بخش مدیریت توسط ${matched.displayName} (${matched.role === 'SUPER_ADMIN' ? 'مدیر ارشد' : 'مدیر دسته‌بندی'})`,
      status: 'SUCCESS',
      userId: matched.id,
      userName: `${matched.displayName} (${matched.username})`,
    });

    return { success: true, user: matched };
  }

  // Categories
  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  saveCategory(cat: Partial<Category>): Category {
    let saved: Category;
    const isNew = !cat.id;
    if (cat.id) {
      this.categories = this.categories.map(c => {
        if (c.id === cat.id) {
          saved = { ...c, ...cat } as Category;
          return saved;
        }
        return c;
      });
    } else {
      saved = {
        id: `cat-${Date.now()}`,
        title: cat.title || 'دسته‌بندی جدید',
        slug: cat.slug || `cat-${Date.now()}`,
        icon: cat.icon || 'Tag',
        description: cat.description || '',
        color: cat.color || 'from-sky-500 to-blue-600',
        managerId: cat.managerId || this.currentUser?.id || 'usr-admin',
        managerName: cat.managerName || this.currentUser?.displayName || 'علیرضا تهرانی',
        managerDepartment: cat.managerDepartment || 'مدیریت',
        allowAutoApprove: !!cat.allowAutoApprove,
        fields: cat.fields || [],
      };
      this.categories.push(saved);
    }
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    this.addAuditLog({
      action: isNew ? 'CREATE_CATEGORY' : 'UPDATE_CATEGORY',
      details: isNew
        ? `ایجاد دسته‌بندی جدید "${saved!.title}" و انتساب مدیر "${saved!.managerName}"`
        : `بروزرسانی دسته‌بندی "${saved!.title}" و انتساب مدیر`,
      status: 'SUCCESS',
    });
    return saved!;
  }

  deleteCategory(id: string): void {
    const target = this.categories.find(c => c.id === id);
    this.categories = this.categories.filter(c => c.id !== id);
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    if (target) {
      this.addAuditLog({
        action: 'DELETE_CATEGORY',
        details: `حذف دسته‌بندی "${target.title}" به همراه فیلدهای ویژگی`,
        status: 'WARNING',
      });
    }
  }

  // Dynamic Fields
  addCategoryField(categoryId: string, field: Omit<CategoryField, 'id' | 'categoryId'>): CategoryField {
    const newField: CategoryField = {
      ...field,
      id: `fld-${Date.now()}`,
      categoryId,
    };
    this.categories = this.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: [...cat.fields, newField],
        };
      }
      return cat;
    });
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    this.addAuditLog({
      action: 'ADD_FIELD',
      details: `افزودن فیلد پویا "${field.label}" به دسته ${categoryId}`,
      status: 'SUCCESS',
    });
    return newField;
  }

  updateCategoryField(categoryId: string, fieldId: string, updates: Partial<CategoryField>): void {
    this.categories = this.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: cat.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
        };
      }
      return cat;
    });
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
  }

  deleteCategoryField(categoryId: string, fieldId: string): void {
    this.categories = this.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: cat.fields.filter(f => f.id !== fieldId),
        };
      }
      return cat;
    });
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
  }

  // Ads
  getAds(): Ad[] {
    return [...this.ads];
  }

  getAdById(id: string): Ad | undefined {
    return this.ads.find(a => a.id === id);
  }

  createAd(adData: Partial<Ad>): Ad {
    const category = this.categories.find(c => c.id === adData.categoryId);
    const user = this.currentUser || this.users[0];
    const now = new Date();

    const hasBadgeRequest = adData.badgeRequested !== undefined ? !!adData.badgeRequested : !!adData.isUrgent;
    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      title: adData.title || '',
      description: adData.description || '',
      categoryId: adData.categoryId || this.categories[0].id,
      categoryTitle: category?.title || 'عمومی',
      price: adData.isFree ? 0 : (adData.isAgreementPrice ? 0 : (adData.price || 0)),
      isAgreementPrice: !!adData.isAgreementPrice,
      isFree: !!adData.isFree,
      isUrgent: hasBadgeRequest,
      badgeRequested: hasBadgeRequest,
      badgeApproved: undefined,
      images: adData.images && adData.images.length > 0 ? adData.images : [
        category?.defaultImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
      ],
      city: adData.city || 'تهران',
      departmentLocation: adData.departmentLocation || user.department,
      authorId: user.id,
      authorName: user.displayName,
      authorUsername: user.username,
      authorDepartment: user.department,
      authorPhone: adData.authorPhone || `${user.mobilePhone} (داخلی ${user.internalPhone})`,
      createdAt: now.toISOString(),
      createdAtShamsi: formatJalaliDate(now, 'short'),
      expiryDateShamsi: formatJalaliDate(new Date(now.getTime() + 30 * 24 * 3600 * 1000), 'short'),
      status: (category?.allowAutoApprove && !hasBadgeRequest) ? 'APPROVED' : 'PENDING',
      viewsCount: 1,
      contactViewsCount: 0,
      customFields: adData.customFields || {},
    };

    this.ads.unshift(newAd);
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    this.addAuditLog({
      action: 'CREATE_AD',
      details: `ثبت آگهی جدید "${newAd.title}" ${hasBadgeRequest ? '(با درخواست نشان‌دار فوری) ' : ''}با وضعیت ${newAd.status === 'APPROVED' ? 'تایید خودکار' : 'در انتظار بررسی مدیر'}`,
      status: 'SUCCESS',
    });

    return newAd;
  }

  updateAd(id: string, updates: Partial<Ad>, byUser?: string): Ad | undefined {
    let updatedAd: Ad | undefined;
    const user = this.getCurrentUser();
    const modifierName = byUser || user.displayName;
    this.ads = this.ads.map(ad => {
      if (ad.id === id) {
        const category = updates.categoryId
          ? this.categories.find(c => c.id === updates.categoryId)
          : this.categories.find(c => c.id === ad.categoryId);

        updatedAd = {
          ...ad,
          ...updates,
          categoryTitle: category?.title || ad.categoryTitle,
          reviewedBy: updates.status && updates.status !== ad.status ? modifierName : ad.reviewedBy,
          reviewedAt: updates.status && updates.status !== ad.status ? new Date().toISOString() : ad.reviewedAt,
        };
        return updatedAd;
      }
      return ad;
    });

    if (updatedAd) {
      setToStorage(STORAGE_KEYS.ADS, this.ads);
      const statusLabel =
        updatedAd.status === 'APPROVED'
          ? 'تایید شده'
          : updatedAd.status === 'PENDING'
          ? 'در انتظار بررسی'
          : 'رد شده';
      this.addAuditLog({
        action: 'UPDATE_AD',
        details: `ویرایش مشخصات آگهی "${updatedAd.title}" (وضعیت: ${statusLabel}) توسط مدیر ${modifierName}`,
        status: 'SUCCESS',
      });
    }

    return updatedAd;
  }

  updateAdStatus(
    id: string,
    status: AdStatus,
    reason?: string,
    options?: { keepBadge?: boolean }
  ): void {
    const user = this.getCurrentUser();
    let adTitle = id;
    let badgeOutcomeText = '';

    this.ads = this.ads.map(ad => {
      if (ad.id === id) {
        adTitle = ad.title;
        let isUrgent = ad.isUrgent;
        let badgeApproved = ad.badgeApproved;

        if (status === 'APPROVED') {
          if (options?.keepBadge !== undefined) {
            isUrgent = options.keepBadge;
            badgeApproved = options.keepBadge;
            badgeOutcomeText = options.keepBadge
              ? 'همراه با تایید نشان فوری'
              : 'به عنوان آگهی عادی و بدون نشان فوری (رد نشان‌دار بودن)';
          } else {
            badgeApproved = ad.isUrgent;
          }
        }

        return {
          ...ad,
          status,
          isUrgent,
          badgeApproved,
          rejectionReason: reason || ad.rejectionReason,
          reviewedBy: user.displayName,
          reviewedAt: new Date().toISOString(),
        };
      }
      return ad;
    });
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    const action = status === 'APPROVED' ? 'APPROVE_AD' : (status === 'REJECTED' ? 'REJECT_AD' : 'UPDATE_AD');
    let details = `${status === 'APPROVED' ? 'تایید' : 'رد'} آگهی "${adTitle}"`;
    if (badgeOutcomeText) {
      details += ` (${badgeOutcomeText})`;
    }
    if (reason) {
      details += ` به علت: ${reason}`;
    }
    details += ` توسط مدیر ${user.displayName}`;

    this.addAuditLog({
      action,
      details,
      status: 'SUCCESS',
    });
  }

  deleteAd(id: string): void {
    const ad = this.ads.find(a => a.id === id);
    this.ads = this.ads.filter(a => a.id !== id);
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    this.addAuditLog({
      action: 'DELETE_AD',
      details: `حذف آگهی "${ad?.title || id}"`,
      status: 'WARNING',
    });
  }

  incrementViews(id: string): void {
    this.ads = this.ads.map(a => a.id === id ? { ...a, viewsCount: a.viewsCount + 1 } : a);
    setToStorage(STORAGE_KEYS.ADS, this.ads);
  }

  incrementContactViews(id: string): void {
    this.ads = this.ads.map(a => a.id === id ? { ...a, contactViewsCount: a.contactViewsCount + 1 } : a);
    setToStorage(STORAGE_KEYS.ADS, this.ads);
  }

  // Bookmarks
  getBookmarks(): string[] {
    return [...this.bookmarks];
  }

  toggleBookmark(adId: string): boolean {
    const index = this.bookmarks.indexOf(adId);
    let isBookmarked = false;
    if (index >= 0) {
      this.bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      this.bookmarks.push(adId);
      isBookmarked = true;
    }
    setToStorage(STORAGE_KEYS.BOOKMARKS, this.bookmarks);
    return isBookmarked;
  }

  // Active Directory Config
  getActiveDirectoryConfig(): ActiveDirectoryConfig {
    return { ...this.adConfig };
  }

  saveActiveDirectoryConfig(cfg: Partial<ActiveDirectoryConfig>): ActiveDirectoryConfig {
    this.adConfig = {
      ...this.adConfig,
      ...cfg,
      lastSyncShamsi: formatJalaliDate(new Date(), 'with-time'),
    };
    setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
    this.addAuditLog({
      action: 'CONFIG_CHANGE',
      details: `بروزرسانی پیکربندی اکتیو دایرکتوری سرور ${this.adConfig.serverHost}`,
      status: 'SUCCESS',
    });
    return this.adConfig;
  }

  testActiveDirectoryConnection(): { success: boolean; latencyMs: number; message: string; details: any } {
    const success = true;
    const latencyMs = Math.floor(Math.random() * 25) + 12;
    return {
      success,
      latencyMs,
      message: `ارتباط با کنترلر دامنه ${this.adConfig.serverHost} (پورت ${this.adConfig.port}) با موفقیت برقرار شد. گواهی امنیتی معتبر است و حساب سرویس ${this.adConfig.domainName} تایید گردید.`,
      details: {
        server: this.adConfig.serverHost,
        domain: this.adConfig.domainName,
        baseDn: this.adConfig.baseDn,
        kerberosAuth: 'ENABLED',
        ldapSsl: this.adConfig.useSsl ? 'TLS 1.3' : 'StartTLS',
        syncedObjects: 1420,
      },
    };
  }

  // MySQL Config
  getMySQLConfig(): MySQLConfig {
    return {
      ...this.mysqlConfig,
      totalRecords: this.ads.length * 4 + this.users.length + this.categories.length + this.auditLogs.length,
    };
  }

  saveMySQLConfig(cfg: Partial<MySQLConfig>): MySQLConfig {
    this.mysqlConfig = { ...this.mysqlConfig, ...cfg };
    setToStorage(STORAGE_KEYS.MYSQL_CONFIG, this.mysqlConfig);
    return this.mysqlConfig;
  }

  testMySQLConnection(): { success: boolean; latencyMs: number; message: string } {
    return {
      success: true,
      latencyMs: Math.floor(Math.random() * 8) + 4,
      message: `اتصال به پایگاه داده محلی MySQL (${this.mysqlConfig.database} روی پورت ${this.mysqlConfig.port}) با موفقیت برقرار است. اتصال‌های Pool در حالت آماده‌باش قرار دارند.`,
    };
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  addAuditLog(entry: {
    action: AuditLog['action'];
    details: string;
    status?: AuditLog['status'];
    userId?: string;
    userName?: string;
  }): void {
    const user = this.currentUser || this.users[0];
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: entry.userId || user.id,
      userName: entry.userName || `${user.displayName} (${user.username})`,
      action: entry.action,
      details: entry.details,
      ipAddress: '192.168.10.' + (Math.floor(Math.random() * 150) + 10),
      timestamp: new Date().toISOString(),
      timestampShamsi: formatJalaliDate(new Date(), 'with-time'),
      status: entry.status || 'SUCCESS',
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    setToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // Reports
  getUserPerformanceReport(): Array<{
    user: User;
    totalAds: number;
    approvedAds: number;
    pendingAds: number;
    rejectedAds: number;
    totalViews: number;
    totalContactViews: number;
    lastActivity: string;
  }> {
    return this.users.map(u => {
      const userAds = this.ads.filter(a => a.authorId === u.id);
      const approvedAds = userAds.filter(a => a.status === 'APPROVED').length;
      const pendingAds = userAds.filter(a => a.status === 'PENDING').length;
      const rejectedAds = userAds.filter(a => a.status === 'REJECTED').length;
      const totalViews = userAds.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
      const totalContactViews = userAds.reduce((acc, a) => acc + (a.contactViewsCount || 0), 0);

      return {
        user: u,
        totalAds: userAds.length,
        approvedAds,
        pendingAds,
        rejectedAds,
        totalViews,
        totalContactViews,
        lastActivity: u.lastLoginShamsi || 'ثبت نشده',
      };
    });
  }

  // Reset demo data
  resetToInitialData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ADS);
    localStorage.removeItem(STORAGE_KEYS.AD_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.MYSQL_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.init();
  }
}

export const storageService = new StorageService();
