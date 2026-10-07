import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BarChart3,
  Users,
  ShieldCheck,
  Layers,
  Server,
  Database,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  Trash2,
  Edit2,
  UserCog,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Key,
  ShieldAlert,
  HardDrive,
  Copy,
  Check,
  Tag,
  Package,
  Laptop,
  Smartphone,
  Building2,
  Car,
  Briefcase,
  Home,
  Coffee,
  ShoppingBag,
  Wrench,
  Camera,
  Tv,
  Printer,
  Shirt,
  Book,
  Headphones,
  Bike,
  Watch,
  HeartHandshake,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  LogOut,
  Flame,
  AlertTriangle,
  SlidersHorizontal,
  Flag,
  Type,
  UserCheck,
} from 'lucide-react';
import {
  User,
  Category,
  CategoryField,
  Ad,
  ActiveDirectoryConfig,
  MySQLConfig,
  AuditLog,
  FieldType,
  AdPostingPolicy,
  UserQuotaStatus,
  AdReport,
  AdReportReason,
  ReportReasonConfig,
} from '../../types';
import { EditAdModal } from '../EditAdModal';
import { SystemTextsManager } from './SystemTextsManager';
import { toPersianDigits, formatPersianNumber, formatJalaliDate } from '../../utils/jalali';
import { MYSQL_SCHEMA_SQL, NUXT_SERVER_CODE_GUIDE } from '../../data/mysqlSchema';
import { OFFLINE_PRESET_IMAGES, OFFLINE_IMG_DEFAULT } from '../../data/offlineImages';
import { storageService } from '../../services/storageService';

export const CATEGORY_ICON_OPTIONS = [
  { name: 'Package', label: 'لوازم و کالا', icon: Package },
  { name: 'Laptop', label: 'دیجیتال و کامپیوتر', icon: Laptop },
  { name: 'Smartphone', label: 'موبایل و ارتباطات', icon: Smartphone },
  { name: 'Building2', label: 'املاک و ساختمان', icon: Building2 },
  { name: 'Car', label: 'خودرو و نقلیه', icon: Car },
  { name: 'Briefcase', label: 'خدمات و اداری', icon: Briefcase },
  { name: 'Home', label: 'لوازم خانگی', icon: Home },
  { name: 'Coffee', label: 'پذیرایی و رفاهی', icon: Coffee },
  { name: 'ShoppingBag', label: 'خرید و ملزومات', icon: ShoppingBag },
  { name: 'Wrench', label: 'ابزار و فنی', icon: Wrench },
  { name: 'Sparkles', label: 'ویژه و هدایا', icon: Sparkles },
  { name: 'Camera', label: 'عکاسی و مدیا', icon: Camera },
  { name: 'Tv', label: 'صوتی و تصویری', icon: Tv },
  { name: 'Printer', label: 'ماشین‌های اداری', icon: Printer },
  { name: 'Shirt', label: 'پوشاک و ملزومات', icon: Shirt },
  { name: 'Book', label: 'کتاب و آموزش', icon: Book },
  { name: 'Headphones', label: 'صوتی و هندزفری', icon: Headphones },
  { name: 'Bike', label: 'ورزش و دوچرخه', icon: Bike },
  { name: 'Watch', label: 'ساعت و اکسسوری', icon: Watch },
  { name: 'HeartHandshake', label: 'خیریه و اشتراک', icon: HeartHandshake },
  { name: 'Tag', label: 'سایر و عمومی', icon: Tag },
];

