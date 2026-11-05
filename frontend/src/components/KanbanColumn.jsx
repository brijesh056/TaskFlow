import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './TaskCard';

export default function KanbanColumn({ status, tasks, isAdmin, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.name });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[320px] w-[280px] shrink-0 snap-start flex-col rounded-2xl p-3 transition-colors lg:w-auto ${
        isOver ? 'bg-teal-50 ring-2 ring-teal-300' : 'bg-slate-100'
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <h2 className="text-sm font-bold text-slate-800">{status.name}</h2>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600">{tasks.length}</span>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.map((task) => (
          <DraggableTaskCard key={task._id} task={task} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-xs font-medium text-slate-400">
            Drop a task here
          </div>
        )}
      </div>
    </section>
  );
}
