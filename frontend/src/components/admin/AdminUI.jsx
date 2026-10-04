import React, { useEffect, useRef } from 'react';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock3, 
  FileQuestion, 
  Loader2, 
  X,
  TrendingUp
} from 'lucide-react';

export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200 dark:border-forest-800 transition-colors">
      <div>
        {eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-widest text-forest-700 dark:text-mint-400 bg-sand-100 dark:bg-forest-900 px-2 py-0.5 rounded-md inline-block mb-1 border border-sand-200 dark:border-forest-800">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {actions}
        </div>
      )}
    </header>
  );
}

export function MetricCard({ label, value, note, icon: Icon = Activity, tone = 'forest' }) {
  const iconTones = {
    forest: 'bg-forest-900 dark:bg-forest-800 text-mint-400 dark:text-mint-300',
    mint: 'bg-emerald-600 dark:bg-emerald-700 text-white',
    amber: 'bg-ochre-600 dark:bg-ochre-700 text-white',
    blue: 'bg-sky-600 dark:bg-sky-700 text-white',
    red: 'bg-rose-600 dark:bg-rose-700 text-white',
  };

  return (
    <article className="p-5 rounded-3xl bg-white dark:bg-forest-900/60 border border-sand-200 dark:border-forest-800 shadow-subtle hover:shadow-elevated hover:border-forest-300 dark:hover:border-forest-700 transition duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${iconTones[tone] || iconTones.forest}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <strong className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-white tracking-tight block">
          {value}
        </strong>
        {note && <small className="text-[11px] text-sand-500 dark:text-sand-400 font-medium block mt-1">{note}</small>}
      </div>
    </article>
  );
}

const statusTone = (status = '') => {
  const value = status.toUpperCase();
  if (['DELIVERED', 'APPROVED', 'ACTIVE', 'PAID', 'IN STOCK', 'HEALTHY'].includes(value)) return 'good';
  if (['CANCELLED', 'REJECTED', 'INACTIVE', 'OUT OF STOCK', 'FAILED', 'REFUNDED'].includes(value)) return 'bad';
  if (['PENDING', 'PRESCRIPTION_PENDING', 'LOW STOCK', 'EXPIRED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'CONFIRMED', 'PLACED'].includes(value)) return 'pending';
  return 'neutral';
};

export function StatusBadge({ status, children }) {
  const text = children || String(status || 'Unknown').replaceAll('_', ' ');
  const tone = statusTone(status || text);

  const styles = {
    good: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    bad: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    pending: 'bg-ochre-50 dark:bg-ochre-950/40 text-ochre-800 dark:text-ochre-300 border-ochre-200 dark:border-ochre-800/60',
    neutral: 'bg-sand-100 dark:bg-forest-900/60 text-forest-900 dark:text-sand-200 border-sand-200 dark:border-forest-800',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${styles[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        tone === 'good' ? 'bg-emerald-500' : tone === 'bad' ? 'bg-rose-500' : tone === 'pending' ? 'bg-ochre-500 animate-pulse' : 'bg-sand-400'
      }`}></span>
      <span>{text}</span>
    </span>
  );
}

export function EmptyState({ title, description, action, icon: Icon = FileQuestion }) {
  return (
    <div className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-12 text-center space-y-4 max-w-md mx-auto my-6 shadow-subtle">
      <div className="w-12 h-12 rounded-2xl bg-sand-100 dark:bg-forest-800 text-sand-500 dark:text-sand-400 mx-auto flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-extrabold text-forest-950 dark:text-white text-base">{title}</h3>
        <p className="text-xs text-sand-500 dark:text-sand-400 mt-1 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Retrieving operations ledger…' }) {
  return (
    <div className="py-20 text-center space-y-4" role="status">
      <div className="w-10 h-10 rounded-full border-4 border-sand-300 dark:border-forest-800 border-t-forest-900 dark:border-t-mint-400 animate-spin mx-auto"></div>
      <span className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-widest block">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center max-w-lg mx-auto my-8 space-y-3" role="alert">
      <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
      <span className="text-xs font-semibold text-rose-900 dark:text-rose-200 block">{message || 'This clinical information could not be retrieved.'}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
        >
          Retry Request
        </button>
      )}
    </div>
  );
}

export function Drawer({ open, title, subtitle, onClose, children, footer, width = 'medium' }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); onCloseRef.current(); }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) { event.preventDefault(); return; }
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, [open]);

  if (!open) return null;

  const widthClass = width === 'large' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-forest-950/60 backdrop-blur-sm animate-fade-in" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section
        ref={panelRef}
        tabIndex={-1}
        className={`w-full ${widthClass} h-full bg-white dark:bg-forest-950 text-forest-950 dark:text-sand-100 shadow-2xl flex flex-col justify-between overflow-hidden border-l border-sand-200 dark:border-forest-800 outline-none`}
        role="dialog"
        aria-modal="true"
      >
        <header className="px-6 py-5 border-b border-sand-200 dark:border-forest-800 flex items-center justify-between bg-sand-50/50 dark:bg-forest-900/40">
          <div>
            <h2 className="text-lg font-black text-forest-950 dark:text-white">{title}</h2>
            {subtitle && <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-400 hover:text-forest-950 dark:hover:text-white hover:bg-sand-200 dark:hover:bg-forest-800 transition"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">{children}</div>

        {footer && <footer className="p-5 border-t border-sand-200 dark:border-forest-800 bg-sand-50/60 dark:bg-forest-900/40 flex justify-end gap-3">{footer}</footer>}
      </section>
    </div>
  );
}

export function OrderTimeline({ status }) {
  const steps = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const aliases = { PACKED: 'PROCESSING', OUT_FOR_DELIVERY: 'SHIPPED', PRESCRIPTION_PENDING: 'PLACED' };
  const current = aliases[status] || status;
  const index = status === 'CANCELLED' ? -1 : steps.indexOf(current);

  return (
    <ol className="flex items-center gap-2 text-xs" aria-label={`Order status: ${status}`}>
      {steps.map((step, stepIndex) => {
        const isDone = stepIndex <= index;
        return (
          <li key={step} className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isDone ? 'bg-emerald-600 text-white' : 'bg-sand-200 dark:bg-forest-800 text-sand-500 dark:text-sand-400'
            }`}>
              {stepIndex + 1}
            </span>
            <span className={`text-[11px] font-bold ${isDone ? 'text-forest-950 dark:text-white' : 'text-sand-400 dark:text-sand-500'}`}>
              {step}
            </span>
            {stepIndex < steps.length - 1 && <span className="text-sand-300 dark:text-forest-700">→</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(undefined, withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' });
}

export function currency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
