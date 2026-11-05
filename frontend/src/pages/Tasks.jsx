import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Plus, Search, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import api, { getErrorMessage } from '../services/api';
import KanbanColumn from '../components/KanbanColumn';
import { TaskCardView } from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { EmptyState, ErrorState, Modal, Spinner } from '../components/Ui';
import { PRIORITIES, STATUSES } from '../services/helpers';

export default function Tasks() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask } = useTasks();

  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null); // null | { task? }
  const [toDelete, setToDelete] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');

  // Mouse needs a small drag distance (so clicks still work); touch needs a short press
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  // Admin needs the user list for the "Assign to" dropdown
  useEffect(() => {
    if (isAdmin) api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
  }, [isAdmin]);

  // Dashboard's "Create task" button sends us here with this flag
  useEffect(() => {
    if (location.state?.openCreate && isAdmin) {
      setModal({});
      navigate('/tasks', { replace: true, state: null });
    }
  }, [location.state, isAdmin, navigate]);

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) && (priority === 'All' || t.priority === priority)
      ),
    [tasks, search, priority]
  );

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find((t) => t._id === active.id);
    if (!task || task.status === over.id) return;
    try {
      await moveTask(task._id, over.id);
      toast.success(`Moved to ${over.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(toDelete._id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setToDelete(null);
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input !pl-9" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input !w-auto" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        {isAdmin && (
          <button className="btn-primary ml-auto" onClick={() => setModal({})}>
            <Plus className="h-4 w-4" /> New task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ClipboardList}
            title="Your board is empty"
            text={isAdmin ? 'Create a task and assign it to a team member.' : 'You have no tasks assigned yet.'}
            action={isAdmin && <button className="btn-primary" onClick={() => setModal({})}><Plus className="h-4 w-4" /> Create task</button>}
          />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveTask(tasks.find((t) => t._id === active.id))}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status.name}
                status={status}
                tasks={filtered.filter((t) => t.status === status.name)}
                isAdmin={isAdmin}
                onEdit={(task) => setModal({ task })}
                onDelete={setToDelete}
              />
            ))}
          </div>
          <DragOverlay>{activeTask ? <TaskCardView task={activeTask} dragging /> : null}</DragOverlay>
        </DndContext>
      )}

      {modal && (
        <TaskModal
          task={modal.task}
          users={users}
          onClose={() => setModal(null)}
          onSubmit={(form) => (modal.task ? updateTask(modal.task._id, form) : createTask(form))}
        />
      )}

      {toDelete && (
        <Modal title="Delete task?" onClose={() => setToDelete(null)}>
          <p className="text-sm text-slate-600">
            "{toDelete.title}" will be permanently removed. This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn-danger" onClick={handleDelete}>Delete task</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
