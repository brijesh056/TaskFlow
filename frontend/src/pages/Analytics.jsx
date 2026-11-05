import { BarChart3 } from 'lucide-react';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import { EmptyState, ErrorState, Spinner } from '../components/Ui';
import { STATUSES } from '../services/helpers';

export default function Analytics() {
  const { isAdmin } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTasks();

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;
  if (tasks.length === 0) {
    return (
      <div className="card mx-auto max-w-3xl">
        <EmptyState icon={BarChart3} title="No data to chart yet" text="Charts appear once tasks have been created and assigned." />
      </div>
    );
  }

  // Chart 1: tasks per status
  const statusData = STATUSES.map((s) => ({
    name: s.name,
    value: tasks.filter((t) => t.status === s.name).length,
    color: s.color,
  }));

  // Chart 2: tasks per assignee
  const workloadMap = {};
  tasks.forEach((t) => {
    const name = t.assignedTo?.name || 'Unassigned';
    workloadMap[name] = (workloadMap[name] || 0) + 1;
  });
  const workloadData = Object.entries(workloadMap)
    .map(([name, tasksCount]) => ({ name, tasks: tasksCount }))
    .sort((a, b) => b.tasks - a.tasks);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <section className="card p-6">
        <h2 className="font-bold text-slate-900">Task status</h2>
        <p className="mb-4 text-sm text-slate-500">How tasks are spread across the board.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData.filter((d) => d.value > 0)} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {statusData.filter((d) => d.value > 0).map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-bold text-slate-900">{isAdmin ? 'Team workload' : 'My workload'}</h2>
        <p className="mb-4 text-sm text-slate-500">Number of tasks assigned to each person.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="tasks" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
