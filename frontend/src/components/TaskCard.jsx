import { useDraggable } from '@dnd-kit/core';
import { CalendarDays, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { PRIORITY_STYLES, formatDate, isOverdue } from '../services/helpers';
import { Avatar } from './Ui';

// Pure card UI (also used inside the DragOverlay while dragging)
export function TaskCardView({ task, isAdmin, onEdit, onDelete, dragging }) {
  const overdue = isOverdue(task);
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        dragging ? 'rotate-2 shadow-xl ring-2 ring-teal-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-0.5 text-slate-400">
          {isAdmin && onEdit && (
            <>
              <button onClick={() => onEdit(task)} className="rounded p-1 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit task">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onDelete(task)} className="rounded p-1 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete task">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <GripVertical className="h-4 w-4 cursor-grab" />
        </div>
      </div>

      <h3 className="mt-2.5 text-sm font-bold leading-snug text-slate-900">{task.title}</h3>
      {task.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{task.description}</p>}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${overdue ? 'text-rose-600' : 'text-slate-500'}`}>
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(task.dueDate)}
          {overdue && ' (overdue)'}
        </span>
        {task.assignedTo ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Avatar name={task.assignedTo.name} />
            {task.assignedTo.name.split(' ')[0]}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Unassigned</span>
        )}
      </div>
    </div>
  );
}

export default function DraggableTaskCard({ task, isAdmin, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task._id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? 'opacity-30' : ''}>
      <TaskCardView task={task} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