export const CATEGORY_COLOR_OPTIONS = [
  { label: 'آبی کبالت', value: 'from-blue-500 to-indigo-600', class: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  { label: 'سبز زمردی', value: 'from-emerald-500 to-teal-600', class: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
  { label: 'نارنجی کهربایی', value: 'from-amber-500 to-orange-600', class: 'bg-gradient-to-r from-amber-500 to-orange-600' },
  { label: 'قرمز زرشکی', value: 'from-rose-500 to-red-600', class: 'bg-gradient-to-r from-rose-500 to-red-600' },
  { label: 'بنفش رویال', value: 'from-purple-500 to-indigo-700', class: 'bg-gradient-to-r from-purple-500 to-indigo-700' },
  { label: 'فیروزه‌ای', value: 'from-cyan-500 to-blue-600', class: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  { label: 'دودی شیک', value: 'from-slate-700 to-slate-900', class: 'bg-gradient-to-r from-slate-700 to-slate-900' },
  { label: 'صورتی گرم', value: 'from-pink-500 to-rose-600', class: 'bg-gradient-to-r from-pink-500 to-rose-600' },
];

export const PRESET_CATEGORY_IMAGES = OFFLINE_PRESET_IMAGES;

interface AdminModalProps {
  currentUser: User | null;
  users: User[];
  categories: Category[];
  ads: Ad[];
  adConfig: ActiveDirectoryConfig;
  mysqlConfig: MySQLConfig;
  auditLogs: AuditLog[];
  userPerformanceReport: Array<{
    user: User;
    totalAds: number;
    approvedAds: number;
    pendingAds: number;
    rejectedAds: number;
    totalViews: number;
    totalContactViews: number;
    lastActivity: string;
    quotaStatus?: UserQuotaStatus;
  }>;
  onClose: () => void;
  onApproveAd: (adId: string, keepBadge?: boolean) => void;
  onRejectAd: (adId: string, reason: string) => void;
  onDeleteAd: (adId: string) => void;
  onSaveCategory: (cat: Partial<Category>) => void;
  onDeleteCategory: (catId: string) => void;
  onAddFieldToCategory: (catId: string, field: Omit<CategoryField, 'id' | 'categoryId'>) => void;
  onDeleteCategoryField: (catId: string, fieldId: string) => void;
  onSaveADConfig: (cfg: Partial<ActiveDirectoryConfig>) => void;
  onSyncADUsers?: () => Promise<{ success: boolean; users?: User[]; message: string; count?: number }>;
  onTestADConnection: (cfg?: Partial<ActiveDirectoryConfig>) => Promise<{ success: boolean; latencyMs: number; message: string; details: any }> | { success: boolean; latencyMs: number; message: string; details: any };
  onTestMySQLConnection: () => Promise<{
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
  }>;
  onInitMySQLSchema?: () => Promise<{ success: boolean; message: string }>;
  onSyncWithMySQL?: () => Promise<{ success: boolean; message: string; adsCount: number; categoriesCount: number; wasEmpty?: boolean }>;
  onSeedToMySQL?: () => Promise<{ success: boolean; message: string }>;
  onGetMySQLStats?: () => Promise<{ success: boolean; adsCount: number; categoriesCount: number; usersCount: number; auditLogsCount: number }>;
  onUpdateAd?: (adId: string, updates: Partial<Ad>) => void;
  onEditUserProfile?: (user: User) => void;
  adPolicy: AdPostingPolicy;
  onSaveAdPolicy: (policy: Partial<AdPostingPolicy>) => void;
  onSetUserCustomQuota: (userId: string, quota: number | null) => void;
  adReports?: AdReport[];
  onResolveAdReport?: (reportId: string, action: 'DISMISS' | 'REMOVE_AD' | 'RESOLVE', adminNote?: string) => void;
  onDeleteAdReport?: (reportId: string) => void;
  reportReasons?: ReportReasonConfig[];
  onSaveReportReason?: (reason: ReportReasonConfig) => void;
  onDeleteReportReason?: (reasonId: string) => void;
  onToggleReportReason?: (reasonId: string, isActive: boolean) => void;
}

type AdminTab =
  | 'ANALYTICS'
  | 'USER_REPORT'
  | 'MODERATION'
  | 'AD_VIOLATION_REPORTS'
  | 'CATEGORIES'
  | 'AD_POLICIES'
  | 'ACTIVE_DIRECTORY'
  | 'MYSQL_LOCAL'
  | 'AUDIT_LOGS'
  | 'SYSTEM_TEXTS';

export const AdminModal: React.FC<AdminModalProps> = ({
  currentUser,
  users,
  categories,
  ads,
  adConfig,
  mysqlConfig,
  auditLogs,
  userPerformanceReport,
  adPolicy,
  adReports = [],
  reportReasons = [],
  onClose,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onSaveCategory,
  onDeleteCategory,
  onAddFieldToCategory,
  onDeleteCategoryField,
  onSaveADConfig,
  onSyncADUsers,
  onTestADConnection,
  onTestMySQLConnection,
  onInitMySQLSchema,
  onSyncWithMySQL,
  onSeedToMySQL,
  onGetMySQLStats,
  onUpdateAd,
  onEditUserProfile,
  onSaveAdPolicy,
  onSetUserCustomQuota,
  onResolveAdReport,
  onDeleteAdReport,
  onSaveReportReason,
  onDeleteReportReason,
  onToggleReportReason,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ANALYTICS');

  // Active Directory Category Manager Picker Modal State
  const [adPickerCategory, setAdPickerCategory] = useState<Category | null>(null);
  const [adPickerMode, setAdPickerMode] = useState<'CATEGORY_CARD' | 'MODAL_FORM' | null>(null);
  const [adPickerSearch, setAdPickerSearch] = useState('');
  const [adPickerDepartmentFilter, setAdPickerDepartmentFilter] = useState('ALL');
  const [adPickerGroupFilter, setAdPickerGroupFilter] = useState<'ALL' | 'MANAGERS' | 'ADMINS' | 'AVAILABLE'>('ALL');
  const [isSyncingAD, setIsSyncingAD] = useState(false);
  const [adSyncNotice, setAdSyncNotice] = useState<string | null>(null);
  const [adTabUserSearch, setAdTabUserSearch] = useState('');
  const [adTabRoleFilter, setAdTabRoleFilter] = useState<'ALL' | 'CATEGORY_MANAGER' | 'SUPER_ADMIN' | 'USER'>('ALL');
  const [adTabQuickAssignNotice, setAdTabQuickAssignNotice] = useState<string | null>(null);

  // Ad editing for administrators
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  // Search & Filter for Reports
  const [reportSearch, setReportSearch] = useState('');
  const [selectedModerationCategory, setSelectedModerationCategory] = useState<string>('ALL');
  const [moderationStatusFilter, setModerationStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [moderationBadgeOnly, setModerationBadgeOnly] = useState(false);

  // New Category Field Builder state
  const [selectedCatForFields, setSelectedCatForFields] = useState<string>(categories[0]?.id || '');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldUnit, setNewFieldUnit] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldShowInCard, setNewFieldShowInCard] = useState(true);
  const [newFieldOptionsStr, setNewFieldOptionsStr] = useState('');

  // Category Manager Assignment modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Category Create & Edit Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [catFormId, setCatFormId] = useState('');
  const [catFormTitle, setCatFormTitle] = useState('');
  const [catFormSlug, setCatFormSlug] = useState('');
  const [catFormDescription, setCatFormDescription] = useState('');
  const [catFormIcon, setCatFormIcon] = useState('Package');
  const [catFormColor, setCatFormColor] = useState('from-indigo-500 to-blue-600');
  const [catFormManagerId, setCatFormManagerId] = useState(users[0]?.id || currentUser?.id || 'usr-admin');
  const [catFormAutoApprove, setCatFormAutoApprove] = useState(false);
  const [catFormDefaultImage, setCatFormDefaultImage] = useState('');

  const handleCatImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setCatFormDefaultImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Connection test results
  const [adTestResult, setAdTestResult] = useState<{ success: boolean; latencyMs: number; message: string; details?: any } | null>(null);
  const [mysqlTestResult, setMysqlTestResult] = useState<{
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
  } | null>(null);
  const [isTestingAD, setIsTestingAD] = useState(false);
  const [isTestingMySQL, setIsTestingMySQL] = useState(false);
  const [isInitializingDb, setIsInitializingDb] = useState(false);
  const [initDbResult, setInitDbResult] = useState<{ success: boolean; message: string } | null>(null);

  // MySQL Sync & Seed States
  const [mysqlStats, setMysqlStats] = useState<{
    adsCount: number;
    categoriesCount: number;
    usersCount: number;
    auditLogsCount: number;
  } | null>(null);
  const [isSyncingFromMySQL, setIsSyncingFromMySQL] = useState(false);
  const [isSeedingToMySQL, setIsSeedingToMySQL] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{ success: boolean; message: string } | null>(null);

  // Load stats when switching to MySQL tab
  useEffect(() => {
    if (activeTab === 'MYSQL_LOCAL' && onGetMySQLStats) {
      onGetMySQLStats().then(stats => {
        if (stats && stats.success) {
          setMysqlStats(stats);
        }
      });
    }
  }, [activeTab]);

  // Copied code feedback
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedNuxt, setCopiedNuxt] = useState(false);

  // Ad Posting Policy & Restrictions State
  const [policyEnabled, setPolicyEnabled] = useState(adPolicy.enabled);
  const [maxMonthlyAds, setMaxMonthlyAds] = useState(adPolicy.maxAdsPerSolarMonth);
  const [maxActiveAds, setMaxActiveAds] = useState(adPolicy.maxActiveAdsPerUser);
  const [maxUrgentBadges, setMaxUrgentBadges] = useState(adPolicy.maxUrgentBadgesPerMonth);
  const [coolDownHours, setCoolDownHours] = useState(adPolicy.coolDownHours);
  const [bypassAdmins, setBypassAdmins] = useState(adPolicy.bypassForAdminsAndManagers);
  const [minTitleLen, setMinTitleLen] = useState(adPolicy.minTitleLength);
  const [maxTitleLen, setMaxTitleLen] = useState(adPolicy.maxTitleLength);
  const [allowUserReporting, setAllowUserReporting] = useState(adPolicy.allowUserAdReporting ?? true);
  const [policySavedNotice, setPolicySavedNotice] = useState(false);

  // Ad Reports State & Filters
  const [reportFilterStatus, setReportFilterStatus] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED'>('ALL');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportActionModal, setReportActionModal] = useState<{
    report: AdReport;
    action: 'DISMISS' | 'REMOVE_AD' | 'RESOLVE';
  } | null>(null);
  const [reportAdminNoteInput, setReportAdminNoteInput] = useState('');
  const [reportToDeleteId, setReportToDeleteId] = useState<string | null>(null);

  // Ad Violation Reports Sub-View: 'REPORTS' (list) or 'REASONS' (manage reason options)
  const [reportsSubView, setReportsSubView] = useState<'REPORTS' | 'REASONS'>('REPORTS');
  const [editingReason, setEditingReason] = useState<ReportReasonConfig | null>(null);
  const [isAddingReason, setIsAddingReason] = useState(false);
  const [reasonToDelete, setReasonToDelete] = useState<ReportReasonConfig | null>(null);
  const [reasonFormId, setReasonFormId] = useState('');
  const [reasonFormLabel, setReasonFormLabel] = useState('');
  const [reasonFormDescription, setReasonFormDescription] = useState('');
  const [reasonFormIsActive, setReasonFormIsActive] = useState(true);
  const [reasonFormOrder, setReasonFormOrder] = useState<number>(1);
  const [reasonFormError, setReasonFormError] = useState('');
  const [reasonFilterSearch, setReasonFilterSearch] = useState('');
  const [reasonSuccessMsg, setReasonSuccessMsg] = useState('');

  const handleOpenAddReason = () => {
    setIsAddingReason(true);
    setEditingReason(null);
    setReasonFormId(`REASON_${Date.now().toString(36).toUpperCase()}`);
    setReasonFormLabel('');
    setReasonFormDescription('');
    setReasonFormIsActive(true);
    setReasonFormOrder(reportReasons.length + 1);
    setReasonFormError('');
  };

  const handleOpenEditReason = (r: ReportReasonConfig) => {
    setEditingReason(r);
    setIsAddingReason(false);
    setReasonFormId(r.id);
    setReasonFormLabel(r.label);
    setReasonFormDescription(r.description || '');
    setReasonFormIsActive(r.isActive);
    setReasonFormOrder(r.orderNum || 1);
    setReasonFormError('');
  };

  const handleSaveReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonFormLabel.trim()) {
      setReasonFormError('لطفاً عنوان دلیل تخلف را وارد کنید.');
      return;
    }
    const finalId = (reasonFormId.trim() || `REASON_${Date.now().toString(36).toUpperCase()}`).replace(/\s+/g, '_');
    const newReason: ReportReasonConfig = {
      id: finalId,
      label: reasonFormLabel.trim(),
      description: reasonFormDescription.trim(),
      isActive: reasonFormIsActive,
      orderNum: Number(reasonFormOrder) || 1,
    };

    if (onSaveReportReason) {
      onSaveReportReason(newReason);
    } else {
      storageService.saveReportReason(newReason);
    }

    setIsAddingReason(false);
    setEditingReason(null);
    setReasonFormError('');
    setReasonSuccessMsg(editingReason ? 'تغییرات گزینه دلیل گزارش با موفقیت در پایگاه داده ذخیره شد.' : 'گزینه جدید با موفقیت به پایگاه داده اضافه شد.');
    setTimeout(() => setReasonSuccessMsg(''), 3500);
  };

  const handleConfirmDeleteReason = () => {
    if (!reasonToDelete) return;
    if (onDeleteReportReason) {
      onDeleteReportReason(reasonToDelete.id);
    } else {
      storageService.deleteReportReason(reasonToDelete.id);
    }
    setReasonToDelete(null);
    setReasonSuccessMsg('گزینه دلیل گزارش با موفقیت از پایگاه داده حذف گردید.');
    setTimeout(() => setReasonSuccessMsg(''), 3500);
  };

  const handleToggleReasonActive = (id: string, currentStatus: boolean) => {
    if (onToggleReportReason) {
      onToggleReportReason(id, !currentStatus);
    } else {
      storageService.toggleReportReason(id, !currentStatus);
    }
  };

  // Sync adPolicy state when props update
  useEffect(() => {
    setPolicyEnabled(adPolicy.enabled);
    setMaxMonthlyAds(adPolicy.maxAdsPerSolarMonth);
    setMaxActiveAds(adPolicy.maxActiveAdsPerUser);
    setMaxUrgentBadges(adPolicy.maxUrgentBadgesPerMonth);
    setCoolDownHours(adPolicy.coolDownHours);
    setBypassAdmins(adPolicy.bypassForAdminsAndManagers);
    setMinTitleLen(adPolicy.minTitleLength);
    setMaxTitleLen(adPolicy.maxTitleLength);
    setAllowUserReporting(adPolicy.allowUserAdReporting ?? true);
  }, [adPolicy]);

  // User Custom Quota assignment state
  const [quotaTargetUserId, setQuotaTargetUserId] = useState<string>('');
  const [customQuotaInputVal, setCustomQuotaInputVal] = useState<number>(10);

  // In-app deletion confirmation states (avoid window.confirm in iframe)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [adToDeleteId, setAdToDeleteId] = useState<string | null>(null);
  const [adConfigSaved, setAdConfigSaved] = useState(false);

  // AD Form Inputs
  const [adHost, setAdHost] = useState(adConfig.serverHost);
  const [adPort, setAdPort] = useState(adConfig.port);
  const [adDomain, setAdDomain] = useState(adConfig.domainName);
  const [adBaseDn, setAdBaseDn] = useState(adConfig.baseDn);
  const [adBindUser, setAdBindUser] = useState(adConfig.bindUserDn);
  const [adBindPassword, setAdBindPassword] = useState(adConfig.bindPasswordMasked || '');
  const [adGroupAdmin, setAdGroupAdmin] = useState(adConfig.groupAdminDn);
  const [adGroupManager, setAdGroupManager] = useState(adConfig.groupManagerDn);
  const [adUseSsl, setAdUseSsl] = useState(adConfig.useSsl);
  const [adAutoCreate, setAdAutoCreate] = useState(adConfig.autoCreateUser);

  // Local/Emergency Admin Password state
  const [localAdminPass, setLocalAdminPass] = useState(storageService.getAdminLocalPassword());
  const [showLocalAdminPass, setShowLocalAdminPass] = useState(false);
  const [localAdminPassSaved, setLocalAdminPassSaved] = useState(false);

  useEffect(() => {
    setAdHost(adConfig.serverHost);
    setAdPort(adConfig.port);
    setAdDomain(adConfig.domainName);
    setAdBaseDn(adConfig.baseDn);
    setAdBindUser(adConfig.bindUserDn);
    setAdGroupAdmin(adConfig.groupAdminDn);
    setAdGroupManager(adConfig.groupManagerDn);
    setAdUseSsl(adConfig.useSsl);
    setAdAutoCreate(adConfig.autoCreateUser);
  }, [adConfig]);

  // Export User Performance Report to CSV
  const handleExportCSV = () => {
    const headers = [
      'نام کاربر',
      'نام کاربری ویندوز (AD)',
      'واحد سازمانی',
      'نقش',
      'تعداد کل آگهی',
      'تایید شده',
      'در انتظار',
      'رد شده',
      'کل بازدیدها',
      'سهمیه مصرفی ماه جاری',
      'سقف مجاز ماه',
      'آخرین فعالیت',
    ];
    const rows = userPerformanceReport.map(r => [
      r.user.displayName,
      r.user.username,
      r.user.department || '',
      r.user.role,
      r.totalAds,
      r.approvedAds,
      r.pendingAds,
      r.rejectedAds,
      r.totalViews,
      r.quotaStatus?.adsUsedThisMonth ?? 0,
      r.quotaStatus?.isBypassed ? 'معاف (مدیر)' : (r.quotaStatus?.maxAllowedThisMonth ?? adPolicy.maxAdsPerSolarMonth),
      r.lastActivity,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `user_performance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download schema.sql file
  const handleDownloadSchemaSql = () => {
    const blob = new Blob([MYSQL_SCHEMA_SQL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'divar_enterprise_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestAD = async () => {
    setIsTestingAD(true);
    setAdTestResult(null);
    try {
      const res = await onTestADConnection({
        serverHost: adHost,
        port: Number(adPort) || 389,
        useSsl: adUseSsl,
        domainName: adDomain,
        baseDn: adBaseDn,
        bindUserDn: adBindUser,
        bindPasswordMasked: adBindPassword,
        groupAdminDn: adGroupAdmin,
        groupManagerDn: adGroupManager,
        autoCreateUser: adAutoCreate,
      });
      setAdTestResult(res);
    } catch (e: any) {
      setAdTestResult({
        success: false,
        latencyMs: 0,
        message: `خطای تست ارتباط: ${e.message}`,
        details: {},
      });
    } finally {
      setIsTestingAD(false);
    }
  };

  const handleTestMySQL = async () => {
    setIsTestingMySQL(true);
    setInitDbResult(null);
    try {
      const result = await onTestMySQLConnection();
      setMysqlTestResult(result);
    } catch (err: any) {
      setMysqlTestResult({
        success: false,
        connected: false,
        latencyMs: 0,
        message: `خطا در اجرای تست اتصال: ${err.message}`,
        tip: 'بررسی کنید که وب‌سرور یا سرویس بک‌اند روی پورت ۳۰۰۰ فعال باشد.',
      });
    } finally {
      setIsTestingMySQL(false);
    }
  };

  const handleInitDbSchema = async () => {
    if (!onInitMySQLSchema) return;
    setIsInitializingDb(true);
    try {
      const res = await onInitMySQLSchema();
      setInitDbResult(res);
      if (res.success) {
        setTimeout(handleTestMySQL, 600);
      }
    } catch (e: any) {
      setInitDbResult({
        success: false,
        message: `خطا در ایجاد جداول: ${e.message}`,
      });
    } finally {
      setIsInitializingDb(false);
    }
  };

  const handleSyncFromDb = async () => {
    if (!onSyncWithMySQL) return;
    setIsSyncingFromMySQL(true);
    setSyncNotice(null);
    try {
      const res = await onSyncWithMySQL();
      setSyncNotice({ success: res.success, message: res.message });
      if (onGetMySQLStats) {
        const stats = await onGetMySQLStats();
        if (stats.success) setMysqlStats(stats);
      }
    } catch (e: any) {
      setSyncNotice({ success: false, message: `خطا در دریافت داده‌ها: ${e.message}` });
    } finally {
      setIsSyncingFromMySQL(false);
    }
  };

  const handleSeedToDb = async () => {
    if (!onSeedToMySQL) return;
    setIsSeedingToMySQL(true);
    setSyncNotice(null);
    try {
      const res = await onSeedToMySQL();
      setSyncNotice({ success: res.success, message: res.message });
      if (onGetMySQLStats) {
        const stats = await onGetMySQLStats();
        if (stats.success) setMysqlStats(stats);
      }
    } catch (e: any) {
      setSyncNotice({ success: false, message: `خطا در انتقال داده‌ها: ${e.message}` });
    } finally {
      setIsSeedingToMySQL(false);
    }
  };

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim() || !selectedCatForFields) return;

    const options = newFieldType === 'select'
      ? newFieldOptionsStr.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const machineName = newFieldName.trim() || `fld_${Date.now().toString().slice(-4)}`;

    onAddFieldToCategory(selectedCatForFields, {
      name: machineName,
      label: newFieldLabel.trim(),
      type: newFieldType,
      unit: newFieldUnit.trim() || undefined,
      required: newFieldRequired,
      showInCard: newFieldShowInCard,
      options,
      order: 10,
    });

    // Reset form
    setNewFieldLabel('');
    setNewFieldName('');
    setNewFieldUnit('');
    setNewFieldOptionsStr('');
    setShowAddFieldModal(false);
  };

  const handleAssignUserCustomQuota = (userId: string, quota: number | null) => {
    onSetUserCustomQuota(userId, quota);
  };

  const handleSavePolicySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveAdPolicy({
      enabled: policyEnabled,
      maxAdsPerSolarMonth: Number(maxMonthlyAds) || 1,
      maxActiveAdsPerUser: Number(maxActiveAds) || 1,
      maxUrgentBadgesPerMonth: Number(maxUrgentBadges) || 0,
      coolDownHours: Number(coolDownHours) || 0,
      bypassForAdminsAndManagers: bypassAdmins,
      minTitleLength: Number(minTitleLen) || 3,
      maxTitleLength: Number(maxTitleLen) || 120,
      allowUserAdReporting: allowUserReporting,
    });
    setPolicySavedNotice(true);
    setTimeout(() => setPolicySavedNotice(false), 3500);
  };

  // Category Add / Edit Handlers
  const handleOpenCreateCategory = () => {
    setCategoryModalMode('CREATE');
    setCatFormId('');
    setCatFormTitle('');
    setCatFormSlug('');
    setCatFormDescription('');
    setCatFormIcon('Package');
    setCatFormColor('from-indigo-500 to-blue-600');
    setCatFormManagerId(users[0]?.id || currentUser?.id || 'usr-admin');
    setCatFormAutoApprove(false);
    setCatFormDefaultImage('');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setCategoryModalMode('EDIT');
    setCatFormId(cat.id);
    setCatFormTitle(cat.title);
    setCatFormSlug(cat.slug);
    setCatFormDescription(cat.description || '');
    setCatFormIcon(cat.icon || 'Tag');
    setCatFormColor(cat.color || 'from-indigo-500 to-blue-600');
    setCatFormManagerId(cat.managerId);
    setCatFormAutoApprove(cat.allowAutoApprove);
    setCatFormDefaultImage(cat.defaultImage || '');
    setShowCategoryModal(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormTitle.trim()) return;

    const assignedMgr = users.find(u => u.id === catFormManagerId);
    const slug = catFormSlug.trim() || `cat-${Date.now().toString().slice(-4)}`;

    if (categoryModalMode === 'CREATE') {
      const newId = `cat-${Date.now()}`;
      onSaveCategory({
        id: newId,
        title: catFormTitle.trim(),
        slug,
        description: catFormDescription.trim(),
        icon: catFormIcon,
        color: catFormColor,
        managerId: assignedMgr ? assignedMgr.id : '',
        managerName: assignedMgr ? assignedMgr.displayName : 'تعیین نشده',
        managerDepartment: assignedMgr ? assignedMgr.department : '',
        allowAutoApprove: catFormAutoApprove,
        defaultImage: catFormDefaultImage.trim() || undefined,
        fields: [],
      });
      setSelectedCatForFields(newId);
    } else {
      onSaveCategory({
        id: catFormId,
        title: catFormTitle.trim(),
        slug,
        description: catFormDescription.trim(),
        icon: catFormIcon,
        color: catFormColor,
        managerId: assignedMgr ? assignedMgr.id : '',
        managerName: assignedMgr ? assignedMgr.displayName : 'تعیین نشده',
        managerDepartment: assignedMgr ? assignedMgr.department : '',
        allowAutoApprove: catFormAutoApprove,
        defaultImage: catFormDefaultImage.trim() || undefined,
      });
    }

    setShowCategoryModal(false);
  };

  // Active Directory Sync & Category Manager Assignment handlers
  const handleSyncAD = async () => {
    setIsSyncingAD(true);
    setAdSyncNotice(null);
    try {
      if (onSyncADUsers) {
        const res = await onSyncADUsers();
        setAdSyncNotice(res.message || 'همگام‌سازی کاربران با موفقیت انجام شد.');
      } else {
        const res = await storageService.syncActiveDirectoryUsers();
        setAdSyncNotice(res.message);
      }
    } catch (e: any) {
      setAdSyncNotice(`خطا در همگام‌سازی: ${e.message}`);
    } finally {
      setIsSyncingAD(false);
      setTimeout(() => setAdSyncNotice(null), 4000);
    }
  };

  const handleSelectAdManager = (user: User) => {
    if (adPickerMode === 'CATEGORY_CARD' && adPickerCategory) {
      onSaveCategory({
        id: adPickerCategory.id,
        managerId: user.id,
        managerName: user.displayName,
        managerDepartment: user.department,
      });
      setAdPickerCategory(null);
      setAdPickerMode(null);
    } else if (adPickerMode === 'MODAL_FORM') {
      setCatFormManagerId(user.id);
      setAdPickerMode(null);
    }
  };

  const adDepartments = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      if (u.department) set.add(u.department);
    });
    return Array.from(set);
  }, [users]);

  const filteredAdUsers = useMemo(() => {
    return users.filter(u => {
      if (adPickerDepartmentFilter !== 'ALL' && u.department !== adPickerDepartmentFilter) {
        return false;
      }
      if (adPickerGroupFilter === 'MANAGERS' && u.role !== 'CATEGORY_MANAGER') {
        return false;
      }
      if (adPickerGroupFilter === 'ADMINS' && u.role !== 'SUPER_ADMIN') {
        return false;
      }
      if (adPickerGroupFilter === 'AVAILABLE' && u.role === 'CATEGORY_MANAGER') {
        return false;
      }
      if (!adPickerSearch.trim()) return true;
      const q = adPickerSearch.toLowerCase().trim();
      const inName = (u.displayName || '').toLowerCase().includes(q);
      const inUser = (u.username || '').toLowerCase().includes(q);
      const inDept = (u.department || '').toLowerCase().includes(q);
      const inPhone = (u.internalPhone || '').includes(q) || (u.mobilePhone || '').includes(q);
      const inGroups = (u.adGroups || []).some(g => g.toLowerCase().includes(q));
      return inName || inUser || inDept || inPhone || inGroups;
    });
  }, [users, adPickerDepartmentFilter, adPickerGroupFilter, adPickerSearch]);

  const handleDeleteCategoryPrompt = (cat: Category) => {
    setCategoryToDelete(cat);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const catId = categoryToDelete.id;
    onDeleteCategory(catId);
    if (selectedCatForFields === catId) {
      const remaining = categories.filter(c => c.id !== catId);
      setSelectedCatForFields(remaining[0]?.id || '');
    }
    setCategoryToDelete(null);
  };

  const handleConfirmDeleteAd = () => {
    if (!adToDeleteId) return;
    onDeleteAd(adToDeleteId);
    setAdToDeleteId(null);
  };

  // Filtered ads for moderation
  const relevantAdsForModerator = ads.filter(a => {
    if (currentUser?.role === 'SUPER_ADMIN') return true;
    if (currentUser?.role === 'CATEGORY_MANAGER') {
      return !!currentUser.managedCategoryIds?.includes(a.categoryId);
    }
    return false;
  });

  const pendingBadgeRequestsCount = relevantAdsForModerator.filter(
    a => (a.badgeRequested || a.isUrgent) && a.status === 'PENDING'
  ).length;

  const totalBadgeRequestsCount = relevantAdsForModerator.filter(
    a => a.badgeRequested || a.isUrgent
  ).length;

  const pendingReportsCount = (adReports || []).filter(r => r.status === 'PENDING').length;

  const filteredModerationAds = ads.filter(a => {
    if (selectedModerationCategory !== 'ALL' && a.categoryId !== selectedModerationCategory) {
      return false;
    }
    if (moderationStatusFilter !== 'ALL' && a.status !== moderationStatusFilter) {
      return false;
    }
    if (moderationBadgeOnly && !a.badgeRequested && !a.isUrgent) {
      return false;
    }
    // If current user is category manager, restrict to their categories unless super admin
    if (currentUser?.role === 'CATEGORY_MANAGER' && !currentUser.managedCategoryIds?.includes(a.categoryId)) {
      return false;
    }
    return true;
  });

  const activeCategoryObject = categories.find(c => c.id === selectedCatForFields);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-transparent dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">پنل مدیریت سازمانی و گزارش‌گیری</h2>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">
                  نسخه سازمانی بومی
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                نظارت بر آگهی‌ها، فیلدهای پویا، اکتیو دایرکتوری و پایگاه داده MySQL محلی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-slate-300">کاربر جاری:</span>
              <span className="font-bold text-white">{currentUser?.displayName || 'مدیر سیستم'}</span>
              <span className="text-[10px] bg-rose-600/80 px-1.5 py-0.2 rounded font-mono">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
              title="خروج و قفل پنل مدیریت"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج از پنل</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ANALYTICS'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>داشبورد و آمار تحلیلی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('USER_REPORT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'USER_REPORT'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>گزارش عملکرد کاربران</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MODERATION')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap relative cursor-pointer ${
              activeTab === 'MODERATION'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>صف بررسی آگهی‌ها</span>
            {ads.filter(a => a.status === 'PENDING').length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {toPersianDigits(ads.filter(a => a.status === 'PENDING').length)}
              </span>
            )}
            {pendingBadgeRequestsCount > 0 && (
              <span
                className="flex items-center gap-0.5 bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-2xs"
                title={`${toPersianDigits(pendingBadgeRequestsCount)} آگهی با درخواست نشان‌دار (فوری)`}
              >
                <Flame className="w-2.5 h-2.5" />
                <span>{toPersianDigits(pendingBadgeRequestsCount)}</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AD_VIOLATION_REPORTS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap relative cursor-pointer ${
              activeTab === 'AD_VIOLATION_REPORTS'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Flag className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>گزارش‌های تخلف آگهی‌ها</span>
            {pendingReportsCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {toPersianDigits(pendingReportsCount)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CATEGORIES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'CATEGORIES'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت دسته‌ها و فیلدهای پویا</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AD_POLICIES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'AD_POLICIES'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>قوانین و سهمیه درج آگهی</span>
            {policyEnabled ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="سهمیه‌بندی فعال است" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" title="سهمیه‌بندی غیرفعال است" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE_DIRECTORY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ACTIVE_DIRECTORY'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>اتصال به اکتیو دایرکتوری (AD)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MYSQL_LOCAL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'MYSQL_LOCAL'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>پایگاه داده MySQL و سرور محلی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'AUDIT_LOGS'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>لاگ‌های امنیتی و نظارتی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SYSTEM_TEXTS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'SYSTEM_TEXTS'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Type className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>مدیریت متون سامانه (بدون هاردکد)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
          {/* TAB 1: ANALYTICS & DASHBOARD */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">کل آگهی‌های ثبت شده</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {toPersianDigits(ads.length)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    {toPersianDigits(ads.filter(a => a.status === 'APPROVED').length)} آگهی فعال
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-xs text-amber-800 font-medium">در انتظار بررسی مدیران</span>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    {toPersianDigits(ads.filter(a => a.status === 'PENDING').length)}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-1">نیاز به تایید مدیر دسته</div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-xs text-blue-800 font-medium">کاربران فعال اکتیو دایرکتوری</span>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    {toPersianDigits(users.length)}
                  </div>
                  <div className="text-[11px] text-blue-700 font-medium mt-1">همگام‌سازی شده با دامنه ویندوز</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <span className="text-xs text-purple-800 font-medium">کل بازدیدهای آگهی‌ها</span>
                  <div className="text-2xl font-black text-purple-900 mt-1">
                    {toPersianDigits(ads.reduce((acc, a) => acc + (a.viewsCount || 0), 0))}
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium mt-1">
                    {toPersianDigits(ads.reduce((acc, a) => acc + (a.contactViewsCount || 0), 0))} تماس با فروشنده
                  </div>
                </div>
              </div>

              {/* Category Breakdown & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>توزیع آگهی‌ها در دسته‌بندی‌ها و مدیران ناظر</span>
                    <span className="text-[11px] text-slate-400">تعداد کل: {toPersianDigits(categories.length)} دسته</span>
                  </h3>

                  <div className="space-y-3">
                    {categories.map(cat => {
                      const count = ads.filter(a => a.categoryId === cat.id).length;
                      const pct = ads.length > 0 ? Math.round((count / ads.length) * 100) : 0;
                      return (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{cat.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">مدیر: {cat.managerName}</span>
                              <span className="font-mono text-slate-900 font-bold">{toPersianDigits(count)} ({toPersianDigits(pct)}٪)</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>پربازدیدترین آگهی‌های سازمان</span>
                    <span className="text-[11px] text-slate-400">بر اساس دفعات مشاهده</span>
                  </h3>

                  <div className="space-y-2.5">
                    {ads
                      .slice()
                      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
                      .slice(0, 5)
                      .map((ad, idx) => (
                        <div
                          key={ad.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                              {toPersianDigits(idx + 1)}
                            </span>
                            <span className="font-bold text-slate-800 truncate">{ad.title}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-slate-500">{ad.authorName}</span>
                            <span className="text-rose-600 font-bold font-mono">
                              {toPersianDigits(ad.viewsCount || 0)} بازدید
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER PERFORMANCE REPORT (Key prompt requirement) */}
          {activeTab === 'USER_REPORT' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={e => setReportSearch(e.target.value)}
                    placeholder="جستجو در نام کاربر، واحد سازمانی یا نام کاربری..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 pr-8 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>خروجی اکسل / CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span>چاپ گزارش</span>
                  </button>
                </div>
              </div>

              {/* User Performance Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">کاربر و واحد سازمانی</th>
                        <th className="py-3 px-3">نام کاربری AD</th>
                        <th className="py-3 px-3">نقش سیستمی</th>
                        <th className="py-3 px-3 text-center">کل آگهی‌ها</th>
                        <th className="py-3 px-3 text-center">تایید شده</th>
                        <th className="py-3 px-3 text-center">در انتظار</th>
                        <th className="py-3 px-3 text-center">رد شده</th>
                        <th className="py-3 px-3 text-center">کل بازدید</th>
                        <th className="py-3 px-3 text-center">سهمیه ماه جاری</th>
                        <th className="py-3 px-4">آخرین فعالیت (شمسی)</th>
                        <th className="py-3 px-3 text-center">عملیات مدیریت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userPerformanceReport
                        .filter(item => {
                          if (!reportSearch) return true;
                          const q = reportSearch.toLowerCase();
                          return (
                            item.user.displayName.toLowerCase().includes(q) ||
                            item.user.username.toLowerCase().includes(q) ||
                            (item.user.department || '').toLowerCase().includes(q)
                          );
                        })
                        .map(item => (
                          <tr key={item.user.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={item.user.avatar}
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{item.user.displayName}</div>
                                  <div className="text-[10px] text-slate-400">{item.user.department}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-600" dir="ltr">
                              {item.user.username}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  item.user.role === 'SUPER_ADMIN'
                                    ? 'bg-rose-100 text-rose-800'
                                    : item.user.role === 'CATEGORY_MANAGER'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.user.role === 'SUPER_ADMIN'
                                  ? 'مدیر ارشد'
                                  : item.user.role === 'CATEGORY_MANAGER'
                                  ? 'مدیر دسته‌بندی'
                                  : 'کاربر عادی'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-slate-900">
                              {toPersianDigits(item.totalAds)}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-emerald-600">
                              {toPersianDigits(item.approvedAds)}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-amber-600">
                              {toPersianDigits(item.pendingAds)}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-rose-600">
                              {toPersianDigits(item.rejectedAds)}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                              {toPersianDigits(item.totalViews)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {item.quotaStatus?.isBypassed ? (
                                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  معاف (مدیر)
                                </span>
                              ) : item.quotaStatus?.isBlocked ? (
                                <span
                                  className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold inline-block"
                                  title={item.quotaStatus.blockReason}
                                >
                                  سقف تکمیل ({toPersianDigits(item.quotaStatus.adsUsedThisMonth)}/{toPersianDigits(item.quotaStatus.maxAllowedThisMonth)})
                                </span>
                              ) : (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                                  {toPersianDigits(item.quotaStatus?.adsUsedThisMonth ?? 0)} از {toPersianDigits(item.quotaStatus?.maxAllowedThisMonth ?? adPolicy.maxAdsPerSolarMonth)}
                                  {item.quotaStatus?.hasCustomQuota ? ' ★' : ''}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {item.lastActivity}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => onEditUserProfile && onEditUserProfile(item.user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-bold text-xs border border-slate-200 hover:border-rose-600 transition active:scale-95 shadow-2xs group"
                                title="ویرایش مشخصات، نقش و دسترسی‌های این کاربر"
                              >
                                <UserCog className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition" />
                                <span>ویرایش پروفایل</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MODERATION QUEUE */}
          {activeTab === 'MODERATION' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Special Badge Requests Notice for Moderator */}
              {pendingBadgeRequestsCount > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Flame className="w-5 h-5 text-amber-100 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                          {toPersianDigits(pendingBadgeRequestsCount)} آگهی با «درخواست نشان‌دار (فوری)» در انتظار بررسی و تصمیم شماست
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                          بررسی ویژه نشان
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        شما می‌توانید به آسانی هر آگهی را <b>همراه با نشان فوری</b> تایید کنید، یا در صورت صلاح‌دید <b>فقط آگهی را تایید کنید و با نشان‌دار بودنش موافقت نکنید</b> (تبدیل به آگهی عادی).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModerationBadgeOnly(prev => !prev)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                      moderationBadgeOnly
                        ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                        : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{moderationBadgeOnly ? 'نمایش همه آگهی‌ها' : 'فیلتر درخواست‌های نشان‌دار'}</span>
                  </button>
                </div>
              )}

              {/* Category & Status Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">فیلتر دسته‌بندی:</label>
                    <select
                      value={selectedModerationCategory}
                      onChange={e => setSelectedModerationCategory(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-medium outline-none"
                    >
                      <option value="ALL">همه دسته‌ها</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} (مدیر: {c.managerName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">وضعیت بررسی:</label>
                    <select
                      value={moderationStatusFilter}
                      onChange={e => setModerationStatusFilter(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-medium outline-none"
                    >
                      <option value="ALL">همه وضعیت‌ها</option>
                      <option value="PENDING">در انتظار تایید</option>
                      <option value="APPROVED">تایید شده</option>
                      <option value="REJECTED">رد شده</option>
                    </select>
                  </div>

                  <div className="pt-4 sm:pt-0 self-end">
                    <button
                      type="button"
                      onClick={() => setModerationBadgeOnly(prev => !prev)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        moderationBadgeOnly
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="فیلتر آگهی‌های دارای درخواست نشان‌دار"
                    >
                      <Flame className={`w-3.5 h-3.5 ${moderationBadgeOnly ? 'text-amber-200' : 'text-amber-500'}`} />
                      <span>درخواست‌های نشان‌دار</span>
                      {totalBadgeRequestsCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          moderationBadgeOnly ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {toPersianDigits(totalBadgeRequestsCount)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  نمایش {toPersianDigits(filteredModerationAds.length)} آگهی بر اساس دسترسی مدیریتی شما
                  {moderationBadgeOnly && ' (فقط درخواست‌های نشان‌دار)'}
                </div>
              </div>

              {/* List of Ads to Moderate */}
              <div className="space-y-3">
                {filteredModerationAds.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    آگهی متناسب با فیلتر انتخابی جهت بررسی یافت نشد.
                  </div>
                ) : (
                  filteredModerationAds.map(ad => {
                    const isBadgeRequest = !!(ad.badgeRequested || ad.isUrgent);
                    return (
                      <div
                        key={ad.id}
                        className={`p-4 rounded-2xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
                          isBadgeRequest
                            ? 'bg-amber-50/20 border-amber-300/80 hover:border-amber-400 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={ad.images?.[0] || OFFLINE_IMG_DEFAULT}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                            />
                            {isBadgeRequest && (
                              <div
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs"
                                title="درخواست نشان‌دار کردن آگهی"
                              >
                                <Flame className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">{ad.title}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  ad.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ad.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {ad.status === 'APPROVED'
                                  ? 'تایید شده'
                                  : ad.status === 'PENDING'
                                  ? 'در انتظار بررسی'
                                  : 'رد شده'}
                              </span>

                              {isBadgeRequest && (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                                  <Flame className="w-3 h-3 text-amber-600 animate-pulse" />
                                  <span>درخواست نشان فوری</span>
                                </span>
                              )}
                              {isBadgeRequest && ad.badgeApproved === false && (
                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                  نشان رد شده (آگهی عادی)
                                </span>
                              )}
                              {isBadgeRequest && (ad.badgeApproved === true || (ad.isUrgent && ad.status === 'APPROVED')) && (
                                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                                  نشان فوری تایید شده
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                              <span>دسته‌بندی: <b>{ad.categoryTitle}</b></span>
                              <span>آگهی‌دهنده: <b>{ad.authorName} ({ad.authorDepartment})</b></span>
                              <span>تاریخ ثبت: {ad.createdAtShamsi}</span>
                            </div>

                            {ad.rejectionReason && (
                              <div className="mt-1 text-[11px] text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                                علت رد آگهی: {ad.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center flex-wrap gap-2 shrink-0 w-full md:w-auto justify-end">
                          {/* Edit Ad button - works for any ad status */}
                          <button
                            type="button"
                            onClick={() => setEditingAd(ad)}
                            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-2xs"
                            title="ویرایش و تغییر مشخصات آگهی توسط مدیر"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>ویرایش آگهی</span>
                          </button>

                          {/* Approval Actions */}
                          {ad.status !== 'APPROVED' ? (
                            isBadgeRequest ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onApproveAd(ad.id, true)}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                                  title="تایید آگهی همراه با نشان متمایز قرمز فوری"
                                >
                                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                                  <span>تایید با نشان فوری</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onApproveAd(ad.id, false)}
                                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                                  title="تایید آگهی بدون نشان فوری (تبدیل به آگهی عادی)"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                                  <span>تایید عادی (رد نشان)</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onApproveAd(ad.id, false)}
                                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>تایید و انتشار</span>
                              </button>
                            )
                          ) : (
                            /* If already approved, allow toggling urgent badge directly */
                            isBadgeRequest && (
                              ad.isUrgent ? (
                                <button
                                  type="button"
                                  onClick={() => onApproveAd(ad.id, false)}
                                  className="flex items-center gap-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                                  title="حذف نشان فوری و تبدیل به آگهی عادی"
                                >
                                  <span>حذف نشان فوری</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onApproveAd(ad.id, true)}
                                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition shadow-2xs"
                                  title="اعطای مجدد نشان فوری"
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                  <span>اعطای نشان فوری</span>
                                </button>
                              )
                            )
                          )}

                          {ad.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt('لطفاً دلیل رد آگهی را وارد فرمایید:') || 'عدم رعایت دستورالعمل سازمانی';
                                onRejectAd(ad.id, reason);
                              }}
                              className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رد آگهی</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setAdToDeleteId(ad.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: AD VIOLATION REPORTS MODERATION */}
          {activeTab === 'AD_VIOLATION_REPORTS' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Box */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-rose-900/40 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-rose-400" />
                    <span className="font-extrabold text-sm sm:text-base">
                      رسیدگی به گزارش‌های تخلف آگهی‌ها (نظارت همگانی)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    در این بخش می‌توانید گزارش‌های ثبت‌شده توسط پرسنل در خصوص آگهی‌های مغایر با شئون سازمانی، کلاهبرداری، اطلاعات اشتباه یا قیمت غیرواقعی را بررسی نموده و با حذف آگهی متخلف یا مختومه کردن گزارش اقدام نمایید.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-rose-900/60 border border-rose-700/60 px-3 py-1.5 rounded-xl font-bold text-rose-200">
                    {toPersianDigits(pendingReportsCount)} گزارش در انتظار بررسی
                  </span>
                </div>
              </div>

              {/* Sub-View Switcher: Reports List vs Reasons Configuration */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-2xs">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setReportsSubView('REPORTS')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reportsSubView === 'REPORTS'
                        ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>گزارش‌های تخلف دریافتی</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                      {toPersianDigits((adReports || []).length)}
                    </span>
                    {pendingReportsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportsSubView('REASONS')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reportsSubView === 'REASONS'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>مدیریت و ویرایش گزینه‌های علت گزارش</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      {toPersianDigits(reportReasons.length)} گزینه
                    </span>
                  </button>
                </div>

                {reportsSubView === 'REASONS' && (
                  <button
                    type="button"
                    onClick={handleOpenAddReason}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن گزینه جدید علت گزارش</span>
                  </button>
                )}
              </div>

              {/* VIEW 1: USER REPORTS MODERATION */}
              {reportsSubView === 'REPORTS' && (
                <div className="space-y-6">
                  {/* Status Warning if reporting is disabled */}
                  {!allowUserReporting && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          توجه: قابلیت ثبت گزارش تخلف توسط کاربران در تب <strong>«قوانین و سهمیه درج آگهی»</strong> در حال حاضر <strong>غیرفعال</strong> است.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('AD_POLICIES')}
                        className="text-xs font-bold text-amber-800 dark:text-amber-300 underline hover:no-underline shrink-0 cursor-pointer"
                      >
                        تغییر تنظیمات قوانین
                      </button>
                    </div>
                  )}

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="text-[11px] text-slate-500 font-bold">کل گزارش‌های دریافتی</div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {toPersianDigits((adReports || []).length)}
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold">در انتظار بررسی</div>
                      <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                        <span>{toPersianDigits(pendingReportsCount)}</span>
                        {pendingReportsCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">رسیدگی و مختومه شده</div>
                      <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                        {toPersianDigits((adReports || []).filter(r => r.status === 'RESOLVED').length)}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">رد شده (فاقد تخلف)</div>
                      <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
                        {toPersianDigits((adReports || []).filter(r => r.status === 'DISMISSED').length)}
                      </div>
                    </div>
                  </div>

                  {/* Filters and Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        type="button"
                        onClick={() => setReportFilterStatus('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          reportFilterStatus === 'ALL'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        همه ({toPersianDigits((adReports || []).length)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportFilterStatus('PENDING')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          reportFilterStatus === 'PENDING'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        در انتظار بررسی ({toPersianDigits(pendingReportsCount)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportFilterStatus('RESOLVED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          reportFilterStatus === 'RESOLVED'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        رسیدگی شده ({toPersianDigits((adReports || []).filter(r => r.status === 'RESOLVED').length)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportFilterStatus('DISMISSED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          reportFilterStatus === 'DISMISSED'
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        رد شده ({toPersianDigits((adReports || []).filter(r => r.status === 'DISMISSED').length)})
                      </button>
                    </div>

                    <div className="relative min-w-[220px]">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reportSearchQuery}
                        onChange={e => setReportSearchQuery(e.target.value)}
                        placeholder="جستجو در عنوان، نام کاربر، دلیل..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Reports List */}
                  <div className="space-y-4">
                    {(() => {
                      const filtered = (adReports || []).filter(r => {
                        if (reportFilterStatus !== 'ALL' && r.status !== reportFilterStatus) return false;
                        if (reportSearchQuery.trim()) {
                          const q = reportSearchQuery.trim().toLowerCase();
                          const matchTitle = r.adTitle?.toLowerCase().includes(q);
                          const matchReporter = r.reporterName?.toLowerCase().includes(q);
                          const matchAuthor = r.authorName?.toLowerCase().includes(q);
                          const matchReason = r.reasonLabel?.toLowerCase().includes(q);
                          const matchDesc = r.description?.toLowerCase().includes(q);
                          if (!matchTitle && !matchReporter && !matchAuthor && !matchReason && !matchDesc) return false;
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              هیچ گزارش تخلفی با این فیلتر یافت نشد
                            </h4>
                            <p className="text-xs text-slate-500">
                              {reportFilterStatus === 'PENDING'
                                ? 'عالی است! در حال حاضر هیچ گزارش تخلفی در انتظار بررسی مدیران وجود ندارد.'
                                : 'گزارش جدیدی مطابق معیارهای جستجو وجود ندارد.'}
                            </p>
                          </div>
                        );
                      }

                      return filtered.map(report => {
                        const targetAd = ads.find(a => a.id === report.adId);
                        return (
                          <div
                            key={report.id}
                            className={`p-5 rounded-2xl border transition shadow-2xs space-y-4 bg-white dark:bg-slate-900 ${
                              report.status === 'PENDING'
                                ? 'border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-200/50'
                                : report.status === 'RESOLVED'
                                ? 'border-emerald-200 dark:border-emerald-900/60'
                                : 'border-slate-200 dark:border-slate-800 opacity-80'
                            }`}
                          >
                            {/* Top bar of card */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>{report.reasonLabel}</span>
                                </span>

                                {report.status === 'PENDING' && (
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                    در انتظار تصمیم مدیر
                                  </span>
                                )}
                                {report.status === 'RESOLVED' && (
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    بررسی و حل و فصل شده
                                  </span>
                                )}
                                {report.status === 'DISMISSED' && (
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    رد گزارش (عدم احراز تخلف)
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>ثبت شده: {report.createdAtShamsi}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setReportToDeleteId(report.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition rounded-lg cursor-pointer"
                                  title="حذف گزارش"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Ad Info */}
                              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                  <span className="text-slate-500">آگهی مورد گزارش:</span>
                                  {targetAd ? (
                                    <button
                                      type="button"
                                      onClick={() => setEditingAd(targetAd)}
                                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>مشاهده / ویرایش آگهی</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-rose-500 font-medium">
                                      (آگهی از سامانه حذف شده است)
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                                  {report.adTitle}
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                                  <span>دسته: {report.adCategoryTitle || 'عمومی'}</span>
                                  <span>ثبت‌کننده: {report.authorName}</span>
                                </div>
                              </div>

                              {/* Reporter Info & Explanation */}
                              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                  <span className="text-slate-500">گزارش‌دهنده (همکار سازمانی):</span>
                                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                                    {report.reporterName} {report.reporterDepartment ? `(${report.reporterDepartment})` : ''}
                                  </span>
                                </div>
                                <div className="text-slate-700 dark:text-slate-300">
                                  <span className="text-slate-500 text-[11px] block mb-0.5">توضیحات تکمیلی گزارش:</span>
                                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                                    {report.description || 'توضیحات متنی ثبت نشده است.'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* If Resolved or Dismissed Details */}
                            {(report.status === 'RESOLVED' || report.status === 'DISMISSED') && (
                              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl text-xs space-y-1">
                                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                                  <span>رسیدگی شده توسط: <strong>{report.resolvedByName || 'مدیر سیستم'}</strong></span>
                                  <span>تاریخ رسیدگی: {report.resolvedAtShamsi}</span>
                                </div>
                                {report.adminNote && (
                                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                    یادداشت مدیر: <span className="font-bold">{report.adminNote}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              {targetAd && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReportActionModal({
                                      report,
                                      action: 'REMOVE_AD',
                                    });
                                    setReportAdminNoteInput('به دلیل تخلف از قوانین سامانه و مغایرت محتوا حذف شد.');
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>حذف آگهی متخلف و تایید گزارش</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setReportActionModal({
                                    report,
                                    action: 'RESOLVE',
                                  });
                                  setReportAdminNoteInput('بررسی و حل و فصل گردید.');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>تایید گزارش و بستن (بدون حذف)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReportActionModal({
                                    report,
                                    action: 'DISMISS',
                                  });
                                  setReportAdminNoteInput('موردی از تخلف مشاهده نشد و آگهی معتبر است.');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>رد گزارش (عدم احراز تخلف)</span>
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* VIEW 2: DYNAMIC REPORT REASONS CRUD MANAGEMENT */}
              {reportsSubView === 'REASONS' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Database persistence banner */}
                  <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-start gap-3">
                    <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                      <div className="font-bold text-sm">
                        پیکربندی گزینه‌های علت گزارش در دیتابیس (بدون ذخیره‌سازی در localStorage)
                      </div>
                      <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
                        تمامی گزینه‌های علت گزارش تخلف به صورت مستقیم در <strong>پایگاه داده سرور</strong> ذخیره، ویرایش و حذف می‌شوند و هیچ داده‌ای در حافظه محلی (localStorage) مرورگر ثبت نمی‌گردد. مدیران سیستم می‌توانند گزینه‌های جدید اضافه کنند، عناوین و توضیحات را ویرایش نمایند و یا گزینه‌ها را فعال/غیرفعال یا حذف کنند.
                      </p>
                    </div>
                  </div>

                  {reasonSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{reasonSuccessMsg}</span>
                    </div>
                  )}

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="text-[11px] text-slate-500 font-bold">کل گزینه‌ها</div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {toPersianDigits(reportReasons.length)}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">گزینه‌های فعال در فرم گزارش</div>
                      <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                        {toPersianDigits(reportReasons.filter(r => r.isActive).length)}
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold">گزینه‌های غیرفعال (مخفی)</div>
                      <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
                        {toPersianDigits(reportReasons.filter(r => !r.isActive).length)}
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-2xs">
                      <div className="text-[11px] text-indigo-800 dark:text-indigo-300 font-bold">تعداد کل گزارش‌های ثبت‌شده</div>
                      <div className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
                        {toPersianDigits((adReports || []).length)}
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reasonFilterSearch}
                        onChange={e => setReasonFilterSearch(e.target.value)}
                        placeholder="جستجو در عنوان، شناسه یا توضیحات دلایل گزارش..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddReason}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن گزینه جدید علت گزارش</span>
                    </button>
                  </div>

                  {/* Reasons Cards / List */}
                  <div className="space-y-3">
                    {(() => {
                      const sortedReasons = [...reportReasons].sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0));
                      const filtered = sortedReasons.filter(r => {
                        if (!reasonFilterSearch.trim()) return true;
                        const q = reasonFilterSearch.toLowerCase();
                        return (
                          r.label.toLowerCase().includes(q) ||
                          r.id.toLowerCase().includes(q) ||
                          (r.description && r.description.toLowerCase().includes(q))
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                              <AlertCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              گزینه‌ای مطابق با جستجو یافت نشد
                            </h4>
                            <p className="text-xs text-slate-500">
                              می‌توانید با کلیک بر روی دکمه «افزودن گزینه جدید»، دلیل تخلف مورد نظر خود را ایجاد نمایید.
                            </p>
                          </div>
                        );
                      }

                      return filtered.map((reason, idx) => {
                        const usageCount = (adReports || []).filter(rep => rep.reason === reason.id).length;

                        return (
                          <div
                            key={reason.id}
                            className={`p-4 rounded-2xl border transition shadow-2xs bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                              reason.isActive
                                ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                                : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 opacity-75'
                            }`}
                          >
                            <div className="flex items-start gap-3.5 flex-1">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-800/50">
                                {toPersianDigits(reason.orderNum || idx + 1)}
                              </div>

                              <div className="space-y-1 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                    {reason.label}
                                  </h4>
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                                    {reason.id}
                                  </span>
                                  {reason.isActive ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      فعال در فرم
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                      غیرفعال
                                    </span>
                                  )}
                                  {usageCount > 0 && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                                      {toPersianDigits(usageCount)} بار گزارش شده
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {reason.description || 'توضیحات راهنما برای این گزینه ثبت نشده است.'}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => handleToggleReasonActive(reason.id, reason.isActive)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                  reason.isActive
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                }`}
                                title={reason.isActive ? 'کلیک کنید تا غیرفعال شود' : 'کلیک کنید تا فعال شود'}
                              >
                                {reason.isActive ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>فعال</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5" />
                                    <span>غیرفعال</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditReason(reason)}
                                className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                                title="ویرایش عنوان و مشخصات"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setReasonToDelete(reason)}
                                className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800 transition cursor-pointer"
                                title="حذف این گزینه از دیتابیس"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CATEGORIES & DYNAMIC FIELDS BUILDER (Key prompt requirement) */}
          {activeTab === 'CATEGORIES' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 space-y-1">
                  <div className="font-bold text-sm">
                    پیکربندی دسته‌بندی‌ها، تعیین مدیر اختصاصی و فیلدهای ویژگی پویا
                  </div>
                  <p className="text-indigo-800 leading-relaxed">
                    مطابق با درخواست شما، هر دسته‌بندی دارای مدیر سازمانی اختصاصی و فیلدهای ویژگی سفارشی است. فیلدهای هر دسته هنگام ثبت یا فیلتر کردن آگهی به صورت پویا رندر می‌شوند.
                  </p>
                </div>
              </div>

              {/* Categories Cards List with Manager Assignment */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">فهرست دسته‌بندی‌های فعال و مدیران انتسابی:</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      امکان افزودن دسته‌بندی جدید، تغییر مشخصات، انتخاب آیکون، تعیین مدیر ناظر و وضعیت تایید خودکار
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateCategory}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن دسته‌بندی جدید</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map(cat => {
                    const iconObj = CATEGORY_ICON_OPTIONS.find(i => i.name === cat.icon) || { icon: Tag };
                    const IconComp = iconObj.icon;
                    const colorClass = cat.color || 'from-indigo-500 to-blue-600';

                    return (
                      <div
                        key={cat.id}
                        className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                          selectedCatForFields === cat.id
                            ? 'border-rose-600 bg-rose-50/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-xs shrink-0`}
                              >
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-slate-900">{cat.title}</span>
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                    {toPersianDigits(cat.fields.length)} فیلد پویا
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5" dir="ltr">
                                  slug: {cat.slug}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                title="ویرایش دسته‌بندی"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategoryPrompt(cat)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="حذف دسته‌بندی"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {cat.description && (
                            <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                cat.allowAutoApprove
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {cat.allowAutoApprove ? '✓ انتشار خودکار بدون نیاز به تایید' : 'نیاز به تایید ناظر قبل از انتشار'}
                            </span>
                          </div>

                          {/* Default Image Row */}
                          <div className="mt-3 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              {cat.defaultImage ? (
                                <img
                                  src={cat.defaultImage}
                                  alt={cat.title}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-400 shrink-0">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-slate-800 truncate">
                                  {cat.defaultImage ? 'دارای تصویر پیش‌فرض' : 'فاقد تصویر پیش‌فرض'}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {cat.defaultImage ? 'اعمال خودکار روی آگهی‌های بدون تصویر' : 'کلیک کنید برای تنظیم تصویر'}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(cat)}
                              className="shrink-0 px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition border border-rose-200/60"
                            >
                              {cat.defaultImage ? 'تغییر' : 'انتخاب'}
                            </button>
                          </div>
                        </div>

                        <div>
                          {/* Manager info & Assignment */}
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs gap-2">
                              <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="text-slate-500 dark:text-slate-400 shrink-0">مدیر ناظر:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px] sm:max-w-none" title={cat.managerName}>
                                  {cat.managerName || 'تعیین نشده'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAdPickerCategory(cat);
                                  setAdPickerMode('CATEGORY_CARD');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 dark:hover:bg-rose-600 rounded-lg transition border border-rose-200 dark:border-rose-900/60 cursor-pointer shrink-0"
                                title="انتخاب یا تغییر مدیر این دسته‌بندی از بین کاربران Active Directory"
                              >
                                <Server className="w-3 h-3" />
                                <span>انتخاب از AD</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <select
                                value={cat.managerId || ''}
                                onChange={e => {
                                  const newMgrId = e.target.value;
                                  if (!newMgrId) {
                                    onSaveCategory({
                                      id: cat.id,
                                      managerId: '',
                                      managerName: 'تعیین نشده',
                                      managerDepartment: '',
                                    });
                                    return;
                                  }
                                  const newMgr = users.find(u => u.id === newMgrId);
                                  if (newMgr) {
                                    onSaveCategory({
                                      id: cat.id,
                                      managerId: newMgr.id,
                                      managerName: newMgr.displayName,
                                      managerDepartment: newMgr.department,
                                    });
                                  }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-200 outline-none truncate"
                              >
                                <option value="">-- فاقد مدیر ناظر (کلیک جهت انتصاب از کاربران AD) --</option>
                                {users.map(u => (
                                  <option key={u.id} value={u.id}>
                                    {u.displayName} ({u.department || 'دپارتمان عمومی'} — {u.username}) {u.role === 'SUPER_ADMIN' ? '★ مدیر ارشد' : u.role === 'CATEGORY_MANAGER' ? '⚡ مدیر دسته' : '👤 کاربر AD'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Select for field management */}
                          <button
                            type="button"
                            onClick={() => setSelectedCatForFields(cat.id)}
                            className={`w-full mt-3 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                              selectedCatForFields === cat.id
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>
                              {selectedCatForFields === cat.id
                                ? '✓ دسته‌بندی فعال جهت ویرایش فیلدها'
                                : 'انتخاب و مدیریت فیلدهای ویژگی این دسته'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Create / Edit Modal Dialog */}
              {showCategoryModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-3" dir="rtl">
                  <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                    onClick={() => setShowCategoryModal(false)}
                  />
                  <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 z-10 overflow-y-auto max-h-[90vh] space-y-5 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {categoryModalMode === 'CREATE' ? 'افزودن دسته‌بندی جدید' : 'ویرایش مشخصات دسته‌بندی'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            عنوان دسته‌بندی (فارسی) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={catFormTitle}
                            onChange={e => setCatFormTitle(e.target.value)}
                            placeholder="مثال: لوازم و تجهیزات اداری"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            شناسه انگلیسی / لاتین (Slug)
                          </label>
                          <input
                            type="text"
                            value={catFormSlug}
                            onChange={e => setCatFormSlug(e.target.value)}
                            placeholder="مثال: office-supplies"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          توضیحات دسته‌بندی
                        </label>
                        <textarea
                          rows={2}
                          value={catFormDescription}
                          onChange={e => setCatFormDescription(e.target.value)}
                          placeholder="توضیح مختصر درباره اقلام و کالاهای این بخش..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-slate-700 dark:text-slate-300">
                              مدیر ناظر دسته‌بندی
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setAdPickerCategory(null);
                                setAdPickerMode('MODAL_FORM');
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline cursor-pointer"
                            >
                              <Server className="w-3.5 h-3.5" />
                              <span>جستجو در Active Directory</span>
                            </button>
                          </div>
                          <select
                            value={catFormManagerId || ''}
                            onChange={e => setCatFormManagerId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                          >
                            <option value="">-- بدون انتصاب مدیر ناظر (تعیین در آینده) --</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>
                                {u.displayName} ({u.department || 'دپارتمان عمومی'} — {u.username}) {u.role === 'SUPER_ADMIN' ? '★ مدیر ارشد' : u.role === 'CATEGORY_MANAGER' ? '⚡ مدیر دسته' : '👤 کاربر AD'}
                              </option>
                            ))}
                          </select>

                          {/* Selected Manager Live Preview */}
                          {(() => {
                            const selectedMgr = users.find(u => u.id === catFormManagerId);
                            if (!selectedMgr) return null;
                            return (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-rose-50/70 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/40 text-[11px]">
                                <div className="w-7 h-7 rounded-full bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-center font-bold shrink-0">
                                  <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                    {selectedMgr.displayName}
                                  </div>
                                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                                    <span>{selectedMgr.department}</span>
                                    <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300" dir="ltr">
                                      {selectedMgr.username}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
                                  آماده انتصاب
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            تم رنگی و گرادیان
                          </label>
                          <select
                            value={catFormColor}
                            onChange={e => setCatFormColor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                          >
                            {CATEGORY_COLOR_OPTIONS.map(c => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Icon selector */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">
                          انتخاب آیکون دسته‌بندی ({CATEGORY_ICON_OPTIONS.find(i => i.name === catFormIcon)?.label || 'آیکون'})
                        </label>
                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                          {CATEGORY_ICON_OPTIONS.map(item => {
                            const IconComponent = item.icon;
                            const isSelected = catFormIcon === item.name;
                            return (
                              <button
                                key={item.name}
                                type="button"
                                onClick={() => setCatFormIcon(item.name)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition border text-center ${
                                  isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                }`}
                                title={item.label}
                              >
                                <IconComponent className="w-4 h-4" />
                                <span className="text-[9px] mt-1 truncate max-w-full font-medium">
                                  {item.label.split(' ')[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Default Category Image Selector */}
                      <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block font-bold text-slate-800">
                              تصویر پیش‌فرض دسته‌بندی
                            </label>
                            <span className="text-[11px] text-slate-500">
                              این تصویر برای آگهی‌های ثبت شده در این دسته که فاقد تصویر هستند اعمال می‌شود.
                            </span>
                          </div>
                          {catFormDefaultImage && (
                            <button
                              type="button"
                              onClick={() => setCatFormDefaultImage('')}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                            >
                              حذف تصویر
                            </button>
                          )}
                        </div>

                        {/* Current selected image preview */}
                        {catFormDefaultImage ? (
                          <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                            <img
                              src={catFormDefaultImage}
                              alt="پیش‌نمایش تصویر پیش‌فرض"
                              className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800">تصویر پیش‌فرض انتخاب شده</span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium">
                                  فعال
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5" dir="ltr">
                                {catFormDefaultImage.startsWith('data:') ? 'تصویر بارگذاری شده از رایانه (Base64)' : catFormDefaultImage}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                            هیچ تصویری انتخاب نشده است (یک تصویر از گزینه‌های آماده زیر برگزینید، آدرس تصویر وارد کنید یا فایلی آپلود نمایید)
                          </div>
                        )}

                        {/* Preset Image Options */}
                        <div>
                          <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>گالری تصاویر پیش‌فرض پیشنهادی:</span>
                            <span className="text-[10px] text-slate-400">کلیک جهت انتخاب سریع</span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1.5 bg-white rounded-xl border border-slate-200">
                            {PRESET_CATEGORY_IMAGES.map((preset, idx) => {
                              const isSelected = catFormDefaultImage === preset.url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setCatFormDefaultImage(preset.url)}
                                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition group text-right ${
                                    isSelected
                                      ? 'border-rose-600 ring-2 ring-rose-500/20'
                                      : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                                  }`}
                                >
                                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 truncate px-1 text-center font-medium">
                                    {preset.label}
                                  </span>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-xs">
                                      <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom URL and File Upload */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              یا درج آدرس تصویر (URL / Data URI):
                            </label>
                            <input
                              type="text"
                              value={catFormDefaultImage.startsWith('data:') ? '' : catFormDefaultImage}
                              onChange={e => setCatFormDefaultImage(e.target.value)}
                              placeholder="/images/example.jpg یا آدرس محلی"
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono text-left"
                              dir="ltr"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              یا بارگذاری فایل تصویر از رایانه:
                            </label>
                            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-rose-300 px-3 py-1.5 rounded-xl cursor-pointer bg-white hover:bg-rose-50/20 transition text-xs text-slate-700 font-medium">
                              <Upload className="w-3.5 h-3.5 text-rose-600" />
                              <span>انتخاب فایل تصویر</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCatImageFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Auto approve checkbox */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">انتشار خودکار بدون نیاز به تایید ناظر</div>
                          <div className="text-[11px] text-slate-500">
                            در صورت فعال بودن، آگهی‌های ثبت شده در این دسته بلافاصله در دیوار سازمانی نمایش داده می‌شوند.
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                          <input
                            type="checkbox"
                            checked={catFormAutoApprove}
                            onChange={e => setCatFormAutoApprove(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowCategoryModal(false)}
                          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{categoryModalMode === 'CREATE' ? 'ایجاد دسته‌بندی' : 'بروزرسانی دسته‌بندی'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Active Directory User Picker Modal Dialog */}
              {adPickerMode && (
                <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4" dir="rtl">
                  <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                    onClick={() => setAdPickerMode(null)}
                  />
                  <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full p-6 z-10 overflow-hidden flex flex-col max-h-[90vh] space-y-4 animate-in fade-in zoom-in-95 border border-slate-100 dark:border-slate-800">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>انتخاب مدیر دسته‌بندی از میان پرسنل Active Directory</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                              {toPersianDigits(filteredAdUsers.length)} کاربر
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {adPickerMode === 'CATEGORY_CARD' && adPickerCategory
                              ? `در حال تعیین مدیر ناظر برای دسته‌بندی «${adPickerCategory.title}»`
                              : 'انتخاب مدیر ناظر دسته‌بندی با دسترسی تایید، رد و نظارت بر آگهی‌ها'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdPickerMode(null)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Explanatory Info Card */}
                    <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>
                          کاربر انتخاب‌شده به صورت خودکار به عنوان <b>مدیر دسته‌بندی (Category Manager)</b> تعیین شده و کنترل صف تایید آگهی‌های این بخش را برعهده خواهد داشت.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSyncAD}
                        disabled={isSyncingAD}
                        className="shrink-0 flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-[11px] font-bold transition shadow-2xs cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAD ? 'animate-spin' : ''}`} />
                        <span>{isSyncingAD ? 'در حال دریافت...' : 'همگام‌سازی زنده دایرکتوری'}</span>
                      </button>
                    </div>

                    {adSyncNotice && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{adSyncNotice}</span>
                      </div>
                    )}

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <input
                          type="text"
                          value={adPickerSearch}
                          onChange={e => setAdPickerSearch(e.target.value)}
                          placeholder="جستجو در نام کاربر، نام کاربری دامین (sAMAccountName)، واحد سازمانی یا گروه AD..."
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        {adPickerSearch && (
                          <button
                            type="button"
                            onClick={() => setAdPickerSearch('')}
                            className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <select
                        value={adPickerDepartmentFilter}
                        onChange={e => setAdPickerDepartmentFilter(e.target.value)}
                        className="w-full sm:w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none font-medium"
                      >
                        <option value="ALL">همه واحدهای سازمانی</option>
                        {adDepartments.map(dept => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>

                      <select
                        value={adPickerGroupFilter}
                        onChange={e => setAdPickerGroupFilter(e.target.value as any)}
                        className="w-full sm:w-40 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none font-medium"
                      >
                        <option value="ALL">همه نقش‌ها و گروه‌ها</option>
                        <option value="MANAGERS">مدیران دسته‌ها</option>
                        <option value="ADMINS">مدیران ارشد</option>
                        <option value="AVAILABLE">کاربران فاقد دسته</option>
                      </select>
                    </div>

                    {/* User Cards Grid */}
                    <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-2 pr-1">
                      {filteredAdUsers.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                          <Users className="w-8 h-8 mx-auto text-slate-300" />
                          <p>هیچ کاربری با مشخصات وارد شده در Active Directory یافت نشد.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setAdPickerSearch('');
                              setAdPickerDepartmentFilter('ALL');
                              setAdPickerGroupFilter('ALL');
                            }}
                            className="text-rose-600 font-bold hover:underline"
                          >
                            حذف فیلترها
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {filteredAdUsers.map(u => {
                            const currentTargetId = adPickerMode === 'CATEGORY_CARD' && adPickerCategory ? adPickerCategory.id : null;
                            const isCurrentManagerOfTarget = currentTargetId ? adPickerCategory?.managerId === u.id : catFormManagerId === u.id;
                            const managedCategories = categories.filter(c => c.managerId === u.id);

                            return (
                              <div
                                key={u.id}
                                className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                                  isCurrentManagerOfTarget
                                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative shrink-0">
                                      <img
                                        src={typeof u.avatar === 'string' ? u.avatar : (u.avatar as any)?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                      />
                                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 absolute bottom-0 left-0" title="کاربر فعال دایرکتوری" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                                        <span>{u.displayName}</span>
                                        {u.role === 'SUPER_ADMIN' && (
                                          <span className="text-[9px] bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 px-1.5 py-0.2 rounded font-bold">
                                            مدیر ارشد
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {u.department}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                                        <span className="bg-slate-100 dark:bg-slate-700/80 px-1 rounded text-slate-600 dark:text-slate-300" dir="ltr">
                                          {u.username}
                                        </span>
                                        {u.internalPhone && (
                                          <span>داخلی: {toPersianDigits(u.internalPhone)}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* AD Groups and Managed categories */}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 text-[10px]">
                                  <div className="flex items-center gap-1 flex-wrap min-w-0">
                                    {managedCategories.length > 0 ? (
                                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-bold px-2 py-0.5 rounded-md truncate max-w-[170px]" title={managedCategories.map(c => c.title).join('، ')}>
                                        مدیر: {managedCategories.map(c => c.title).join('، ')}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">بدون دسته تحت مدیریت</span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSelectAdManager(u)}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shrink-0 cursor-pointer ${
                                      isCurrentManagerOfTarget
                                        ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{isCurrentManagerOfTarget ? 'مدیر فعلی' : 'انتخاب به عنوان مدیر'}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        نمایش {toPersianDigits(filteredAdUsers.length)} از {toPersianDigits(users.length)} کاربر اکتیو دایرکتوری
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdPickerMode(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      >
                        بستن پنجره
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeCategoryObject && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>فیلدهای ویژگی اختصاصی برای دسته‌بندی «{activeCategoryObject?.title || ''}»</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        فیلدهای مشخص شده زیر برای هر آگهی در این دسته از کاربر دریافت و ذخیره می‌شوند.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddFieldModal(true)}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن فیلد ویژگی جدید</span>
                    </button>
                  </div>

                  {/* List of fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeCategoryObject.fields.map(fld => (
                      <div
                        key={fld.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{fld.label}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                              {fld.type}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1" dir="ltr">
                            key: {fld.name}
                          </div>

                          {fld.unit && (
                            <div className="text-[11px] text-slate-500 mt-1">واحد: {fld.unit}</div>
                          )}

                          {fld.options && fld.options.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1.5 bg-slate-50 p-1.5 rounded line-clamp-2">
                              گزینه‌ها: {fld.options.join(' ، ')}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className={fld.required ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                            {fld.required ? 'اجباری' : 'اختیاری'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteCategoryField(activeCategoryObject.id, fld.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                            title="حذف فیلد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Modal to add a new custom field */}
                  {showAddFieldModal && (
                    <div className="p-4 rounded-2xl bg-white border-2 border-rose-300 shadow-lg space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900">
                          تعریف فیلد ویژگی جدید برای {activeCategoryObject?.title || ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddFieldModal(false)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateField} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              عنوان فارسی فیلد (مثال: رنگ بدنه، متراژ، گارانتی)
                            </label>
                            <input
                              type="text"
                              value={newFieldLabel}
                              onChange={e => setNewFieldLabel(e.target.value)}
                              placeholder="عنوان فیلد..."
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              شناسه سیستمی (انگلیسی)
                            </label>
                            <input
                              type="text"
                              value={newFieldName}
                              onChange={e => setNewFieldName(e.target.value)}
                              placeholder="مثال: body_color یا area"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              نوع داده فیلد
                            </label>
                            <select
                              value={newFieldType}
                              onChange={e => setNewFieldType(e.target.value as FieldType)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500"
                            >
                              <option value="text">متن ساده (Text)</option>
                              <option value="number">عدد (Number)</option>
                              <option value="select">انتخابی از لیست (Select)</option>
                              <option value="boolean">بله/خیر (Checkbox)</option>
                              <option value="price">مبلغ و قیمت (Price)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              واحد اندازه‌گیری (اختیاری)
                            </label>
                            <input
                              type="text"
                              value={newFieldUnit}
                              onChange={e => setNewFieldUnit(e.target.value)}
                              placeholder="مثال: کیلومتر، متر مربع، ماه"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500"
                            />
                          </div>

                          <div className="flex items-center gap-4 pt-5">
                            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newFieldRequired}
                                onChange={e => setNewFieldRequired(e.target.checked)}
                                className="rounded text-rose-600 focus:ring-rose-500"
                              />
                              <span>فیلد اجباری باشد</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newFieldShowInCard}
                                onChange={e => setNewFieldShowInCard(e.target.checked)}
                                className="rounded text-rose-600 focus:ring-rose-500"
                              />
                              <span>نمایش در کارت آگهی</span>
                            </label>
                          </div>
                        </div>

                        {newFieldType === 'select' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              گزینه‌های لیست (با کاما یا ویرگول جدا کنید)
                            </label>
                            <input
                              type="text"
                              value={newFieldOptionsStr}
                              onChange={e => setNewFieldOptionsStr(e.target.value)}
                              placeholder="مثال: اتوماتیک، دستی، نیمه اتوماتیک"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500"
                            />
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddFieldModal(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs"
                          >
                            ذخیره و ایجاد فیلد
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: AD POSTING POLICIES & QUOTAS MANAGEMENT */}
          {activeTab === 'AD_POLICIES' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Box */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900/40 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                    <span className="font-extrabold text-sm sm:text-base">مدیریت قوانین و سهمیه‌بندی ثبت آگهی پرسنل</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    جهت حفظ انضباط سازمانی، جلوگیری از ثبت انبوه یا هرزنامه و ایجاد فرصت برابر برای تمامی همکاران، می‌توانید سقف تعداد آگهی در هر ماه شمسی، تعداد آگهی‌های همزمان فعال، سهمیه نشان فوری و استثنائات را پیکربندی نمایید.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {policySavedNotice && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                      <CheckCircle className="w-4 h-4" />
                      <span>قوانین با موفقیت ذخیره شد</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSavePolicySubmit()}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>ذخیره تغییرات سهمیه‌ها</span>
                  </button>
                </div>
              </div>

              {/* Master Activation Toggle Switch */}
              <div className={`p-4 rounded-2xl border transition-all ${
                policyEnabled
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      policyEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          فعال‌سازی سراسری سامانه سهمیه‌بندی و محدودیت‌ها
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          policyEnabled
                            ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {policyEnabled ? 'فعال و جاری' : 'غیرفعال (ثبت نامحدود)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        در صورت غیرفعال بودن، محدودیت‌های ماهانه و سقف همزمان برای کاربران بررسی نخواهد شد.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyEnabled}
                      onChange={e => setPolicyEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* User Ad Violation Reporting Master Toggle */}
              <div className={`p-4 rounded-2xl border transition-all ${
                allowUserReporting
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      allowUserReporting ? 'bg-rose-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Flag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          امکان گزارش تخلف آگهی توسط کاربران (نظارت همگانی)
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          allowUserReporting
                            ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {allowUserReporting ? 'فعال (کاربران می‌توانند گزارش ثبت کنند)' : 'غیرفعال (امکان گزارش مسدود است)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        در صورت فعال بودن، کاربران در صفحه جزئیات آگهی گزینه «گزارش مشکل یا تخلف این آگهی» را خواهند دید و می‌توانند موارد مغایر با قوانین، کلاهبرداری یا فروخته شده را به مدیر گزارش دهند. با غیرفعال‌سازی، این قابلیت پنهان می‌شود.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowUserReporting}
                      onChange={e => setAllowUserReporting(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Core Limits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Monthly Solar Quota */}
                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">سقف در هر ماه شمسی</span>
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMaxMonthlyAds(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={maxMonthlyAds}
                      onChange={e => setMaxMonthlyAds(Math.max(1, Number(e.target.value)))}
                      className="w-20 text-center font-bold font-mono text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-1 text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setMaxMonthlyAds(prev => Math.min(100, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    هر کارمند در طول یک ماه تقویم شمسی (مثلاً مهر ماه) حداکثر این تعداد آگهی می‌تواند ثبت کند. سهمیه در اول ماه بعد تمدید می‌گردد.
                  </p>
                </div>

                {/* 2. Concurrent Active Ads */}
                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">سقف آگهی همزمان فعال</span>
                    <Layers className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMaxActiveAds(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={maxActiveAds}
                      onChange={e => setMaxActiveAds(Math.max(1, Number(e.target.value)))}
                      className="w-20 text-center font-bold font-mono text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-1 text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setMaxActiveAds(prev => Math.min(50, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    حداکثر تعداد آگهی‌های همزمان کاربر که در وضعیت «تایید شده» یا «در انتظار» قرار دارند. مانع از انباشت آگهی‌های بیهوده می‌شود.
                  </p>
                </div>

                {/* 3. Urgent Badges per Month */}
                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">سقف نشان فوری در ماه</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMaxUrgentBadges(prev => Math.max(0, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={maxUrgentBadges}
                      onChange={e => setMaxUrgentBadges(Math.max(0, Number(e.target.value)))}
                      className="w-20 text-center font-bold font-mono text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-1 text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setMaxUrgentBadges(prev => Math.min(20, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    حداکثر دفعاتی که کاربر می‌تواند در یک ماه شمسی تقاضای نشان متمایز و قرارگیری آگهی به عنوان فوری در صدر تابلوی اعلانات را ثبت کند.
                  </p>
                </div>

                {/* 4. Cool-down Period */}
                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">فاصله بین دو ثبت متوالی</span>
                    <Clock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="pt-1">
                    <select
                      value={coolDownHours}
                      onChange={e => setCoolDownHours(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none"
                    >
                      <option value={0}>بدون وقفه (بلافاصله مجاز)</option>
                      <option value={24}>۱ روز فاصله (۲۴ ساعت)</option>
                      <option value={48}>۲ روز فاصله (۴۸ ساعت)</option>
                      <option value={72}>۳ روز فاصله (۷۲ ساعت)</option>
                      <option value={96}>۴ روز فاصله</option>
                      <option value={120}>۵ روز فاصله</option>
                      <option value={144}>۶ روز فاصله</option>
                      <option value={168}>۷ روز فاصله (۱ هفته)</option>
                      <option value={192}>۸ روز فاصله</option>
                      <option value={216}>۹ روز فاصله</option>
                      <option value={240}>۱۰ روز فاصله</option>
                      <option value={264}>۱۱ روز فاصله</option>
                      <option value={288}>۱۲ روز فاصله</option>
                      <option value={312}>۱۳ روز فاصله</option>
                      <option value={336}>۱۴ روز فاصله (۲ هفته)</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    فاصله زمانی اجباری بین ارسال دو آگهی توسط یک کاربر، جهت جلوگیری از رفتارهای ربات‌گونه یا ارسال رگباری آگهی‌ها در سازمان.
                  </p>
                </div>
              </div>

              {/* Exceptions & Role Overrides */}
              <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>معافیت‌های دسترسی سازمانی و حدود متن</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bypassAdmins}
                      onChange={e => setBypassAdmins(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        معافیت مدیران سیستم و مدیران دسته‌ها از سهمیه‌ها
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        کاربران با نقش مدیر ارشد یا مدیر دسته‌بندی می‌توانند جهت امور سازمانی، بدون سقف ماهانه آگهی ثبت کنند.
                      </span>
                    </div>
                  </label>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      محدودیت کاراکتر عنوان آگهی
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">حداقل:</span>
                      <input
                        type="number"
                        min={3}
                        max={20}
                        value={minTitleLen}
                        onChange={e => setMinTitleLen(Number(e.target.value))}
                        className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold"
                      />
                      <span className="text-slate-500 mr-2">حداکثر:</span>
                      <input
                        type="number"
                        min={30}
                        max={200}
                        value={maxTitleLen}
                        onChange={e => setMaxTitleLen(Number(e.target.value))}
                        className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-400">کاراکتر</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Quotas per User (Special Employee Exemptions) */}
              <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>سهمیه‌های اختصاصی برای پرسنل یا واحدهای خاص (Custom User Quotas)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      در صورتی که برخی از همکاران (مانند واحد املاک، پشتیبانی ناوگان، رفاهی یا تدارکات) نیاز به ثبت آگهی بیش از سقف عمومی دارند، می‌توانید سهمیه ماهانه مجزایی به آن‌ها اختصاص دهید.
                    </p>
                  </div>
                </div>

                {/* Assignment Form */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      انتخاب همکار:
                    </label>
                    <select
                      value={quotaTargetUserId}
                      onChange={e => setQuotaTargetUserId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none"
                    >
                      <option value="">انتخاب از فهرست کاربران...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.displayName} ({u.username}) - {u.department || 'عمومی'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-36">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      سهمیه در ماه شمسی:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={customQuotaInputVal}
                      onChange={e => setCustomQuotaInputVal(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none font-mono text-center"
                    />
                  </div>

                  <div className="self-end">
                    <button
                      type="button"
                      disabled={!quotaTargetUserId}
                      onClick={() => {
                        if (quotaTargetUserId) {
                          handleAssignUserCustomQuota(quotaTargetUserId, customQuotaInputVal);
                          setQuotaTargetUserId('');
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      ثبت سهمیه اختصاصی
                    </button>
                  </div>
                </div>

                {/* Table of Custom Quotas */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">نام و مشخصات همکار</th>
                        <th className="py-2.5 px-3">واحد سازمانی</th>
                        <th className="py-2.5 px-3">نقش</th>
                        <th className="py-2.5 px-3 text-center">سهمیه ماهانه اختصاصی</th>
                        <th className="py-2.5 px-3 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {Object.keys(adPolicy.userCustomQuotas || {}).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-xs text-slate-400">
                            در حال حاضر هیچ کاربر دارای سهمیه اختصاصی نیست و تمام پرسنل از سقف عمومی ({toPersianDigits(adPolicy.maxAdsPerSolarMonth)} آگهی در ماه) استفاده می‌کنند.
                          </td>
                        </tr>
                      ) : (
                        Object.entries(adPolicy.userCustomQuotas || {}).map(([uId, quotaNum]) => {
                          const target = users.find(u => u.id === uId);
                          return (
                            <tr key={uId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-bold">
                                {target ? `${target.displayName} (${target.username})` : uId}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                                {target?.department || 'نامشخص'}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] px-2 py-0.5 rounded font-mono">
                                  {target?.role || 'USER'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-900/60">
                                  {toPersianDigits(quotaNum)} آگهی در ماه
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleAssignUserCustomQuota(uId, null)}
                                  className="text-rose-600 hover:text-rose-700 text-[11px] font-bold hover:underline"
                                  title="حذف سهمیه اختصاصی و بازگشت به سهمیه عمومی"
                                >
                                  بازگشت به سقف عمومی
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVE DIRECTORY & LDAP CONFIG (Key prompt requirement) */}
          {activeTab === 'ACTIVE_DIRECTORY' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-rose-400" />
                    <span className="font-extrabold text-sm sm:text-base">پیکربندی کنترلر دامنه اکتیو دایرکتوری ویندوز (Active Directory)</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        adConfig.isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${adConfig.isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{adConfig.isConnected ? 'متصل و تایید شده' : 'قطع ارتباط / تست نشده'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    کاربران با ورود نام کاربری ویندوز (sAMAccountName) و کلمه عبور شبکه، مستقیماً از طریق سرویس دایرکتوری احراز هویت شده و اطلاعات واحد سازمانی و تلفن آن‌ها همگام می‌گردد.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestAD}
                  disabled={isTestingAD}
                  className="shrink-0 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingAD ? 'animate-spin' : ''}`} />
                  <span>{isTestingAD ? 'در حال برقراری ارتباط با دامین...' : 'تست اتصال زنده به Active Directory'}</span>
                </button>
              </div>

              {adTestResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                    adTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {adTestResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>
                      نتیجه تست برقراری ارتباط{' '}
                      {adTestResult.latencyMs > 0 && `(زمان پاسخ: ${toPersianDigits(adTestResult.latencyMs)} میلی‌ثانیه)`}:
                    </span>
                  </div>
                  <p>{adTestResult.message}</p>
                </div>
              )}

              {/* Form Settings */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
                  تنظیمات سرور LDAP / Domain Controller
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      آدرس سرور اکتیو دایرکتوری (Host / IP)
                    </label>
                    <input
                      type="text"
                      value={adHost}
                      onChange={e => setAdHost(e.target.value)}
                      placeholder="192.168.1.10 یا dc.company.local"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      پورت اتصال LDAP (389 عادی / 636 LDAPS)
                    </label>
                    <input
                      type="number"
                      value={adPort}
                      onChange={e => setAdPort(Number(e.target.value))}
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      نام دامنه ویندوز (NetBIOS Domain)
                    </label>
                    <input
                      type="text"
                      value={adDomain}
                      onChange={e => setAdDomain(e.target.value.toUpperCase())}
                      placeholder="CORP"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      مسیر پایه دایرکتوری (Base DN)
                    </label>
                    <input
                      type="text"
                      value={adBaseDn}
                      onChange={e => setAdBaseDn(e.target.value)}
                      placeholder="DC=company,DC=local"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      حساب سرویس اتصال (Bind DN یا sAMAccountName)
                    </label>
                    <input
                      type="text"
                      value={adBindUser}
                      onChange={e => setAdBindUser(e.target.value)}
                      placeholder="CN=svc-ldap,OU=Services,DC=company,DC=local یا svc-ldap"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      رمز عبور حساب سرویس (Bind Password)
                    </label>
                    <input
                      type="password"
                      value={adBindPassword}
                      onChange={e => setAdBindPassword(e.target.value)}
                      placeholder="کلمه عبور حساب سرویس برای جستجو در دایرکتوری"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adUseSsl}
                        onChange={e => setAdUseSsl(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300">استفاده از پروتکل امن LDAPS (SSL/TLS)</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      گروه امنیتی مدیران ارشد (Admin Group DN)
                    </label>
                    <input
                      type="text"
                      value={adGroupAdmin}
                      onChange={e => setAdGroupAdmin(e.target.value)}
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      گروه امنیتی مدیران دسته‌ها (Managers Group DN)
                    </label>
                    <input
                      type="text"
                      value={adGroupManager}
                      onChange={e => setAdGroupManager(e.target.value)}
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  {adConfigSaved && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                      <CheckCircle className="w-4 h-4" />
                      <span>تنظیمات اکتیودایرکتوری با موفقیت ذخیره شد</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onSaveADConfig({
                        serverHost: adHost.trim(),
                        port: Number(adPort) || 389,
                        useSsl: adUseSsl,
                        domainName: adDomain.trim(),
                        baseDn: adBaseDn.trim(),
                        bindUserDn: adBindUser.trim(),
                        bindPasswordMasked: adBindPassword.trim(),
                        groupAdminDn: adGroupAdmin.trim(),
                        groupManagerDn: adGroupManager.trim(),
                        autoCreateUser: adAutoCreate,
                      });
                      setAdConfigSaved(true);
                      setTimeout(() => setAdConfigSaved(false), 3000);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                  >
                    ذخیره تنظیمات دایرکتوری
                  </button>
                </div>

                {/* Emergency Local Admin Password Section */}
                <div className="mt-5 p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>کلمه عبور ورود محلی و اضطراری مدیر سیستم (admin.system / admin)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    این رمز عبور جهت ورود اختصاصی مدیر سیستم در زمان‌هایی که شبکه با سرور اکتیو دایرکتوری قطع است یا سرور دامین در دسترس نیست، استفاده می‌شود. در حالت عادی، رمز عبور اصلی از اکتیو دایرکتوری ویندوز سرور استعلام می‌گردد.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <div className="relative flex-1 w-full">
                      <input
                        type={showLocalAdminPass ? 'text' : 'password'}
                        value={localAdminPass}
                        onChange={e => setLocalAdminPass(e.target.value)}
                        placeholder="کلمه عبور جدید مدیر (حداقل ۴ کاراکتر)..."
                        dir="ltr"
                        className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLocalAdminPass(!showLocalAdminPass)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showLocalAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!localAdminPass.trim() || localAdminPass.trim().length < 4) {
                          alert('کلمه عبور باید حداقل ۴ کاراکتر باشد.');
                          return;
                        }
                        const ok = storageService.setAdminLocalPassword(localAdminPass.trim());
                        if (ok) {
                          setLocalAdminPassSaved(true);
                          setTimeout(() => setLocalAdminPassSaved(false), 3000);
                        }
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
                    >
                      ذخیره کلمه عبور مدیر
                    </button>
                  </div>
                  {localAdminPassSaved && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>کلمه عبور اختصاصی مدیر سیستم با موفقیت ثبت و فعال شد.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIVE DIRECTORY USERS & CATEGORY MANAGERS ASSIGNMENT TABLE */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        پرسنل سازمانی Active Directory و انتصاب مدیران دسته‌بندی‌ها
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {toPersianDigits(users.length)} کاربر دایرکتوری
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      مشاهده اطلاعات حساب‌های کاربری ویندوز سرور و انتصاب مستقیم پرسنل به عنوان مدیر ناظر بر دسته‌بندی‌ها
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSyncAD}
                      disabled={isSyncingAD}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAD ? 'animate-spin' : ''}`} />
                      <span>{isSyncingAD ? 'در حال همگام‌سازی...' : 'همگام‌سازی کاربران از AD'}</span>
                    </button>
                  </div>
                </div>

                {adSyncNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{adSyncNotice}</span>
                  </div>
                )}

                {adTabQuickAssignNotice && (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{adTabQuickAssignNotice}</span>
                  </div>
                )}

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={adTabUserSearch}
                      onChange={e => setAdTabUserSearch(e.target.value)}
                      placeholder="جستجو در نام کاربر، نام کاربری دامین (sAMAccountName)، واحد سازمانی یا گروه AD..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    {adTabUserSearch && (
                      <button
                        type="button"
                        onClick={() => setAdTabUserSearch('')}
                        className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={adTabRoleFilter}
                    onChange={e => setAdTabRoleFilter(e.target.value as any)}
                    className="w-full sm:w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none font-medium"
                  >
                    <option value="ALL">همه نقش‌ها و کاربران ({toPersianDigits(users.length)})</option>
                    <option value="CATEGORY_MANAGER">مدیران دسته‌ها ({toPersianDigits(users.filter(u => u.role === 'CATEGORY_MANAGER').length)})</option>
                    <option value="SUPER_ADMIN">مدیران ارشد ({toPersianDigits(users.filter(u => u.role === 'SUPER_ADMIN').length)})</option>
                    <option value="USER">کاربران عادی ({toPersianDigits(users.filter(u => u.role === 'USER').length)})</option>
                  </select>
                </div>

                {/* AD Users Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">کاربر و واحد سازمانی</th>
                        <th className="py-2.5 px-3">نام کاربری Active Directory</th>
                        <th className="py-2.5 px-3">گروه‌های امنیتی دامین</th>
                        <th className="py-2.5 px-3">نقش فعلی</th>
                        <th className="py-2.5 px-3">دسته‌بندی تحت مدیریت</th>
                        <th className="py-2.5 px-3 text-center">انتصاب / تغییر مدیریت دسته</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {users
                        .filter(u => {
                          if (adTabRoleFilter !== 'ALL' && u.role !== adTabRoleFilter) return false;
                          if (!adTabUserSearch.trim()) return true;
                          const q = adTabUserSearch.toLowerCase().trim();
                          const inName = (u.displayName || '').toLowerCase().includes(q);
                          const inUser = (u.username || '').toLowerCase().includes(q);
                          const inDept = (u.department || '').toLowerCase().includes(q);
                          const inGroups = (u.adGroups || []).some(g => g.toLowerCase().includes(q));
                          return inName || inUser || inDept || inGroups;
                        })
                        .map(u => {
                          const managed = categories.filter(c => c.managerId === u.id);
                          return (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={typeof u.avatar === 'string' ? u.avatar : (u.avatar as any)?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-slate-100">{u.displayName}</div>
                                    <div className="text-[10px] text-slate-400">{u.department}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300 text-[11px]" dir="ltr">
                                {u.username}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1 flex-wrap max-w-xs">
                                  {(u.adGroups || []).slice(0, 3).map((g, i) => (
                                    <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                                      {g}
                                    </span>
                                  ))}
                                  {(u.adGroups || []).length > 3 && (
                                    <span className="text-[9px] text-slate-400">+{toPersianDigits((u.adGroups || []).length - 3)}</span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    u.role === 'SUPER_ADMIN'
                                      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                                      : u.role === 'CATEGORY_MANAGER'
                                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {u.role === 'SUPER_ADMIN'
                                    ? 'مدیر ارشد'
                                    : u.role === 'CATEGORY_MANAGER'
                                    ? 'مدیر دسته‌بندی'
                                    : 'کاربر دامین'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                {managed.length > 0 ? (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {managed.map(c => (
                                      <span
                                        key={c.id}
                                        className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                                      >
                                        <span>{c.title}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSaveCategory({
                                              id: c.id,
                                              managerId: '',
                                              managerName: 'تعیین نشده',
                                              managerDepartment: '',
                                            });
                                            setAdTabQuickAssignNotice(`مدیریت دسته‌بندی «${c.title}» از کاربر «${u.displayName}» لغو شد.`);
                                            setTimeout(() => setAdTabQuickAssignNotice(null), 3500);
                                          }}
                                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded p-0.5 transition cursor-pointer"
                                          title="لغو مدیریت این دسته‌بندی"
                                        >
                                          <X className="w-2.5 h-2.5" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">فاقد دسته‌بندی</span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <select
                                    defaultValue=""
                                    onChange={e => {
                                      const targetCatId = e.target.value;
                                      if (!targetCatId) return;
                                      const targetCat = categories.find(c => c.id === targetCatId);
                                      if (targetCat) {
                                        onSaveCategory({
                                          id: targetCat.id,
                                          managerId: u.id,
                                          managerName: u.displayName,
                                          managerDepartment: u.department,
                                        });
                                        setAdTabQuickAssignNotice(
                                          `کاربر «${u.displayName}» با موفقیت به عنوان مدیر دسته‌بندی «${targetCat.title}» تعیین شد.`
                                        );
                                        setTimeout(() => setAdTabQuickAssignNotice(null), 3500);
                                      }
                                      e.target.value = '';
                                    }}
                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-rose-400 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer max-w-[160px] truncate"
                                  >
                                    <option value="">انتصاب به دسته‌بندی...</option>
                                    {categories.map(c => (
                                      <option key={c.id} value={c.id}>
                                        {c.title} {c.managerId === u.id ? '✓ (مدیر فعلی)' : c.managerId ? `(${c.managerName})` : '(بدون مدیر)'}
                                      </option>
                                    ))}
                                  </select>

                                  {onEditUserProfile && (
                                    <button
                                      type="button"
                                      onClick={() => onEditUserProfile(u)}
                                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60"
                                      title="ویرایش نقش و انتصاب چند دسته‌بندی به طور همزمان"
                                    >
                                      <UserCog className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MYSQL LOCAL SERVER & NUXT 3 GUIDE (Key prompt requirement) */}
          {activeTab === 'MYSQL_LOCAL' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-950 text-white rounded-2xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span className="font-extrabold text-sm">پایگاه داده محلی MySQL و استقرار بک‌اند</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    تمامی اطلاعات روی سرور داخلی سازمان در دیتابیس MySQL با انکودینگ utf8mb4_persian_ci نگهداری می‌شود. اسکریپت ساخت جدول‌ها و معماری Nuxt 3 در ادامه آماده است.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleTestMySQL}
                    disabled={isTestingMySQL}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingMySQL ? 'animate-spin' : ''}`} />
                    <span>تست وضعیت MySQL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSchemaSql}
                    className="flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود فایل schema.sql</span>
                  </button>
                </div>
              </div>

              {mysqlTestResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-3 ${
                    mysqlTestResult.connected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {mysqlTestResult.connected ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">
                          {mysqlTestResult.connected ? 'اتصال واقعی به دیتابیس برقرار شد' : 'عدم برقراری اتصال به MySQL'}
                        </span>
                        {mysqlTestResult.latencyMs > 0 && (
                          <span className="font-mono text-[11px] opacity-80">
                            پینگ: {toPersianDigits(mysqlTestResult.latencyMs)}ms
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{mysqlTestResult.message}</p>
                      {mysqlTestResult.tip && (
                        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-current/10 font-sans text-[11px] text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-rose-700 dark:text-rose-400 ml-1">راهنمای رفع مشکل:</span>
                          {mysqlTestResult.tip}
                        </div>
                      )}
                      {mysqlTestResult.code && (
                        <div className="text-[10px] font-mono opacity-70">
                          کد خطا: {mysqlTestResult.code}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Auto Initialize Schema button if DB is missing or tables are missing */}
                  {(!mysqlTestResult.connected || (mysqlTestResult.missingTables && mysqlTestResult.missingTables.length > 0)) && onInitMySQLSchema && (
                    <div className="pt-2 border-t border-rose-200 dark:border-rose-800/60 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        آیا می‌خواهید دیتابیس و تمام جداول به صورت خودکار روی سرور ساخته شوند؟
                      </span>
                      <button
                        type="button"
                        onClick={handleInitDbSchema}
                        disabled={isInitializingDb}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isInitializingDb ? 'animate-spin' : ''}`} />
                        <span>{isInitializingDb ? 'در حال ایجاد جداول...' : 'ساخت خودکار دیتابیس و جداول'}</span>
                      </button>
                    </div>
                  )}

                  {initDbResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-bold ${
                        initDbResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {initDbResult.message}
                    </div>
                  )}
                </div>
              )}

              {/* Status Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <span className="text-slate-500 dark:text-slate-400">میزبان (Host):</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{mysqlConfig.host}:{mysqlConfig.port}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <span className="text-slate-500 dark:text-slate-400">نام دیتابیس:</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{mysqlConfig.database}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <span className="text-slate-500 dark:text-slate-400">کاراکترست (Charset):</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{mysqlConfig.charset}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <span className="text-slate-500 dark:text-slate-400">وضعیت اتصال:</span>
                  <div className="mt-0.5 flex items-center gap-1.5 font-bold">
                    {mysqlTestResult?.connected ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-600 dark:text-emerald-400">متصل و فعال</span>
                      </>
                    ) : mysqlTestResult ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-rose-600 dark:text-rose-400">قطع ارتباط</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400">نیاز به تست اتصال</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Database Records & Synchronization Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-blue-200/80 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>همگام‌سازی و خواندن مستقیم اطلاعات از MySQL</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      داده‌های سامانه (آگهی‌ها، دسته‌بندی‌ها و کاربران) به صورت دوطرفه با پایگاه داده سازمان همگام می‌شوند.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSyncFromDb}
                      disabled={isSyncingFromMySQL}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
                      title="فراخوانی و نمایش رکوردهای موجود در MySQL"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFromMySQL ? 'animate-spin' : ''}`} />
                      <span>{isSyncingFromMySQL ? 'در حال فراخوانی...' : 'فراخوانی از MySQL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSeedToDb}
                      disabled={isSeedingToMySQL}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
                      title="انتقال داده‌های اولیه به دیتابیس در صورت خالی بودن جداول"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isSeedingToMySQL ? 'animate-spin' : ''}`} />
                      <span>{isSeedingToMySQL ? 'در حال انتقال...' : 'انتقال داده‌ها به MySQL'}</span>
                    </button>
                  </div>
                </div>

                {/* Database Row Count Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-blue-200/60 dark:border-slate-700/60">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">آگهی‌های ثبت‌شده در دیتابیس</span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {mysqlStats !== null ? toPersianDigits(mysqlStats.adsCount) : toPersianDigits(ads.length)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">دسته‌بندی‌ها در دیتابیس</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {mysqlStats !== null ? toPersianDigits(mysqlStats.categoriesCount) : toPersianDigits(categories.length)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">کاربران سازمانی</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {mysqlStats !== null ? toPersianDigits(mysqlStats.usersCount) : toPersianDigits(users.length)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">لاگ‌های نظارتی (Audit)</span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {mysqlStats !== null ? toPersianDigits(mysqlStats.auditLogsCount) : toPersianDigits(auditLogs.length)}
                    </span>
                  </div>
                </div>

                {syncNotice && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      syncNotice.success
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                    }`}
                  >
                    {syncNotice.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{syncNotice.message}</span>
                  </div>
                )}
              </div>

              {/* Code Blocks for MySQL Schema and Nuxt Guide */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      اسکریپت کامل DDL جداول MySQL (schema.sql):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(MYSQL_SCHEMA_SQL);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2000);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'کپی شد' : 'کپی اسکریپت SQL'}</span>
                    </button>
                  </div>
                  <pre
                    className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 p-3 bg-slate-950 rounded-xl"
                    dir="ltr"
                  >
                    {MYSQL_SCHEMA_SQL}
                  </pre>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      راهنمای اتصال Nuxt 3 و Nitro به MySQL و Active Directory:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(NUXT_SERVER_CODE_GUIDE);
                        setCopiedNuxt(true);
                        setTimeout(() => setCopiedNuxt(false), 2000);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedNuxt ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNuxt ? 'کپی شد' : 'کپی کدها'}</span>
                    </button>
                  </div>
                  <pre
                    className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 p-3 bg-slate-950 rounded-xl"
                    dir="ltr"
                  >
                    {NUXT_SERVER_CODE_GUIDE}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>ثبت وقایع احراز هویت اکتیو دایرکتوری، تغییرات فیلدها و تایید آگهی‌ها به منظور نظارت و امنیت</span>
                <span className="font-mono font-bold text-slate-800">{toPersianDigits(auditLogs.length)} رویداد ثبت شده</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">نوع عملیات</th>
                        <th className="py-2.5 px-4">کاربر مجری</th>
                        <th className="py-2.5 px-4">شرح رویداد</th>
                        <th className="py-2.5 px-3 font-mono">IP</th>
                        <th className="py-2.5 px-4">زمان ثبت (شمسی)</th>
                        <th className="py-2.5 px-3 text-center">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800 text-[11px]">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-900">{log.userName}</td>
                          <td className="py-2.5 px-4 text-slate-600">{log.details}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500" dir="ltr">{log.ipAddress}</td>
                          <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{log.timestampShamsi}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                log.status === 'SUCCESS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.status === 'WARNING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {log.status === 'SUCCESS' ? 'موفق' : log.status === 'WARNING' ? 'هشدار' : 'خطا'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SYSTEM TEXTS CMS (Dynamic Non-Hardcoded Strings) */}
          {activeTab === 'SYSTEM_TEXTS' && (
            <SystemTextsManager />
          )}
        </div>
      </div>

      {/* Edit Ad Modal for Admin */}
      {editingAd && (
        <EditAdModal
          ad={editingAd}
          categories={categories}
          onClose={() => setEditingAd(null)}
          onSave={(adId, updates) => {
            if (onUpdateAd) {
              onUpdateAd(adId, updates);
            }
            setEditingAd(null);
          }}
        />
      )}

      {/* Category Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCategoryToDelete(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 z-10 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">حذف دسته‌بندی</h4>
                <p className="text-xs text-slate-500 mt-0.5">دسته‌بندی «{categoryToDelete?.title || ''}»</p>
              </div>
            </div>

            {categoryToDelete && ads.filter(a => a.categoryId === categoryToDelete.id).length > 0 ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    توجه: تعداد {toPersianDigits(ads.filter(a => a.categoryId === categoryToDelete.id).length)} آگهی در این دسته ثبت شده است!
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  در صورت حذف، آگهی‌های این دسته محفوظ مانده و به دسته‌بندی پیش‌فرض منتقل می‌شوند و فیلدهای ویژگی این دسته حذف خواهند شد.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                آیا از حذف دسته‌بندی «<strong className="text-slate-900 font-bold">{categoryToDelete?.title || ''}</strong>» و کلیه مشخصات و فیلدهای ویژگی اختصاصی آن اطمینان کامل دارید؟ این عملیات غیرقابل بازگشت است.
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف قطعی دسته‌بندی</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Delete Confirmation Modal */}
      {adToDeleteId && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setAdToDeleteId(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 z-10 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">حذف کامل آگهی</h4>
                <p className="text-xs text-slate-500 mt-0.5">عملیات حذف مستقیم توسط مدیر</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              آیا از حذف کامل این آگهی از پایگاه داده اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdToDeleteId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAd}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف قطعی</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Action Prompt Modal */}
      {reportActionModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReportActionModal(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 z-10 space-y-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                reportActionModal.action === 'REMOVE_AD'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : reportActionModal.action === 'RESOLVE'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {reportActionModal.action === 'REMOVE_AD' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : reportActionModal.action === 'RESOLVE' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {reportActionModal.action === 'REMOVE_AD'
                    ? 'حذف آگهی متخلف و اقدام انضباطی'
                    : reportActionModal.action === 'RESOLVE'
                    ? 'تایید و مختومه کردن گزارش'
                    : 'رد گزارش تخلف'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  آگهی: {reportActionModal.report.adTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                یادداشت یا توضیحات مدیر (اختیاری):
              </label>
              <textarea
                value={reportAdminNoteInput}
                onChange={e => setReportAdminNoteInput(e.target.value)}
                placeholder="علت تصمیم یا پیام مدیر برای بایگانی در لاگ سیستم..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReportActionModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  onResolveAdReport?.(
                    reportActionModal.report.id,
                    reportActionModal.action,
                    reportAdminNoteInput.trim()
                  );
                  setReportActionModal(null);
                  setReportAdminNoteInput('');
                }}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  reportActionModal.action === 'REMOVE_AD'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : reportActionModal.action === 'RESOLVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>ثبت و اعمال تصمیم</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Delete Modal */}
      {reportToDeleteId && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReportToDeleteId(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 z-10 space-y-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">حذف رکورد گزارش</h4>
                <p className="text-xs text-slate-500 mt-0.5">پاکسازی این رکورد از بایگانی</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              آیا از حذف این گزارش از بایگانی نظارتی اطمینان دارید؟
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReportToDeleteId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAdReport?.(reportToDeleteId);
                  setReportToDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف گزارش</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Report Reason Modal */}
      {(isAddingReason || editingReason) && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsAddingReason(false);
              setEditingReason(null);
            }}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 z-10 space-y-5 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingReason ? 'ویرایش گزینه علت گزارش' : 'افزودن گزینه جدید علت گزارش'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ذخیره‌سازی مستقیم در پایگاه داده سرور (بدون وابستگی به localStorage)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddingReason(false);
                  setEditingReason(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reasonFormError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{reasonFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveReasonSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  عنوان دلیل گزارش <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reasonFormLabel}
                  onChange={e => setReasonFormLabel(e.target.value)}
                  placeholder="مثال: نقض شئون اداری و سازمانی، قیمت‌گذاری غیرواقعی..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  توضیحات راهنما برای کاربران هنگام ثبت گزارش:
                </label>
                <textarea
                  value={reasonFormDescription}
                  onChange={e => setReasonFormDescription(e.target.value)}
                  placeholder="توضیح دهید کاربر چه زمانی باید این گزینه را انتخاب کند..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    شناسه سیستمی (انگلیسی):
                  </label>
                  <input
                    type="text"
                    value={reasonFormId}
                    onChange={e => setReasonFormId(e.target.value)}
                    placeholder="REASON_CODE"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none"
                    disabled={!!editingReason}
                  />
                  <p className="text-[10px] text-slate-400">
                    {editingReason ? 'شناسه پس از ایجاد قابل تغییر نیست.' : 'در صورت خالی ماندن به صورت خودکار تولید می‌شود.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    ترتیب نمایش در فرم (اولویت عددی):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={reasonFormOrder}
                    onChange={e => setReasonFormOrder(Number(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    اعداد کوچک‌تر بالاتر نمایش داده می‌شوند.
                  </p>
                </div>
              </div>

              {/* Status Switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">وضعیت نمایش در فرم گزارش</div>
                  <div className="text-[11px] text-slate-500">
                    در صورت غیرفعال بودن، این گزینه در پنجره گزارش آگهی به کاربران نمایش داده نمی‌شود.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={reasonFormIsActive}
                    onChange={e => setReasonFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Live Preview Card */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-slate-500 font-bold block">
                  پیش‌نمایش گزینه در فرم گزارش کاربران:
                </span>
                <div className="p-3 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {reasonFormLabel.trim() || 'عنوان دلیل گزارش'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {reasonFormDescription.trim() || 'توضیحات راهنما برای کاربران'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingReason(false);
                    setEditingReason(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>ذخیره در پایگاه داده</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Reason Confirmation Modal */}
      {reasonToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReasonToDelete(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 z-10 space-y-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">حذف گزینه دلیل گزارش</h4>
                <p className="text-xs text-slate-500 mt-0.5">حذف دائمی از پایگاه داده</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                آیا از حذف گزینه <strong>«{reasonToDelete.label}»</strong> از فهرست دلایل گزارش در پایگاه داده اطمینان دارید؟
              </p>

              {(() => {
                const count = (adReports || []).filter(r => r.reason === reasonToDelete.id).length;
                if (count > 0) {
                  return (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                      <strong>توجه:</strong> این گزینه در {toPersianDigits(count)} گزارش ثبت‌شده قبلی انتخاب شده است. پس از حذف، عنوان آن در گزارش‌های قبلی حفظ می‌شود اما کاربران جدید دیگر قادر به انتخاب آن نخواهند بود.
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReasonToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReason}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف از دیتابیس</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
