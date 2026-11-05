import { Circle, Clock, Eye, CheckCircle2 } from 'lucide-react';

export const STATUSES = [
  { name: 'To Do', dot: 'bg-slate-400', color: '#94a3b8', icon: Circle },
  { name: 'In Progress', dot: 'bg-sky-500', color: '#0ea5e9', icon: Clock },
  { name: 'Review', dot: 'bg-amber-500', color: '#f59e0b', icon: Eye },
  { name: 'Completed', dot: 'bg-emerald-500', color: '#10b981', icon: CheckCircle2 },
];

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const PRIORITY_STYLES = {
  High: 'bg-rose-50 text-rose-700 ring-rose-200',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export const PRIORITY_COLORS = { High: '#e11d48', Medium: '#f59e0b', Low: '#10b981' };

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No due date';

export const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const isOverdue = (task) =>
  Boolean(task.dueDate) && task.status !== 'Completed' && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

export const initials = (name = '?') =>
  name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
