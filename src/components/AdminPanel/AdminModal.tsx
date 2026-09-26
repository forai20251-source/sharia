import React, { useState } from 'react';
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
} from '../../types';
import { EditAdModal } from '../EditAdModal';
import { toPersianDigits, formatPersianNumber, formatJalaliDate } from '../../utils/jalali';
import { MYSQL_SCHEMA_SQL, NUXT_SERVER_CODE_GUIDE } from '../../data/mysqlSchema';

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

export const PRESET_CATEGORY_IMAGES = [
  { label: 'خودرو سواری', categoryTag: 'وسایل نقلیه', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80' },
  { label: 'خودرو مشکی لوکس', categoryTag: 'وسایل نقلیه', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80' },
  { label: 'آپارتمان مسکونی', categoryTag: 'املاک', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80' },
  { label: 'دفتر کار و اتاق جلسات', categoryTag: 'املاک', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80' },
  { label: 'لپ‌تاپ مهندسی IT', categoryTag: 'دیجیتال', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
  { label: 'گوشی موبایل هوشمند', categoryTag: 'دیجیتال', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80' },
  { label: 'صندلی ارگونومیک اداری', categoryTag: 'اداری', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80' },
  { label: 'میز کار و ایستگاه اداری', categoryTag: 'اداری', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80' },
  { label: 'خدمات و هم‌پیمایی', categoryTag: 'خدمات', url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80' },
  { label: 'آموزش و یادگیری', categoryTag: 'خدمات', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80' },
  { label: 'تجهیزات و ابزار صنعتی', categoryTag: 'فنی', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
  { label: 'کتاب و اقلام فرهنگی', categoryTag: 'فرهنگی', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80' },
];

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
  onTestADConnection: () => { success: boolean; latencyMs: number; message: string; details: any };
  onTestMySQLConnection: () => { success: boolean; latencyMs: number; message: string };
  onUpdateAd?: (adId: string, updates: Partial<Ad>) => void;
  onEditUserProfile?: (user: User) => void;
}

type AdminTab =
  | 'ANALYTICS'
  | 'USER_REPORT'
  | 'MODERATION'
  | 'CATEGORIES'
  | 'ACTIVE_DIRECTORY'
  | 'MYSQL_LOCAL'
  | 'AUDIT_LOGS';

export const AdminModal: React.FC<AdminModalProps> = ({
  currentUser,
  users,
  categories,
  ads,
  adConfig,
  mysqlConfig,
  auditLogs,
  userPerformanceReport,
  onClose,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onSaveCategory,
  onDeleteCategory,
  onAddFieldToCategory,
  onDeleteCategoryField,
  onSaveADConfig,
  onTestADConnection,
  onTestMySQLConnection,
  onUpdateAd,
  onEditUserProfile,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ANALYTICS');

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
  const [mysqlTestResult, setMysqlTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [isTestingAD, setIsTestingAD] = useState(false);
  const [isTestingMySQL, setIsTestingMySQL] = useState(false);

  // Copied code feedback
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedNuxt, setCopiedNuxt] = useState(false);

  // In-app deletion confirmation states (avoid window.confirm in iframe)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [adToDeleteId, setAdToDeleteId] = useState<string | null>(null);
  const [adConfigSaved, setAdConfigSaved] = useState(false);

  // Export User Performance Report to CSV
  const handleExportCSV = () => {
    const headers = ['نام کاربر', 'نام کاربری ویندوز (AD)', 'واحد سازمانی', 'نقش', 'تعداد کل آگهی', 'تایید شده', 'در انتظار', 'رد شده', 'کل بازدیدها', 'آخرین فعالیت'];
    const rows = userPerformanceReport.map(r => [
      r.user.displayName,
      r.user.username,
      r.user.department,
      r.user.role,
      r.totalAds,
      r.approvedAds,
      r.pendingAds,
      r.rejectedAds,
      r.totalViews,
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

  const handleTestAD = () => {
    setIsTestingAD(true);
    setTimeout(() => {
      setAdTestResult(onTestADConnection());
      setIsTestingAD(false);
    }, 600);
  };

  const handleTestMySQL = () => {
    setIsTestingMySQL(true);
    setTimeout(() => {
      setMysqlTestResult(onTestMySQLConnection());
      setIsTestingMySQL(false);
    }, 400);
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

    const assignedMgr = users.find(u => u.id === catFormManagerId) || users[0] || currentUser;
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
        managerId: assignedMgr.id,
        managerName: assignedMgr.displayName,
        managerDepartment: assignedMgr.department,
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
        managerId: assignedMgr.id,
        managerName: assignedMgr.displayName,
        managerDepartment: assignedMgr.department,
        allowAutoApprove: catFormAutoApprove,
        defaultImage: catFormDefaultImage.trim() || undefined,
      });
    }

    setShowCategoryModal(false);
  };

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
                              src={ad.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80'}
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
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span className="text-slate-500">مدیر ناظر:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[90px] sm:max-w-none">
                                {cat.managerName}
                              </span>
                            </div>

                            <select
                              value={cat.managerId}
                              onChange={e => {
                                const newMgrId = e.target.value;
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
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium outline-none shrink-0"
                            >
                              {users.map(u => (
                                <option key={u.id} value={u.id}>
                                  {u.displayName} ({u.department})
                                </option>
                              ))}
                            </select>
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
                          <label className="block font-bold text-slate-700 mb-1">
                            مدیر ناظر دسته‌بندی
                          </label>
                          <select
                            value={catFormManagerId}
                            onChange={e => setCatFormManagerId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                          >
                            {users.map(u => (
                              <option key={u.id} value={u.id}>
                                {u.displayName} ({u.department} - {u.role === 'SUPER_ADMIN' ? 'مدیر ارشد' : u.role === 'CATEGORY_MANAGER' ? 'مدیر دسته' : 'کاربر'})
                              </option>
                            ))}
                          </select>
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
                              یا درج آدرس اینترنتی تصویر (URL):
                            </label>
                            <input
                              type="url"
                              value={catFormDefaultImage.startsWith('data:') ? '' : catFormDefaultImage}
                              onChange={e => setCatFormDefaultImage(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
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

              {/* Dynamic Field Builder for Selected Category */}
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

          {/* TAB 5: ACTIVE DIRECTORY & LDAP CONFIG (Key prompt requirement) */}
          {activeTab === 'ACTIVE_DIRECTORY' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-rose-400" />
                    <span className="font-extrabold text-sm">پیکربندی کنترلر دامنه اکتیو دایرکتوری ویندوز</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    کاربران با ورود نام کاربری ویندوز (sAMAccountName) و کلمه عبور شبکه، مستقیماً از طریق سرویس دایرکتوری احراز هویت شده و اطلاعات واحد سازمانی و تلفن آن‌ها همگام می‌گردد.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestAD}
                  disabled={isTestingAD}
                  className="shrink-0 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingAD ? 'animate-spin' : ''}`} />
                  <span>تست اتصال زنده به Active Directory</span>
                </button>
              </div>

              {adTestResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                    adTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>نتیجه تست برقراری ارتباط (زمان پاسخ: {toPersianDigits(adTestResult.latencyMs)} میلی‌ثانیه):</span>
                  </div>
                  <p>{adTestResult.message}</p>
                </div>
              )}

              {/* Form Settings */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                  تنظیمات سرور LDAP / Domain Controller
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      آدرس سرور اکتیو دایرکتوری (Host / IP)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.serverHost}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      پورت اتصال LDAP (389 یا 636 LDAPS)
                    </label>
                    <input
                      type="number"
                      defaultValue={adConfig.port}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      نام دامنه ویندوز (NetBIOS Domain)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.domainName}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      مسیر پایه دایرکتوری (Base DN)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.baseDn}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      حساب کاربری سرویس اتصال (Bind DN)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.bindUserDn}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      گروه امنیتی مدیران ارشد (Admin Group DN)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.groupAdminDn}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      گروه امنیتی مدیران دسته‌ها (Managers Group DN)
                    </label>
                    <input
                      type="text"
                      defaultValue={adConfig.groupManagerDn}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
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
                      onSaveADConfig({});
                      setAdConfigSaved(true);
                      setTimeout(() => setAdConfigSaved(false), 3000);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                  >
                    ذخیره تنظیمات دایرکتوری
                  </button>
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
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{mysqlTestResult.message} (پینگ سرور: {toPersianDigits(mysqlTestResult.latencyMs)} میلی‌ثانیه)</span>
                </div>
              )}

              {/* Status Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500">میزبان (Host):</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{mysqlConfig.host}:{mysqlConfig.port}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500">نام دیتابیس:</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{mysqlConfig.database}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500">کاراکترست (Charset):</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{mysqlConfig.charset}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500">وضعیت اتصال:</span>
                  <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>فعال و آماده‌باش</span>
                  </div>
                </div>
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
    </div>
  );
};
