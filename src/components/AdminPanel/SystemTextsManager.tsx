import React, { useState, useMemo } from 'react';
import {
  Type,
  Search,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Sparkles,
  Info,
  X,
  FileText,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useText } from '../../context/TextContext';
import { UI_TEXT_CATEGORIES, UiTextDefinition, DEFAULT_UI_TEXTS, getDefaultTextsMap } from '../../data/defaultUiTexts';
import { toPersianDigits } from '../../utils/jalali';

export const SystemTextsManager: React.FC = () => {
  const { texts, setUiText, deleteUiText, resetUiTexts, definitions } = useText();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CUSTOMIZED' | 'DEFAULT'>('ALL');

  // Edit Modal state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Add Custom Key Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<UiTextDefinition['category']>('SYSTEM_MESSAGES');
  const [newDescription, setNewDescription] = useState('');
  const [newValue, setNewValue] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Reset / Delete Confirmations
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [showResetAllModal, setShowResetAllModal] = useState(false);

  // Export & Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const defaultMap = useMemo(() => getDefaultTextsMap(), []);

  // Compute all items including default definitions and any custom keys added by admin
  const allItems = useMemo(() => {
    const list: {
      key: string;
      label: string;
      category: UiTextDefinition['category'] | 'CUSTOM';
      categoryLabel: string;
      description: string;
      defaultText: string;
      currentText: string;
      isCustomized: boolean;
      isCustomKey: boolean;
    }[] = [];

    const defaultKeysSet = new Set<string>();

    for (const def of definitions) {
      defaultKeysSet.add(def.key);
      const catObj = UI_TEXT_CATEGORIES.find(c => c.id === def.category);
      const current = texts[def.key] !== undefined ? texts[def.key] : def.defaultText;
      const isCustomized = texts[def.key] !== undefined && texts[def.key] !== def.defaultText;

      list.push({
        key: def.key,
        label: def.label,
        category: def.category,
        categoryLabel: catObj ? catObj.label : 'سایر',
        description: def.description,
        defaultText: def.defaultText,
        currentText: current,
        isCustomized,
        isCustomKey: false,
      });
    }

    // Check for any custom keys created by admin that are not in default definitions
    for (const [k, v] of Object.entries(texts)) {
      if (!defaultKeysSet.has(k)) {
        list.push({
          key: k,
          label: `کلید سفارشی (${k})`,
          category: 'CUSTOM',
          categoryLabel: 'متون سفارشی جدید',
          description: 'کلید متنی تعریف‌شده به‌صورت اختصاصی توسط مدیر سیستم',
          defaultText: '',
          currentText: v,
          isCustomized: true,
          isCustomKey: true,
        });
      }
    }

    return list;
  }, [texts, definitions]);

  // Filtered items based on search and category
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'CUSTOMIZED' && !item.isCustomized) {
        return false;
      }
      if (statusFilter === 'DEFAULT' && item.isCustomized) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchKey = item.key.toLowerCase().includes(query);
        const matchLabel = item.label.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCurrent = item.currentText.toLowerCase().includes(query);
        const matchDefault = item.defaultText.toLowerCase().includes(query);
        return matchKey || matchLabel || matchDesc || matchCurrent || matchDefault;
      }

      return true;
    });
  }, [allItems, selectedCategory, statusFilter, searchQuery]);

  // Statistics
  const totalCount = allItems.length;
  const customizedCount = allItems.filter(i => i.isCustomized).length;
  const defaultCount = totalCount - customizedCount;

  // Open Edit Modal
  const handleOpenEdit = (item: (typeof allItems)[0]) => {
    setEditingKey(item.key);
    setEditingValue(item.currentText);
    setEditSuccessMsg(null);
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!editingKey) return;
    setUiText(editingKey, editingValue);
    showToast(`متن با کلید «${editingKey}» با موفقیت به‌روزرسانی و در پایگاه داده ذخیره شد.`);
    setEditingKey(null);
  };

  // Reset single key to default or delete custom key
  const handleConfirmDelete = () => {
    if (!confirmDeleteKey) return;
    deleteUiText(confirmDeleteKey);
    const item = allItems.find(i => i.key === confirmDeleteKey);
    if (item?.isCustomKey) {
      showToast(`کلید سفارشی «${confirmDeleteKey}» با موفقیت حذف گردید.`);
    } else {
      showToast(`متن «${confirmDeleteKey}» به مقدار پیش‌فرض کارخانه‌ای بازگردانده شد.`);
    }
    setConfirmDeleteKey(null);
  };

  // Add new custom key
  const handleAddCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const trimmedKey = newKey.trim();
    if (!trimmedKey) {
      setAddError('لطفاً شناسه کلید متن را وارد نمایید.');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedKey)) {
      setAddError('شناسه کلید فقط می‌تواند شامل حروف انگلیسی، اعداد، خط فاصله و نقطه باشد (مثال: footer.custom_notice).');
      return;
    }

    if (!newValue.trim()) {
      setAddError('لطفاً متن فارسی مورد نظر را وارد فرمایید.');
      return;
    }

    setUiText(trimmedKey, newValue.trim());
    showToast(`کلید متن جدید «${trimmedKey}» با موفقیت ایجاد گردید.`);
    setShowAddModal(false);
    setNewKey('');
    setNewLabel('');
    setNewDescription('');
    setNewValue('');
  };

  // Reset all texts to factory defaults
  const handleResetAll = () => {
    resetUiTexts();
    setShowResetAllModal(false);
    showToast('کلیه متون و عبارات سیستم به حالت اولیه پیش‌فرض کارخانه‌ای بازگردانده شدند.');
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(texts, null, 2);
    navigator.clipboard?.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
    showToast('متون سفارشی‌شده در کلیپ‌بورد کپی شدند.');
  };

  // Import JSON
  const handleImportJson = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setImportError('ساختار فایل واردشده نامعتبر است. فرمت باید یک آبجکت JSON شامل کلید و متن باشد.');
        return;
      }

      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') {
          setUiText(k, v);
        }
      }

      setShowImportModal(false);
      setImportJsonText('');
      showToast(`${toPersianDigits(Object.keys(parsed).length)} کلید متنی با موفقیت وارد و ذخیره شدند.`);
    } catch (err: any) {
      setImportError('خطا در تجزیه JSON: ' + (err.message || 'لطفاً ساختار کد را بررسی کنید'));
    }
  };

  // Get active editing definition
  const activeEditingItem = editingKey ? allItems.find(i => i.key === editingKey) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-150" dir="rtl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Information */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>مدیریت متون، عبارات و محتوای سامانه</span>
                <span className="text-xs font-normal text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/30">
                  بدون هاردکد
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                امکان ویرایش آنی، حذف سفارشی‌سازی یا بازنشانی تمامی متون، عناوین، برچسب‌ها و پیام‌های سیستم با ذخیره‌سازی دائمی در پایگاه داده
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن کلید متن دلخواه</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
              title="کپی ساختار JSON متون سفارشی در کلیپ‌بورد"
            >
              {copiedExport ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
              <span>{copiedExport ? 'کپی شد' : 'خروجی JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>ورود JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setShowResetAllModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition cursor-pointer"
              title="بازگردانی کلیه متون به مقادیر اولیه کارخانه‌ای"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی کل متون</span>
            </button>
          </div>
        </div>

        {/* Counters & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">کل عبارات سیستم</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
              {toPersianDigits(totalCount)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-medium">ویرایش‌شده توسط مدیر</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
              {toPersianDigits(customizedCount)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">مقادیر پیش‌فرض</span>
            <span className="text-lg font-black text-slate-600 dark:text-slate-300 font-mono">
              {toPersianDigits(defaultCount)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">دسته‌بندی‌های متنی</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
              {toPersianDigits(UI_TEXT_CATEGORIES.length + 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="جستجو در کلیدها، برچسب‌ها، توضیحات یا محتوای متن..."
              className="w-full pl-8 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Segmented Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              همه ({toPersianDigits(totalCount)})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('CUSTOMIZED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                statusFilter === 'CUSTOMIZED'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>ویرایش‌شده ({toPersianDigits(customizedCount)})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('DEFAULT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'DEFAULT'
                  ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              پیش‌فرض ({toPersianDigits(defaultCount)})
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-rose-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            همه بخش‌ها ({toPersianDigits(totalCount)})
          </button>
          {UI_TEXT_CATEGORIES.map(cat => {
            const countInCat = allItems.filter(i => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label} ({toPersianDigits(countInCat)})
              </button>
            );
          })}
          {allItems.some(i => i.category === 'CUSTOM') && (
            <button
              type="button"
              onClick={() => setSelectedCategory('CUSTOM')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                selectedCategory === 'CUSTOM'
                  ? 'bg-rose-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              متون سفارشی جدید ({toPersianDigits(allItems.filter(i => i.category === 'CUSTOM').length)})
            </button>
          )}
        </div>
      </div>

      {/* Texts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>
            نمایش {toPersianDigits(filteredItems.length)} مورد از {toPersianDigits(allItems.length)} عبارت
          </span>
          {searchQuery && (
            <span>فیلتر شده بر اساس عبارت «{searchQuery}»</span>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              هیچ عبارتی با شرایط جستجو یافت نشد
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              می‌توانید کلمه جستجو را پاک کنید یا فیلتر دسته‌بندی و وضعیت را تغییر دهید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map(item => (
              <div
                key={item.key}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-4.5 transition-all shadow-xs hover:shadow-sm ${
                  item.isCustomized
                    ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Metadata & Label */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.label}
                      </span>

                      {/* Monospace Key Badge with Copy */}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(item.key);
                          showToast(`کلید «${item.key}» در کلیپ‌بورد کپی شد`, 'info');
                        }}
                        className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                        title="کلیک برای کپی کردن کلید"
                        dir="ltr"
                      >
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>{item.key}</span>
                      </button>

                      {/* Category Badge */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {item.categoryLabel}
                      </span>

                      {/* Status Badge */}
                      {item.isCustomized ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>ویرایش‌شده توسط مدیر</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          پیش‌فرض سامانه
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    )}

                    {/* Current Effective Text Value */}
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                      <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400 font-normal">
                        <span>متن فعال فعلی در سامانه:</span>
                        <span>{toPersianDigits(item.currentText.length)} نویسه</span>
                      </div>
                      <div className="whitespace-pre-wrap">{item.currentText}</div>
                    </div>

                    {/* Show original default if customized */}
                    {item.isCustomized && item.defaultText && (
                      <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200/50">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold ml-1 text-slate-600 dark:text-slate-300">مقدار اولیه پیش‌فرض:</span>
                          <span className="italic">{item.defaultText}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ویرایش متن</span>
                    </button>

                    {item.isCustomized && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteKey(item.key)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 text-xs font-medium transition cursor-pointer"
                        title={item.isCustomKey ? 'حذف کلید سفارشی' : 'بازگردانی به پیش‌فرض'}
                      >
                        {item.isCustomKey ? (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف کلید</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>حذف تغییرات</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Text Modal */}
      {editingKey && activeEditingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ویرایش عبارت: {activeEditingItem.label}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500" dir="ltr">
                    {activeEditingItem.key}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingKey(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeEditingItem.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="font-bold ml-1">کاربرد در سامانه:</span>
                {activeEditingItem.description}
              </p>
            )}

            {/* Default Reference */}
            {activeEditingItem.defaultText && (
              <div className="text-xs space-y-1">
                <span className="text-slate-500 block">مقدار پیش‌فرض کارخانه‌ای:</span>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs italic">
                  {activeEditingItem.defaultText}
                </div>
              </div>
            )}

            {/* Textarea for edit */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  متن سفارشی جدید مدیر:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {toPersianDigits(editingValue.length)} نویسه
                </span>
              </div>
              <textarea
                rows={4}
                value={editingValue}
                onChange={e => setEditingValue(e.target.value)}
                placeholder="متن فارسی جدید را بنویسید..."
                className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              {activeEditingItem.defaultText && (
                <button
                  type="button"
                  onClick={() => setEditingValue(activeEditingItem.defaultText)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بارگذاری متن پیش‌فرض</span>
                </button>
              )}

              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="button"
                  onClick={() => setEditingKey(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ذخیره در پایگاه داده</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Text Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleAddCustomText}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  افزودن کلید متن دلخواه جدید
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  شناسه کلید متن (Key):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="e.g. footer.support_phone or banner.announcement"
                  className="w-full p-2.5 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  عنوان فارسی کلید:
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder="مثال: شماره تلفن پشتیبانی در فوتر"
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  بخش / دسته‌بندی:
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {UI_TEXT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  محتوای متن فارسی:
                </label>
                <textarea
                  rows={3}
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="متن فارسی مورد نظر..."
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>افزودن و ذخیره در دیتابیس</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete / Reset Single Key Confirmation Modal */}
      {confirmDeleteKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                تأیید بازنشانی یا حذف سفارشی‌سازی
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                آیا مطمئن هستید که می‌خواهید تغییرات اعمال‌شده بر روی کلید{' '}
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                  «{confirmDeleteKey}»
                </span>{' '}
                را لغو و به مقدار پیش‌فرض کارخانه‌ای بازگردانید؟
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteKey(null)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                تأیید و بازنشانی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset ALL Texts Confirmation Modal */}
      {showResetAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-200 dark:border-rose-900/60 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-base font-black text-rose-600 dark:text-rose-400">
                هشدار: بازنشانی کلیه متون سامانه
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                این عملیات تمامی تغییرات و متون اختصاصی ثبت‌شده توسط مدیر را پاک کرده و تمامی بخش‌های سامانه را به مقادیر اولیه کارخانه‌ای بازمی‌گرداند. این عمل غیرقابل بازگشت است.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetAllModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
              >
                تأیید بازنشانی کامل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  ورود متون از فایل یا رشته JSON
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                محتوای JSON را اینجا جای‌گذاری فرمایید:
              </label>
              <textarea
                rows={6}
                dir="ltr"
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                placeholder='{ "navbar.brand_name": "دیوار پرسنلی", "navbar.brand_badge": "اختصاصی" }'
                className="w-full p-3 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تأیید و اعمال متون</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
