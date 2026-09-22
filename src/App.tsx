import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Server,
  Layers,
  Search,
  SlidersHorizontal,
  Bookmark,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  Building,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  User,
  Category,
  CategoryField,
  Ad,
  FilterState,
  ActiveDirectoryConfig,
  MySQLConfig,
  AuditLog,
} from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { FilterSidebar } from './components/FilterSidebar';
import { AdCard } from './components/AdCard';
import { AdDetailModal } from './components/AdDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { LoginModal } from './components/LoginModal';
import { AdminModal } from './components/AdminPanel/AdminModal';
import { AdminAuthModal } from './components/AdminPanel/AdminAuthModal';
import { toPersianDigits } from './utils/jalali';

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  categoryId: '',
  city: 'همه واحدها و شعب',
  departmentLocation: '',
  onlyFree: false,
  onlyUrgent: false,
  onlyWithImages: false,
  sortBy: 'NEWEST',
  customFieldFilters: {},
};

export default function App() {
  // Global Data States
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [adConfig, setAdConfig] = useState<ActiveDirectoryConfig>(storageService.getActiveDirectoryConfig());
  const [mysqlConfig, setMysqlConfig] = useState<MySQLConfig>(storageService.getMySQLConfig());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // UI Control States
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedBranch, setSelectedBranch] = useState<string>('همه واحدها و شعب');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [activeAdDetail, setActiveAdDetail] = useState<Ad | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Load initial persistent data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(storageService.getUsers());
    setCategories(storageService.getCategories());
    setAds(storageService.getAds());
    setCurrentUser(storageService.getCurrentUser());
    setBookmarks(storageService.getBookmarks());
    setAdConfig(storageService.getActiveDirectoryConfig());
    setMysqlConfig(storageService.getMySQLConfig());
    setAuditLogs(storageService.getAuditLogs());
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
    setShowOnlyBookmarks(false);
  };

  // Bookmark toggle
  const handleToggleBookmark = (adId: string) => {
    const updated = storageService.toggleBookmark(adId);
    setBookmarks(storageService.getBookmarks());
  };

  // Ad Actions
  const handleCreateAd = (adData: Partial<Ad>) => {
    storageService.createAd(adData);
    refreshData();
  };

  const handleApproveAd = (adId: string, keepBadge: boolean = true) => {
    storageService.updateAdStatus(adId, 'APPROVED', undefined, { keepBadge });
    refreshData();
    if (activeAdDetail && activeAdDetail.id === adId) {
      setActiveAdDetail(prev =>
        prev
          ? {
              ...prev,
              status: 'APPROVED',
              isUrgent: keepBadge,
              badgeApproved: keepBadge,
            }
          : null
      );
    }
  };

  const handleRejectAd = (adId: string, reason: string) => {
    storageService.updateAdStatus(adId, 'REJECTED', reason);
    refreshData();
    if (activeAdDetail && activeAdDetail.id === adId) {
      setActiveAdDetail(prev => prev ? { ...prev, status: 'REJECTED', rejectionReason: reason } : null);
    }
  };

  const handleDeleteAd = (adId: string) => {
    storageService.deleteAd(adId);
    refreshData();
    if (activeAdDetail && activeAdDetail.id === adId) {
      setActiveAdDetail(null);
    }
  };

  const handleUpdateAd = (adId: string, updates: Partial<Ad>) => {
    storageService.updateAd(adId, updates, currentUser.username);
    refreshData();
    if (activeAdDetail && activeAdDetail.id === adId) {
      setActiveAdDetail(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleContactView = (adId: string) => {
    storageService.incrementContactViews(adId);
    refreshData();
  };

  // Category & Field Actions
  const handleSaveCategory = (cat: Partial<Category>) => {
    storageService.saveCategory(cat);
    refreshData();
  };

  const handleDeleteCategory = (catId: string) => {
    storageService.deleteCategory(catId);
    refreshData();
  };

  const handleAddFieldToCategory = (catId: string, field: Omit<CategoryField, 'id' | 'categoryId'>) => {
    storageService.addCategoryField(catId, field);
    refreshData();
  };

  const handleDeleteCategoryField = (catId: string, fieldId: string) => {
    storageService.deleteCategoryField(catId, fieldId);
    refreshData();
  };

  // AD & MySQL Config Actions
  const handleSaveADConfig = (cfg: Partial<ActiveDirectoryConfig>) => {
    storageService.saveActiveDirectoryConfig(cfg);
    refreshData();
  };

  const handleSelectUser = (user: User) => {
    storageService.setCurrentUser(user);
    refreshData();
  };

  const handleAdminAuthSuccess = (authenticatedAdmin: User) => {
    if (authenticatedAdmin.id !== currentUser.id) {
      storageService.setCurrentUser(authenticatedAdmin);
      setCurrentUser(authenticatedAdmin);
    }
    setIsAdminAuthOpen(false);
    setIsAdminOpen(true);
  };

  // Filtered & Sorted Ads
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      // If showing only bookmarks
      if (showOnlyBookmarks && !bookmarks.includes(ad.id)) {
        return false;
      }

      // Default: regular users only see APPROVED ads, while author or admin sees their own pending/rejected
      const isPrivileged =
        currentUser.role === 'SUPER_ADMIN' ||
        ad.authorId === currentUser.id ||
        (currentUser.role === 'CATEGORY_MANAGER' && currentUser.managedCategoryIds?.includes(ad.categoryId));

      if (!isPrivileged && ad.status !== 'APPROVED') {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.trim().toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(q);
        const matchesDesc = ad.description.toLowerCase().includes(q);
        const matchesAuthor = ad.authorName.toLowerCase().includes(q);
        const matchesLocation = (ad.departmentLocation || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesLocation) {
          return false;
        }
      }

      // Category filter
      if (filters.categoryId && ad.categoryId !== filters.categoryId) {
        return false;
      }

      // Location / Branch filter
      if (selectedBranch !== 'همه واحدها و شعب' && ad.departmentLocation && !ad.departmentLocation.includes(selectedBranch.split(' ')[0])) {
        // loose match
      }

      // Only Agreement Price
      if (filters.onlyFree && !ad.isAgreementPrice && ad.price > 0) {
        return false;
      }

      // Only Urgent
      if (filters.onlyUrgent && !ad.isUrgent) {
        return false;
      }

      // Only with Images
      if (filters.onlyWithImages && (!ad.images || ad.images.length === 0)) {
        return false;
      }

      // Price Range
      if (filters.minPrice !== undefined && ad.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && ad.price > filters.maxPrice) {
        return false;
      }

      // Dynamic Category Fields Filters
      if (filters.customFieldFilters && Object.keys(filters.customFieldFilters).length > 0) {
        for (const [key, filterVal] of Object.entries(filters.customFieldFilters)) {
          if (filterVal === undefined || filterVal === null || filterVal === '') continue;

          const adVal = ad.customFields?.[key];

          if (typeof filterVal === 'boolean') {
            if (!adVal) return false;
          } else if (typeof filterVal === 'number') {
            if (typeof adVal !== 'number' || adVal < filterVal) return false;
          } else if (typeof filterVal === 'string') {
            if (adVal !== filterVal) return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'PRICE_ASC') return a.price - b.price;
      if (filters.sortBy === 'PRICE_DESC') return b.price - a.price;
      if (filters.sortBy === 'VIEWS') return (b.viewsCount || 0) - (a.viewsCount || 0);
      // Default: NEWEST
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [ads, filters, bookmarks, showOnlyBookmarks, currentUser, selectedBranch]);

  const activeCategory = categories.find(c => c.id === filters.categoryId);

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex flex-col text-slate-900" dir="rtl">
      {/* Top Corporate Banner */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">سامانه آگهی‌های سازمانی (دیوار بومی)</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              احراز هویت متمرکز با اکتیو دایرکتوری ویندوز ({adConfig.domainName}\) • بدون واسطه و ویژه همکاران سازمان
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">سرور پایگاه داده:</span>
            <span className="font-mono text-emerald-400 font-bold">MySQL {mysqlConfig.host}</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="text-white hover:text-rose-300 font-bold flex items-center gap-1 transition"
            >
              <Server className="w-3 h-3 text-rose-400" />
              <span>تغییر حساب ویندوز</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        bookmarksCount={bookmarks.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarksOnly={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
        searchQuery={filters.searchQuery}
        onSearchChange={q => handleFilterChange({ searchQuery: q })}
        selectedBranch={selectedBranch}
        onBranchChange={b => setSelectedBranch(b)}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Active Filters / Category Banner if selected */}
        {activeCategory && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg border border-rose-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-slate-900 text-sm">{activeCategory.title}</h2>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    {toPersianDigits(activeCategory.fields.length)} فیلد ویژگی اختصاصی
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeCategory.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">مدیر ناظر این دسته:</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {activeCategory.managerName} ({activeCategory.managerDepartment})
              </span>
              <button
                type="button"
                onClick={() => handleFilterChange({ categoryId: '', customFieldFilters: {} })}
                className="text-rose-600 hover:text-rose-700 text-xs font-semibold mr-2"
              >
                نمایش همه
              </button>
            </div>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Ad Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              activeCategory={activeCategory}
            />
          </aside>

          {/* Right Column: Listings Header & Grid */}
          <section className="lg:col-span-9 space-y-4">
            {/* Feed Header */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-800">
                  {showOnlyBookmarks
                    ? 'آگهی‌های نشان‌شده شما'
                    : activeCategory
                    ? `آگهی‌های ${activeCategory.title}`
                    : 'همه آگهی‌های سازمان'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 font-mono">
                  {toPersianDigits(filteredAds.length)} آگهی موجود
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>فیلترها</span>
                </button>

                {/* Quick Post Ad CTA */}
                <button
                  type="button"
                  onClick={() => setIsPostAdOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ثبت آگهی جدید</span>
                </button>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="lg:hidden animate-in fade-in">
                <FilterSidebar
                  categories={categories}
                  filters={filters}
                  onFilterChange={newF => {
                    handleFilterChange(newF);
                  }}
                  onResetFilters={handleResetFilters}
                  activeCategory={activeCategory}
                />
              </div>
            )}

            {/* Ads Grid */}
            {filteredAds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAds.map(ad => {
                  const adCat = categories.find(c => c.id === ad.categoryId);
                  return (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      category={adCat}
                      isBookmarked={bookmarks.includes(ad.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onClick={item => {
                        storageService.incrementViews(item.id);
                        setActiveAdDetail(item);
                        refreshData();
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">آگهی متناسب با فیلترهای شما یافت نشد</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  می‌توانید عبارت جست‌وجو را تغییر دهید یا فیلترهای اعمال شده را حذف کنید.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-100 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>پاک کردن تمامی فیلترها</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              د
            </div>
            <span className="font-bold text-slate-800">سامانه آگهی سازمانی دیوار</span>
            <span className="text-slate-400">|</span>
            <span>طراحی شده برای پرسنل و شبکه داخلی سازمان</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>پروتکل احراز هویت: Active Directory Kerberos / LDAP</span>
            <span>•</span>
            <span>دیتابیس: MySQL 8.0+ محلی</span>
            <span>•</span>
            <span>تقویم شمسی دقیق</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Ad Detail Modal */}
      {activeAdDetail && (
        <AdDetailModal
          ad={activeAdDetail}
          category={categories.find(c => c.id === activeAdDetail.categoryId)}
          categories={categories}
          currentUser={currentUser}
          isBookmarked={bookmarks.includes(activeAdDetail.id)}
          onClose={() => setActiveAdDetail(null)}
          onToggleBookmark={handleToggleBookmark}
          onApproveAd={handleApproveAd}
          onRejectAd={handleRejectAd}
          onDeleteAd={handleDeleteAd}
          onUpdateAd={handleUpdateAd}
          onContactView={handleContactView}
        />
      )}

      {/* 2. Post New Free Ad Modal */}
      {isPostAdOpen && (
        <PostAdModal
          categories={categories}
          currentUser={currentUser}
          onClose={() => setIsPostAdOpen(false)}
          onSubmitAd={handleCreateAd}
        />
      )}

      {/* 3. Active Directory / Windows Login Modal */}
      {isLoginOpen && (
        <LoginModal
          users={users}
          currentUser={currentUser}
          onClose={() => setIsLoginOpen(false)}
          onSelectUser={handleSelectUser}
        />
      )}

      {/* 4. Admin Authentication Gate Modal (Requires username and password) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        users={users}
        currentUser={currentUser}
        verifyCredentials={(u, p) => storageService.verifyAdminCredentials(u, p)}
      />

      {/* 5. Full Enterprise Admin & Reports Center */}
      {isAdminOpen && (
        <AdminModal
          currentUser={currentUser}
          users={users}
          categories={categories}
          ads={ads}
          adConfig={adConfig}
          mysqlConfig={mysqlConfig}
          auditLogs={auditLogs}
          userPerformanceReport={storageService.getUserPerformanceReport()}
          onClose={() => setIsAdminOpen(false)}
          onApproveAd={handleApproveAd}
          onRejectAd={handleRejectAd}
          onDeleteAd={handleDeleteAd}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddFieldToCategory={handleAddFieldToCategory}
          onDeleteCategoryField={handleDeleteCategoryField}
          onSaveADConfig={handleSaveADConfig}
          onTestADConnection={() => storageService.testActiveDirectoryConnection()}
          onTestMySQLConnection={() => storageService.testMySQLConnection()}
          onUpdateAd={handleUpdateAd}
        />
      )}
    </div>
  );
}
