import { AlertCircle, Loader2, X } from 'lucide-react';
import { initials } from '../services/helpers';

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin text-teal-600" /> {label}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="font-semibold text-slate-700">{title}</p>
      {text && <p className="mt-1 max-w-xs text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
      <AlertCircle className="mx-auto mb-2 h-6 w-6 text-rose-600" />
      <p className="text-sm font-medium text-rose-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-4">Try again</button>
      )}
    </div>
  );
}

export function Avatar({ name, size = 'h-7 w-7 text-[11px]' }) {
  return (
    <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800`}>
      {initials(name)}
    </span>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:max-w-lg sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
