export type UserRole = 'SUPER_ADMIN' | 'CATEGORY_MANAGER' | 'USER';

export interface User {
  id: string;
  username: string; // e.g. "m.ahmadi" or "CORP\\m.ahmadi"
  displayName: string; // e.g. "محمد احمدی"
  email: string;
  department: string; // e.g. "فناوری اطلاعات و ارتباطات"
  internalPhone: string; // e.g. "۴۳۲۱"
  mobilePhone: string; // e.g. "۰۹۱۲۳۴۵۶۷۸۹"
  role: UserRole;
  managedCategoryIds?: string[]; // IDs of categories this manager oversees
  adGroups: string[]; // Active Directory security groups e.g. ["Domain Users", "IT_Admins"]
  avatar?: string;
  lastLoginShamsi?: string;
  adsCount?: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'date' | 'price';

export interface CategoryField {
  id: string;
  categoryId: string;
  name: string; // Machine key e.g. "mileage", "rooms"
  label: string; // Persian label e.g. "کارکرد (کیلومتر)", "تعداد اتاق"
  type: FieldType;
  options?: string[]; // For 'select' type e.g. ["بنزین", "دوگانه‌سوز", "برقی"]
  required: boolean;
  unit?: string; // e.g. "کیلومتر", "متر مربع", "تومان", "سال"
  placeholder?: string;
  showInCard?: boolean; // Highlight in feed card
  order: number;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Tailwind color class or hex
  managerId: string; // Assigned Category Manager user ID
  managerName: string;
  managerDepartment: string;
  allowAutoApprove: boolean;
  fields: CategoryField[];
  defaultImage?: string; // Default image URL or Base64 for categories
}

export type AdStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'ARCHIVED';

export interface Ad {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryTitle?: string;
  price: number; // 0 = توافقی
  isAgreementPrice: boolean; // قیمت توافقی
  isFree?: boolean;
  isUrgent: boolean; // فوری
  badgeRequested?: boolean; // آیا کاربر متقاضی نشان‌دار / فوری شدن آگهی بوده است
  badgeApproved?: boolean; // آیا مدیر با نشان‌دار بودن موافقت کرده یا رد کرده (false = آگهی عادی بدون نشان)
  images: string[];
  city: string;
  departmentLocation: string; // محل فیزیکی در سازمان (e.g. ساختمان مرکزی - طبقه ۳)
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorDepartment: string;
  authorPhone: string;
  createdAt: string; // ISO string
  createdAtShamsi: string; // e.g. "۱۴۰۳/۰۲/۱۵"
  expiryDateShamsi: string;
  status: AdStatus;
  rejectionReason?: string;
  reviewedBy?: string; // Manager who reviewed
  reviewedAt?: string;
  viewsCount: number;
  contactViewsCount: number;
  customFields: Record<string, string | number | boolean>; // Keyed by field id or name
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action:
    | 'LOGIN_AD'
    | 'LOGIN_ADMIN'
    | 'ACCESS_DENIED'
    | 'LOGOUT'
    | 'CREATE_AD'
    | 'UPDATE_AD'
    | 'APPROVE_AD'
    | 'REJECT_AD'
    | 'DELETE_AD'
    | 'CREATE_CATEGORY'
    | 'UPDATE_CATEGORY'
    | 'DELETE_CATEGORY'
    | 'ADD_FIELD'
    | 'CONFIG_CHANGE';
  details: string;
  ipAddress: string;
  timestamp: string;
  timestampShamsi: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface ActiveDirectoryConfig {
  serverHost: string; // e.g. "ad.company.local" or "192.168.10.20"
  port: number; // 389 or 636
  useSsl: boolean;
  baseDn: string; // e.g. "DC=company,DC=local"
  domainName: string; // e.g. "CORP"
  bindUserDn: string; // e.g. "CN=ldap_bind,OU=ServiceAccounts,DC=company,DC=local"
  bindPasswordMasked: string;
  userFilter: string; // e.g. "(&(objectCategory=person)(objectClass=user)(sAMAccountName={username}))"
  groupAdminDn: string; // e.g. "CN=IT_Admins,OU=SecurityGroups,DC=company,DC=local"
  groupManagerDn: string; // e.g. "CN=Category_Managers,OU=SecurityGroups,DC=company,DC=local"
  autoCreateUser: boolean;
  syncIntervalMinutes: number;
  isConnected: boolean;
  lastSyncShamsi: string;
}

export interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  passwordMasked: string;
  charset: string;
  connectionLimit: number;
  status: 'CONNECTED' | 'DISCONNECTED';
  tableCount: number;
  totalRecords: number;
  lastBackupShamsi: string;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  city: string;
  departmentLocation: string;
  minPrice?: number;
  maxPrice?: number;
  onlyFree: boolean;
  onlyUrgent: boolean;
  onlyWithImages: boolean;
  sortBy: 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'VIEWS';
  customFieldFilters: Record<string, any>;
}
