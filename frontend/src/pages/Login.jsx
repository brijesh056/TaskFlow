import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import AuthShell from './AuthShell';

const DEMO = [
  { label: 'Admin demo', email: 'admin@taskflow.com', password: 'admin123' },
  { label: 'Member demo', email: 'member@taskflow.com', password: 'member123' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}`);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Log in to TaskFlow"
      subtitle="Enter your details to open your board."
      footer={<>New here? <Link to="/register" className="font-semibold text-teal-700 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required className="input" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Log in'}</button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4">
        <p className="mb-3 text-xs font-semibold text-slate-500">Try the demo (run the seed script first)</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO.map((d) => (
            <button key={d.label} type="button" onClick={() => setForm({ email: d.email, password: d.password })} className="btn-ghost !py-2 text-xs">
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
