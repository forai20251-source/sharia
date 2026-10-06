import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Flag,
  AlertTriangle,
  CheckCircle2,
  LogIn,
  ShieldAlert,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Ad, User, AdReportReason, ReportReasonConfig } from '../types';
import { DEFAULT_REPORT_REASONS } from '../data/defaultReportReasons';
import { useText } from '../context/TextContext';

interface ReportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad;
  currentUser: User | null;
  reportReasons?: ReportReasonConfig[];
  onSubmitReport: (data: {
    adId: string;
    reporterId: string;
    reporterName: string;
    reporterDepartment?: string;
    reason: AdReportReason;
    reasonLabel: string;
    description?: string;
  }) => { success: boolean; message: string };
  onOpenLogin: () => void;
}

export const ReportAdModal: React.FC<ReportAdModalProps> = ({
  isOpen,
  onClose,
  ad,
  currentUser,
  reportReasons,
  onSubmitReport,
  onOpenLogin,
}) => {
  const { t } = useText();

  // Use active report reasons passed from database, ordered by orderNum, fallback to default
  const activeReasons = useMemo(() => {
    if (reportReasons && reportReasons.length > 0) {
      const filtered = reportReasons.filter(r => r.isActive !== false);
      if (filtered.length > 0) {
        return [...filtered].sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0));
      }
    }
    return DEFAULT_REPORT_REASONS;
  }, [reportReasons]);

  const [selectedReason, setSelectedReason] = useState<AdReportReason>(() => activeReasons[0]?.id || 'OTHER');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeReasons.length > 0 && !activeReasons.some(r => r.id === selectedReason)) {
      setSelectedReason(activeReasons[0].id);
    }
  }, [activeReasons, selectedReason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const reasonObj = activeReasons.find(r => r.id === selectedReason);
    setIsSubmitting(true);
    setStatusMsg(null);

    const res = onSubmitReport({
      adId: ad.id,
      reporterId: currentUser.id,
      reporterName: currentUser.displayName || currentUser.username,
      reporterDepartment: currentUser.department || '',
      reason: selectedReason,
      reasonLabel: reasonObj?.label || 'سایر موارد',
      description: description.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flag className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{t('report.modal_title', 'گزارش مشکل یا تخلف آگهی')}</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                آگهی: {ad.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!currentUser ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t('report.login_required_title', 'نیاز به ورود به حساب کاربری')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {t('report.login_required_desc', 'جهت جلوگیری از گزارش‌های نامعتبر، برای ارسال گزارش تخلف به مدیر سامانه، ابتدا باید با حساب ویندوز خود وارد شوید.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('navbar.login_btn', 'ورود به حساب کاربری')}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {statusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('report.select_reason', 'علت گزارش تخلف را انتخاب کنید:')}
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('report.select_reason_hint', 'گزارش شما همراه با نام و شناسه سازمانی به مدیریت سامانه جهت بررسی و اقدام ارسال می‌گردد.')}
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeReasons.map(reason => (
                <label
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`block p-3 rounded-2xl border transition cursor-pointer ${
                    selectedReason === reason.id
                      ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {reason.label}
                      </div>
                      {(reason.description || (reason as any).desc) && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {reason.description || (reason as any).desc}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('report.comments_label', 'توضیحات تکمیلی برای مدیر سامانه')} <span className="text-[10px] text-slate-400 font-normal">(اختیاری)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('report.comments_placeholder', 'در صورت تمایل، جزئیات بیشتری درباره مشکل این آگهی بنویسید...')}
                rows={3}
                maxLength={400}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 resize-none transition"
              />
              <div className="text-[10px] text-slate-400 text-left" dir="ltr">
                {description.length}/400
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                {t('report.cancel_btn', 'انصراف')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t('report.submitting_btn', 'در حال ارسال...') : t('report.submit_btn', 'ارسال گزارش به مدیر')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
