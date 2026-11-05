import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Clock, Hourglass, Plus, KanbanSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import StatCard from '../components/StatCard';
import { Avatar, EmptyState, ErrorState, Spinner } from '../components/Ui';
import { PRIORITIES, PRIORITY_COLORS, PRIORITY_STYLES, formatDate } from '../services/helpers';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading, error, fetchTasks } = useTasks();

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  const count = (status) => tasks.filter((t) => t.status === status).length;
  const completed = count('Completed');
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const recent = tasks.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Hello, {user.name.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500">
            {isAdmin ? 'Here is how the whole team is doing.' : 'Here is your workload at a glance.'}
          </p>
        </div>
        {isAdmin ? (
          <button className="btn-primary" onClick={() => navigate('/tasks', { state: { openCreate: true } })}>
            <Plus className="h-4 w-4" /> Create task
          </button>
        ) : (
          <Link to="/tasks" className="btn-primary"><KanbanSquare className="h-4 w-4" /> Open my board</Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={tasks.length} icon={ClipboardList} tone="bg-slate-100 text-slate-700" />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-700" />
        <StatCard label="In progress" value={count('In Progress')} icon={Clock} tone="bg-sky-100 text-sky-700" />
        <StatCard label="Pending (To Do)" value={count('To Do')} icon={Hourglass} tone="bg-amber-100 text-amber-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent tasks</h3>
            <Link to="/tasks" className="text-sm font-semibold text-teal-700 hover:underline">View board</Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No tasks yet" text={isAdmin ? 'Create your first task to get the board moving.' : 'Tasks assigned to you will show up here.'} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((task) => (
                <li key={task._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.status} · Due {formatDate(task.dueDate)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                    {task.assignedTo && <Avatar name={task.assignedTo.name} />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="card p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Progress</h3>
              <span className="text-sm font-bold text-teal-700">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{completed} of {tasks.length} tasks completed</p>
          </section>

          <section className="card p-6">
            <h3 className="mb-4 font-bold text-slate-900">Priority summary</h3>
            <div className="space-y-4">
              {[...PRIORITIES].reverse().map((p) => {
                const n = tasks.filter((t) => t.priority === p).length;
                return (
                  <div key={p}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{p}</span>
                      <span className="font-bold text-slate-900">{n}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${tasks.length ? (n / tasks.length) * 100 : 0}%`, background: PRIORITY_COLORS[p] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
