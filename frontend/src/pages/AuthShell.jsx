import { KanbanSquare } from 'lucide-react';

// Shared split layout for Login + Register
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white">
            <KanbanSquare className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold text-white">TaskFlow</span>
        </div>

        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight text-white">
            Move work forward, one column at a time.
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Drag tasks from To Do to Completed, assign them to your team and see progress at a glance.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[['To Do', 'bg-slate-400'], ['In Progress', 'bg-sky-500'], ['Done', 'bg-emerald-500']].map(([name, dot], i) => (
              <div key={name} className="rounded-xl bg-slate-800 p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${dot}`} /> {name}
                </div>
                {Array.from({ length: 3 - i }).map((_, j) => (
                  <div key={j} className="mb-2 h-8 rounded-md bg-slate-700" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-500">Built with the MERN stack</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          <p className="mt-1 mb-8 text-sm text-slate-500">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}
