import { User, Category, CategoryField, Ad, AdStatus, ActiveDirectoryConfig, MySQLConfig, AuditLog, AdPostingPolicy, UserQuotaStatus } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_ADS, INITIAL_AD_CONFIG, INITIAL_MYSQL_CONFIG, INITIAL_AUDIT_LOGS, INITIAL_AD_POSTING_POLICY } from '../data/initialData';
import { MALE_FACELESS_AVATARS, DEFAULT_MALE_AVATAR } from '../data/defaultAvatars';
import { OFFLINE_IMG_DEFAULT } from '../data/offlineImages';
import { formatJalaliDate, getJalaliMonthYear, toPersianDigits } from '../utils/jalali';

const STORAGE_KEYS = {
  USERS: 'divar_users_v1',
  CATEGORIES: 'divar_categories_v1',
  ADS: 'divar_ads_v1',
  CURRENT_USER: 'divar_current_user_v1',
  AD_CONFIG: 'divar_ad_config_v1',
  MYSQL_CONFIG: 'divar_mysql_config_v1',
  AUDIT_LOGS: 'divar_audit_logs_v1',
  BOOKMARKS: 'divar_bookmarks_v1',
  AD_POLICY: 'divar_ad_policy_v1',
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
  private adPolicy: AdPostingPolicy = INITIAL_AD_POSTING_POLICY;

  constructor() {
    this.init();
  }

  private init() {
    this.users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Purge any legacy demo accounts
    const DEMO_USER_KEYS = [
      'usr-admin', 'usr-sara', 'usr-ali', 'usr-maryam', 'usr-reza',
      'admin.system', 'sara.khodro', 'ali.amlak', 'maryam.hesabdari', 'reza.karimi', 'admin'
    ];
    const DEMO_USER_IDS = DEMO_USER_KEYS;
    this.users = this.users.filter(u => {
      const cleanU = (u.username || '').toLowerCase().replace(/^(corp\\|corp\/)/i, '');
      return !DEMO_USER_KEYS.includes(u.id) && !DEMO_USER_KEYS.includes(cleanU) && !u.id.startsWith('usr-ad-admin.system');
    });
    setToStorage(STORAGE_KEYS.USERS, this.users);

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
    const DEMO_AD_IDS = ['ad-101', 'ad-102', 'ad-103', 'ad-104', 'ad-105', 'ad-106', 'ad-107', 'ad-108'];
    this.ads = this.ads.filter(a => !DEMO_AD_IDS.includes(a.id) && !DEMO_USER_IDS.includes(a.authorId));
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    this.adConfig = getFromStorage<ActiveDirectoryConfig>(STORAGE_KEYS.AD_CONFIG, INITIAL_AD_CONFIG);
    // Never falsely claim AD is connected without live validation
    this.adConfig.isConnected = false;
    if (typeof window !== 'undefined') {
      fetch('/api/ad/status')
        .then(res => res.json())
        .then(status => {
          this.adConfig.isConnected = Boolean(status.connected);
        })
        .catch(() => {
          this.adConfig.isConnected = false;
        });
    }
    this.mysqlConfig = getFromStorage<MySQLConfig>(STORAGE_KEYS.MYSQL_CONFIG, INITIAL_MYSQL_CONFIG);
    this.adPolicy = getFromStorage<AdPostingPolicy>(STORAGE_KEYS.AD_POLICY, INITIAL_AD_POSTING_POLICY);
    if (this.mysqlConfig && this.mysqlConfig.host) {
      this.mysqlConfig.host = this.mysqlConfig.host.replace(/\s*\(.*?\)/g, '').trim() || '127.0.0.1';
    }
    // Sync with backend .env config if available
    if (typeof window !== 'undefined') {
      fetch('/api/mysql/config')
        .then(res => res.json())
        .then(cfg => {
          if (cfg && cfg.host) {
            this.mysqlConfig = {
              ...this.mysqlConfig,
              host: cfg.host.replace(/\s*\(.*?\)/g, '').trim() || '127.0.0.1',
              port: cfg.port || 3306,
              database: cfg.database || 'divar_org',
              user: cfg.user || 'divar_user',
            };
            setToStorage(STORAGE_KEYS.MYSQL_CONFIG, this.mysqlConfig);
          }
        })
        .catch(() => {});
    }
    this.auditLogs = getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.auditLogs = this.auditLogs.filter(l => !DEMO_USER_IDS.includes(l.userId || ''));
    setToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

    this.bookmarks = getFromStorage<string[]>(STORAGE_KEYS.BOOKMARKS, []);
    this.bookmarks = this.bookmarks.filter(b => !DEMO_AD_IDS.includes(b));
    setToStorage(STORAGE_KEYS.BOOKMARKS, this.bookmarks);

    // Initial state has no user logged in until real authentication
    this.currentUser = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (this.currentUser && DEMO_USER_IDS.includes(this.currentUser.id)) {
      this.currentUser = null;
      setToStorage(STORAGE_KEYS.CURRENT_USER, null);
    }
  }

  // Users
  getUsers(): User[] {
    return [...this.users];
  }

  getCurrentUser(): User | null {
    return this.currentUser;
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

  logout(): void {
    const prev = this.currentUser;
    this.currentUser = null;
    setToStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (prev) {
      this.addAuditLog({
        action: 'LOGOUT',
        details: `خروج کاربر ${prev.displayName} (${prev.username}) از سامانه`,
        status: 'SUCCESS',
        userId: prev.id,
        userName: `${prev.displayName} (${prev.username})`,
      });
    }
  }

  updateUser(userId: string, updates: Partial<User>, performedBy?: User): User | undefined {
    let updatedUser: User | undefined;
    this.users = this.users.map(u => {
      if (u.id === userId) {
        updatedUser = {
          ...u,
          ...updates,
        };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      setToStorage(STORAGE_KEYS.USERS, this.users);

      // If updating current active user session
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = updatedUser;
        setToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
      }

      // Update author information on any existing ads posted by this user
      let adsChanged = false;
      this.ads = this.ads.map(ad => {
        if (ad.authorId === userId) {
          adsChanged = true;
          return {
            ...ad,
            authorName: updatedUser!.displayName,
            authorDepartment: updatedUser!.department || '',
            authorPhone: updatedUser!.mobilePhone
              ? `${updatedUser!.mobilePhone} (داخلی ${updatedUser!.internalPhone || ''})`
              : ad.authorPhone,
          };
        }
        return ad;
      });

      if (adsChanged) {
        setToStorage(STORAGE_KEYS.ADS, this.ads);
      }

      this.addAuditLog({
        action: 'UPDATE_USER',
        details: `ویرایش مشخصات پروفایل کاربر "${updatedUser.displayName} (${updatedUser.username})"${
          performedBy && performedBy.id !== userId ? ` توسط مدیر ${performedBy.displayName}` : ' توسط خود کاربر'
        }`,
        status: 'SUCCESS',
        userId: updatedUser.id,
        userName: `${updatedUser.displayName} (${updatedUser.username})`,
      });
    }

    return updatedUser;
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

    // Match user by username or email
    let matched = this.users.find(u => {
      const uClean = u.username.toLowerCase().replace(/^(corp\\|corp\/)/i, '');
      return uClean === clean || (u.email ? u.email.toLowerCase().startsWith(clean) : false);
    });

    // If no users exist yet in database (fresh real deployment), allow bootstrapping the initial Super Admin
    if (!matched && this.users.length === 0) {
      const enteredPass = passwordInput.trim();
      if (!enteredPass || enteredPass.length < 4) {
        return { success: false, error: 'برای راه‌اندازی اولیه، کلمه عبور باید حداقل ۴ کاراکتر باشد.' };
      }
      const initialAdmin: User = {
        id: `usr-admin-${Date.now().toString(36)}`,
        username: clean.includes('\\') ? clean : `CORP\\${clean}`,
        displayName: clean,
        role: 'SUPER_ADMIN',
        adGroups: ['Domain Admins', 'Enterprise Admins'],
        internalPhone: '',
        mobilePhone: '',
        status: 'ACTIVE',
        lastLoginShamsi: formatJalaliDate(new Date(), 'with-time'),
      };
      this.users.push(initialAdmin);
      setToStorage(STORAGE_KEYS.USERS, this.users);
      this.setCurrentUser(initialAdmin);
      return { success: true, user: initialAdmin };
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

    // Verify password length and credentials
    const entered = passwordInput.trim();
    if (!entered || entered.length < 4) {
      this.addAuditLog({
        action: 'ACCESS_DENIED',
        details: `کلمه عبور نامعتبر برای حساب مدیر ${matched.username}`,
        status: 'FAILED',
        userId: matched.id,
        userName: `${matched.displayName} (${matched.username})`,
      });
      return { success: false, error: 'کلمه عبور وارد شده نامعتبر است (حداقل ۴ کاراکتر).' };
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
    const existingIndex = cat.id ? this.categories.findIndex(c => c.id === cat.id) : -1;
    const isNew = existingIndex === -1;

    if (!isNew) {
      saved = {
        ...this.categories[existingIndex],
        ...cat,
        fields: cat.fields || this.categories[existingIndex].fields || [],
      } as Category;
      this.categories[existingIndex] = saved;
    } else {
      saved = {
        id: cat.id || `cat-${Date.now()}`,
        title: cat.title || 'دسته‌بندی جدید',
        slug: cat.slug || `cat-${Date.now()}`,
        icon: cat.icon || 'Tag',
        description: cat.description || '',
        color: cat.color || 'from-sky-500 to-blue-600',
        managerId: cat.managerId || this.currentUser?.id || '',
        managerName: cat.managerName || this.currentUser?.displayName || 'تعیین نشده',
        managerDepartment: cat.managerDepartment || this.currentUser?.department || '',
        allowAutoApprove: !!cat.allowAutoApprove,
        fields: cat.fields || [],
        defaultImage: cat.defaultImage,
      };
      this.categories.push(saved);
    }
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    this.addAuditLog({
      action: isNew ? 'CREATE_CATEGORY' : 'UPDATE_CATEGORY',
      details: isNew
        ? `ایجاد دسته‌بندی جدید "${saved.title}" و انتساب مدیر "${saved.managerName}"`
        : `بروزرسانی دسته‌بندی "${saved.title}" و انتساب مدیر`,
      status: 'SUCCESS',
    });

    // Sync to MySQL backend
    if (typeof window !== 'undefined') {
      fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved),
      }).catch(() => {});
    }

    return saved;
  }

  deleteCategory(id: string): void {
    const target = this.categories.find(c => c.id === id);
    this.categories = this.categories.filter(c => c.id !== id);
    setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);

    // Sync to MySQL backend
    if (typeof window !== 'undefined') {
      fetch(`/api/categories/${id}`, { method: 'DELETE' }).catch(() => {});
    }

    // If there are ads in this category, reassign them to the first available category
    if (this.categories.length > 0) {
      const fallbackCat = this.categories[0];
      let adsChanged = false;
      this.ads = this.ads.map(ad => {
        if (ad.categoryId === id) {
          adsChanged = true;
          return {
            ...ad,
            categoryId: fallbackCat.id,
            categoryTitle: fallbackCat.title,
            categoryName: fallbackCat.title,
          };
        }
        return ad;
      });
      if (adsChanged) {
        setToStorage(STORAGE_KEYS.ADS, this.ads);
      }
    } else {
      // No remaining categories - fallback to empty category title
      let adsChanged = false;
      this.ads = this.ads.map(ad => {
        if (ad.categoryId === id) {
          adsChanged = true;
          return {
            ...ad,
            categoryId: '',
            categoryTitle: 'عمومی',
            categoryName: 'عمومی',
          };
        }
        return ad;
      });
      if (adsChanged) {
        setToStorage(STORAGE_KEYS.ADS, this.ads);
      }
    }

    if (target) {
      this.addAuditLog({
        action: 'DELETE_CATEGORY',
        details: `حذف دسته‌بندی "${target?.title || id}" به همراه فیلدهای ویژگی`,
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

    // Policy & Quota Enforcement Check
    const quotaStatus = this.getUserQuotaStatus(user.id);
    if (quotaStatus.isBlocked) {
      this.addAuditLog({
        action: 'CREATE_AD',
        details: `تلاش ناموفق برای درج آگهی "${adData.title || 'بدون عنوان'}" به علت نقض سهمیه یا سیاست: ${quotaStatus.blockReason}`,
        status: 'FAILED',
        userId: user.id,
        userName: `${user.displayName} (${user.username})`,
      });
      throw new Error(quotaStatus.blockReason || 'شما در حال حاضر مجاز به درج آگهی نمی‌باشید.');
    }

    if (this.adPolicy.enabled && !quotaStatus.isBypassed) {
      const titleLen = (adData.title || '').trim().length;
      if (titleLen < this.adPolicy.minTitleLength) {
        throw new Error(`طول عنوان آگهی نمی‌تواند کمتر از ${toPersianDigits(this.adPolicy.minTitleLength)} کاراکتر باشد.`);
      }
      if (titleLen > this.adPolicy.maxTitleLength) {
        throw new Error(`طول عنوان آگهی نمی‌تواند بیشتر از ${toPersianDigits(this.adPolicy.maxTitleLength)} کاراکتر باشد.`);
      }
    }

    let hasBadgeRequest = adData.badgeRequested !== undefined ? !!adData.badgeRequested : !!adData.isUrgent;
    if (hasBadgeRequest && !quotaStatus.canRequestUrgent && !quotaStatus.isBypassed) {
      hasBadgeRequest = false;
    }

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      title: adData.title || '',
      description: adData.description || '',
      categoryId: adData.categoryId || this.categories[0]?.id || '',
      categoryTitle: category?.title || 'عمومی',
      price: adData.isFree ? 0 : (adData.isAgreementPrice ? 0 : (adData.price || 0)),
      isAgreementPrice: !!adData.isAgreementPrice,
      isFree: !!adData.isFree,
      isUrgent: hasBadgeRequest,
      badgeRequested: hasBadgeRequest,
      badgeApproved: undefined,
      images: adData.images && adData.images.length > 0 ? adData.images : [
        category?.defaultImage || OFFLINE_IMG_DEFAULT
      ],
      city: adData.city || 'تهران',
      departmentLocation: adData.departmentLocation || user.department || 'ساختمان مرکزی',
      authorId: user.id,
      authorName: user.displayName,
      authorUsername: user.username,
      authorDepartment: user.department || 'عمومی',
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

    // Sync to MySQL backend
    if (typeof window !== 'undefined') {
      fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd),
      }).catch(() => {});
    }

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
    const modifierName = byUser || user?.displayName || 'کاربر سیستم';
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

      // Sync to MySQL backend
      if (typeof window !== 'undefined') {
        fetch(`/api/ads/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }).catch(() => {});
      }

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
    let updatedPayload: any = {};

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

        updatedPayload = {
          status,
          isUrgent,
          badgeApproved,
          rejectionReason: reason || ad.rejectionReason,
        };

        return {
          ...ad,
          status,
          isUrgent,
          badgeApproved,
          rejectionReason: reason || ad.rejectionReason,
          reviewedBy: user?.displayName || 'مدیر سیستم',
          reviewedAt: new Date().toISOString(),
        };
      }
      return ad;
    });
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    // Sync to MySQL backend
    if (typeof window !== 'undefined') {
      fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      }).catch(() => {});
    }

    const action = status === 'APPROVED' ? 'APPROVE_AD' : (status === 'REJECTED' ? 'REJECT_AD' : 'UPDATE_AD');
    let details = `${status === 'APPROVED' ? 'تایید' : 'رد'} آگهی "${adTitle}"`;
    if (badgeOutcomeText) {
      details += ` (${badgeOutcomeText})`;
    }
    if (reason) {
      details += ` به علت: ${reason}`;
    }
    details += ` توسط مدیر ${user?.displayName || 'سیستم'}`;

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

    // Sync to MySQL backend
    if (typeof window !== 'undefined') {
      fetch(`/api/ads/${id}`, { method: 'DELETE' }).catch(() => {});
    }

    this.addAuditLog({
      action: 'DELETE_AD',
      details: `حذف آگهی "${ad?.title || id}"`,
      status: 'WARNING',
    });
  }

  incrementViews(id: string): void {
    this.ads = this.ads.map(a => a.id === id ? { ...a, viewsCount: a.viewsCount + 1 } : a);
    setToStorage(STORAGE_KEYS.ADS, this.ads);

    const found = this.ads.find(a => a.id === id);
    if (found && typeof window !== 'undefined') {
      fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewsCount: found.viewsCount }),
      }).catch(() => {});
    }
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
      isConnected: false,
      lastSyncShamsi: formatJalaliDate(new Date(), 'with-time'),
    };
    setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);

    if (typeof window !== 'undefined') {
      fetch('/api/ad/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.adConfig),
      }).catch(() => {});
    }

    this.addAuditLog({
      action: 'CONFIG_CHANGE',
      details: `بروزرسانی پیکربندی اکتیو دایرکتوری سرور ${this.adConfig.serverHost}:${this.adConfig.port}`,
      status: 'SUCCESS',
    });
    return this.adConfig;
  }

  async testActiveDirectoryConnection(
    overrideConfig?: Partial<ActiveDirectoryConfig>
  ): Promise<{ success: boolean; latencyMs: number; message: string; details: any }> {
    try {
      const cfg = { ...this.adConfig, ...(overrideConfig || {}) };
      const res = await fetch('/api/ad/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });

      const data = await res.json();
      const isConnected = Boolean(data.connected);

      this.adConfig.isConnected = isConnected;
      if (isConnected) {
        this.adConfig.lastSyncShamsi = formatJalaliDate(new Date(), 'with-time');
      }
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);

      this.addAuditLog({
        action: 'CONFIG_CHANGE',
        details: isConnected
          ? `تست موفقیت‌آمیز ارتباط با کنترلر دامنه ${cfg.serverHost}:${cfg.port}`
          : `تست ناموفق ارتباط با کنترلر دامنه ${cfg.serverHost}:${cfg.port} (${data.message})`,
        status: isConnected ? 'SUCCESS' : 'FAILED',
      });

      return {
        success: isConnected,
        latencyMs: data.latencyMs || 0,
        message: data.message || (isConnected ? 'ارتباط با موفقیت برقرار شد.' : 'عدم برقراری ارتباط با سرور دامین'),
        details: data.details || {},
      };
    } catch (err: any) {
      this.adConfig.isConnected = false;
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
      return {
        success: false,
        latencyMs: 0,
        message: `خطای ارتباطی: ${err.message}`,
        details: {},
      };
    }
  }

  async checkActiveDirectoryStatus(): Promise<{ connected: boolean; message: string; latencyMs: number; host?: string; port?: number }> {
    try {
      const res = await fetch('/api/ad/status');
      if (!res.ok) {
        this.adConfig.isConnected = false;
        setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
        return { connected: false, message: 'سرویس اکتیو دایرکتوری در دسترس نیست', latencyMs: 0 };
      }
      const data = await res.json();
      const connected = Boolean(data.connected);
      this.adConfig.isConnected = connected;
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
      return {
        connected,
        message: connected
          ? `کنترلر دامنه ${data.serverHost}:${data.port} متصل و فعال است`
          : (data.error || 'عدم دسترسی به کنترلر دامنه'),
        latencyMs: data.latencyMs || 0,
        host: data.serverHost,
        port: data.port,
      };
    } catch (e: any) {
      this.adConfig.isConnected = false;
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
      return { connected: false, message: `عدم ارتباط با سرور: ${e.message}`, latencyMs: 0 };
    }
  }

  async loginWithActiveDirectory(
    usernameInput: string,
    passwordInput: string,
    domainInput?: string
  ): Promise<{ success: boolean; user?: User; message: string }> {
    const domainName = (domainInput || this.adConfig.domainName || '').trim().toUpperCase();
    let cleanUser = usernameInput.trim();
    if (cleanUser.includes('\\')) {
      cleanUser = cleanUser.split('\\')[1];
    } else if (cleanUser.includes('@')) {
      cleanUser = cleanUser.split('@')[0];
    }

    try {
      const res = await fetch('/api/ad/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          domain: domainName,
          adConfig: this.adConfig,
        }),
      });

      const data = await res.json();

      // Case 1: Real Active Directory successfully authenticated user
      if (data.success && data.user) {
        this.adConfig.isConnected = true;
        setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);
        const adUser: User = {
          ...data.user,
          avatar: data.user.avatar || DEFAULT_MALE_AVATAR,
          lastLoginShamsi: formatJalaliDate(new Date(), 'with-time'),
          status: 'ACTIVE',
        };

        const existingIdx = this.users.findIndex(
          u => u.username.toLowerCase() === adUser.username.toLowerCase() || u.id === adUser.id
        );

        if (existingIdx >= 0) {
          this.users[existingIdx] = {
            ...this.users[existingIdx],
            ...adUser,
          };
        } else {
          this.users.push(adUser);
        }

        setToStorage(STORAGE_KEYS.USERS, this.users);
        this.setCurrentUser(adUser);

        this.addAuditLog({
          action: 'LOGIN_AD',
          details: `احراز هویت زنده اکتیو دایرکتوری برای کاربر "${adUser.displayName}" (${adUser.username})`,
          status: 'SUCCESS',
          userId: adUser.id,
          userName: `${adUser.displayName} (${adUser.username})`,
        });

        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adUser),
        }).catch(() => {});

        return { success: true, user: adUser, message: data.message };
      }

      // Case 2: Failed authentication or unreachable domain controller
      this.adConfig.isConnected = false;
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);

      this.addAuditLog({
        action: 'ACCESS_DENIED',
        details: `تلاش ناموفق برای ورود به اکتیو دایرکتوری با نام کاربری "${usernameInput}": ${data.message || 'خطا'}`,
        status: 'FAILED',
        userName: usernameInput,
      });

      return {
        success: false,
        message: data.message || 'نام کاربری یا کلمه عبور در اکتیو دایرکتوری نامعتبر است.',
      };
    } catch (err: any) {
      this.adConfig.isConnected = false;
      setToStorage(STORAGE_KEYS.AD_CONFIG, this.adConfig);

      return {
        success: false,
        message: `خطای شبکه در ارتباط با سرور احراز هویت: ${err.message}`,
      };
    }
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

  async testMySQLConnection(overrideConfig?: Partial<MySQLConfig>): Promise<{
    success: boolean;
    connected?: boolean;
    serverReachable?: boolean;
    databaseExists?: boolean;
    latencyMs: number;
    message: string;
    tip?: string;
    code?: string;
    tablesCount?: number;
    tables?: string[];
    missingTables?: string[];
  }> {
    try {
      const cfg = { ...this.mysqlConfig, ...overrideConfig };
      const res = await fetch('/api/mysql/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) {
        throw new Error(`خطای سرور HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        connected: false,
        latencyMs: 0,
        message: `عدم برقراری ارتباط با وب‌سرور یا سرویس بک‌اند (${err.message}).`,
        tip: 'لطفاً اطمینان حاصل کنید که سرویس بک‌اند روی پورت ۳۰۰۰ در حال اجراست (دستور npm run dev یا node server.ts روی سرور).',
      };
    }
  }

  async initMySQLSchema(overrideConfig?: Partial<MySQLConfig>): Promise<{ success: boolean; message: string }> {
    try {
      const cfg = { ...this.mysqlConfig, ...overrideConfig };
      const res = await fetch('/api/mysql/init-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: `خطا در ایجاد جداول: ${err.message}`,
      };
    }
  }

  async syncWithMySQL(): Promise<{ success: boolean; message: string; adsCount: number; categoriesCount: number; wasEmpty?: boolean }> {
    try {
      const res = await fetch('/api/mysql/data');
      if (!res.ok) {
        throw new Error(`خطای سرور HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'خطا در دریافت داده‌ها');
      }

      const mysqlAds = data.ads || [];
      const mysqlCats = data.categories || [];
      const mysqlUsers = data.users || [];
      const mysqlLogs = data.auditLogs || [];

      // If MySQL has records, populate local state with database truth
      if (mysqlCats.length > 0 || mysqlAds.length > 0) {
        this.categories = mysqlCats;
        setToStorage(STORAGE_KEYS.CATEGORIES, this.categories);

        this.ads = mysqlAds.map((a: any) => {
          const createdDate = a.createdAt ? new Date(a.createdAt) : new Date();
          const expiryDate = new Date(createdDate.getTime() + 30 * 24 * 3600 * 1000);
          return {
            ...a,
            createdAtShamsi: a.createdAtShamsi || formatJalaliDate(createdDate, 'short'),
            expiryDateShamsi: a.expiryDateShamsi || formatJalaliDate(expiryDate, 'short'),
          };
        });
        setToStorage(STORAGE_KEYS.ADS, this.ads);

        if (mysqlUsers.length > 0) {
          this.users = mysqlUsers;
          setToStorage(STORAGE_KEYS.USERS, this.users);
        }

        if (mysqlLogs.length > 0) {
          this.auditLogs = mysqlLogs.map((l: any) => {
            const logDate = l.timestamp ? new Date(l.timestamp) : new Date();
            return {
              ...l,
              timestampShamsi: l.timestampShamsi || formatJalaliDate(logDate, 'short'),
            };
          });
          setToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
        }

        return {
          success: true,
          message: `اطلاعات با موفقیت از پایگاه داده MySQL فراخوانی شد (${mysqlAds.length} آگهی و ${mysqlCats.length} دسته‌بندی).`,
          adsCount: mysqlAds.length,
          categoriesCount: mysqlCats.length,
          wasEmpty: false,
        };
      } else {
        // Tables exist but are empty
        return {
          success: true,
          message: 'جداول پایگاه داده MySQL خالی هستند. می‌توانید با دکمه زیر داده‌های اولیه را به MySQL منتقل کنید.',
          adsCount: 0,
          categoriesCount: 0,
          wasEmpty: true,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `عدم امکان دریافت داده از MySQL: ${err.message}`,
        adsCount: 0,
        categoriesCount: 0,
      };
    }
  }

  async seedToMySQL(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/mysql/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: this.users,
          categories: this.categories,
          ads: this.ads,
          auditLogs: this.auditLogs,
        }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: `خطا در ارسال داده‌ها به MySQL: ${err.message}`,
      };
    }
  }

  async getMySQLStats(): Promise<{
    success: boolean;
    connected: boolean;
    adsCount: number;
    categoriesCount: number;
    usersCount: number;
    auditLogsCount: number;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/mysql/stats');
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        connected: false,
        adsCount: 0,
        categoriesCount: 0,
        usersCount: 0,
        auditLogsCount: 0,
        message: err.message,
      };
    }
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

  // Ad Posting Policies & Quotas
  getAdPostingPolicy(): AdPostingPolicy {
    return { ...this.adPolicy };
  }

  saveAdPostingPolicy(updates: Partial<AdPostingPolicy>): AdPostingPolicy {
    this.adPolicy = {
      ...this.adPolicy,
      ...updates,
      userCustomQuotas: {
        ...(this.adPolicy.userCustomQuotas || {}),
        ...(updates.userCustomQuotas || {}),
      },
    };
    setToStorage(STORAGE_KEYS.AD_POLICY, this.adPolicy);

    this.addAuditLog({
      action: 'UPDATE_POLICY',
      details: `بروزرسانی قوانین و سهمیه‌های درج آگهی (سقف ماهانه: ${toPersianDigits(this.adPolicy.maxAdsPerSolarMonth)}، سقف همزمان: ${toPersianDigits(this.adPolicy.maxActiveAdsPerUser)}، وضعیت: ${this.adPolicy.enabled ? 'فعال' : 'غیرفعال'})`,
      status: 'SUCCESS',
    });

    return { ...this.adPolicy };
  }

  setUserCustomQuota(userId: string, quota: number | null): void {
    const updatedCustom = { ...(this.adPolicy.userCustomQuotas || {}) };
    if (quota === null || quota <= 0) {
      delete updatedCustom[userId];
    } else {
      updatedCustom[userId] = quota;
    }
    this.adPolicy.userCustomQuotas = updatedCustom;
    setToStorage(STORAGE_KEYS.AD_POLICY, this.adPolicy);

    this.users = this.users.map(u => u.id === userId ? { ...u, customMonthlyQuota: quota && quota > 0 ? quota : undefined } : u);
    setToStorage(STORAGE_KEYS.USERS, this.users);

    const targetUser = this.users.find(u => u.id === userId);
    this.addAuditLog({
      action: 'UPDATE_POLICY',
      details: quota && quota > 0
        ? `تخصیص سهمیه ماهانه اختصاصی ${toPersianDigits(quota)} آگهی به کاربر "${targetUser?.displayName || userId}"`
        : `حذف سهمیه اختصاصی و بازگشت به سقف عمومی برای کاربر "${targetUser?.displayName || userId}"`,
      status: 'SUCCESS',
    });
  }

  getUserQuotaStatus(userId?: string): UserQuotaStatus {
    const user = userId ? this.users.find(u => u.id === userId) || this.currentUser : this.currentUser;
    const now = new Date();
    const currentMonth = getJalaliMonthYear(now);

    const fallbackStatus: UserQuotaStatus = {
      isBlocked: false,
      solarMonthName: currentMonth.label,
      solarMonthKey: currentMonth.key,
      adsUsedThisMonth: 0,
      maxAllowedThisMonth: this.adPolicy.maxAdsPerSolarMonth,
      remainingThisMonth: this.adPolicy.maxAdsPerSolarMonth,
      activeAdsCount: 0,
      maxActiveAllowed: this.adPolicy.maxActiveAdsPerUser,
      remainingActive: this.adPolicy.maxActiveAdsPerUser,
      urgentUsedThisMonth: 0,
      maxUrgentAllowed: this.adPolicy.maxUrgentBadgesPerMonth,
      remainingUrgent: this.adPolicy.maxUrgentBadgesPerMonth,
      canRequestUrgent: true,
      isInCooldown: false,
      isBypassed: false,
      hasCustomQuota: false,
    };

    if (!user) {
      return fallbackStatus;
    }

    const isExemptRole = user.role === 'SUPER_ADMIN' || user.role === 'CATEGORY_MANAGER';
    const isBypassed = this.adPolicy.bypassForAdminsAndManagers && isExemptRole;

    const customQuota = this.adPolicy.userCustomQuotas?.[user.id] ?? user.customMonthlyQuota;
    const maxAllowedThisMonth = customQuota !== undefined ? customQuota : this.adPolicy.maxAdsPerSolarMonth;
    const maxActiveAllowed = this.adPolicy.maxActiveAdsPerUser;
    const maxUrgentAllowed = this.adPolicy.maxUrgentBadgesPerMonth;

    const userAds = this.ads.filter(a => a.authorId === user.id || a.authorUsername === user.username);

    // Ads posted in current Jalali month
    const thisMonthAds = userAds.filter(a => {
      const adMonth = getJalaliMonthYear(a.createdAt);
      return adMonth.key === currentMonth.key;
    });
    const adsUsedThisMonth = thisMonthAds.length;

    // Currently active or pending ads
    const activeAds = userAds.filter(a => a.status === 'APPROVED' || a.status === 'PENDING');
    const activeAdsCount = activeAds.length;

    // Urgent badges used in current month
    const urgentUsedThisMonth = thisMonthAds.filter(a => a.isUrgent || a.badgeRequested || a.badgeApproved).length;

    // Cool-down check
    let isInCooldown = false;
    let cooldownRemainingMinutes = 0;
    if (this.adPolicy.enabled && !isBypassed && this.adPolicy.coolDownHours > 0 && userAds.length > 0) {
      const sortedAds = [...userAds].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const lastAd = sortedAds[0];
      if (lastAd && lastAd.createdAt) {
        const lastTime = new Date(lastAd.createdAt).getTime();
        const diffMs = now.getTime() - lastTime;
        const cooldownMs = this.adPolicy.coolDownHours * 3600 * 1000;
        if (diffMs < cooldownMs) {
          isInCooldown = true;
          cooldownRemainingMinutes = Math.max(1, Math.ceil((cooldownMs - diffMs) / 60000));
        }
      }
    }

    const remainingThisMonth = Math.max(0, maxAllowedThisMonth - adsUsedThisMonth);
    const remainingActive = Math.max(0, maxActiveAllowed - activeAdsCount);
    const remainingUrgent = Math.max(0, maxUrgentAllowed - urgentUsedThisMonth);

    let isBlocked = false;
    let blockReason: string | undefined = undefined;

    if (this.adPolicy.enabled && !isBypassed) {
      if (adsUsedThisMonth >= maxAllowedThisMonth) {
        isBlocked = true;
        blockReason = `سهمیه درج آگهی شما برای ماه شمسی جاری (${currentMonth.label}) تکمیل شده است (${toPersianDigits(adsUsedThisMonth)} از ${toPersianDigits(maxAllowedThisMonth)} آگهی). این سهمیه در روز اول ماه شمسی بعد مجدداً فعال می‌شود.`;
      } else if (activeAdsCount >= maxActiveAllowed) {
        isBlocked = true;
        blockReason = `شما در حال حاضر دارای ${toPersianDigits(activeAdsCount)} آگهی فعال در سامانه می‌باشید که معادل حداکثر سقف مجاز همزمان (${toPersianDigits(maxActiveAllowed)} عدد) است. برای درج آگهی جدید، لطفاً یکی از آگهی‌های پیشین خود را بایگانی یا حذف نمایید.`;
      } else if (isInCooldown) {
        isBlocked = true;
        blockReason = `طبق سیاست سازمان، حداقل فاصله زمانی بین دو ثبت آگهی متوالی ${toPersianDigits(this.adPolicy.coolDownHours)} ساعت می‌باشد. لطفاً ${toPersianDigits(cooldownRemainingMinutes)} دقیقه دیگر مجدداً تلاش نمایید.`;
      }
    }

    return {
      isBlocked,
      blockReason,
      solarMonthName: currentMonth.label,
      solarMonthKey: currentMonth.key,
      adsUsedThisMonth,
      maxAllowedThisMonth,
      remainingThisMonth,
      activeAdsCount,
      maxActiveAllowed,
      remainingActive,
      urgentUsedThisMonth,
      maxUrgentAllowed,
      remainingUrgent,
      canRequestUrgent: isBypassed || remainingUrgent > 0,
      isInCooldown,
      cooldownRemainingMinutes,
      isBypassed,
      hasCustomQuota: customQuota !== undefined,
    };
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
    quotaStatus: UserQuotaStatus;
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
        quotaStatus: this.getUserQuotaStatus(u.id),
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
    localStorage.removeItem(STORAGE_KEYS.AD_POLICY);
    this.init();
  }
}

export const storageService = new StorageService();
