import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from './Ui';
import { getErrorMessage } from '../services/api';
import { PRIORITIES, STATUSES, toInputDate } from '../services/helpers';

// Used for both "create" (no task prop) and "edit" (task prop)
export default function TaskModal({ task, users, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'To Do',
    assignedTo: task?.assignedTo?._id || '',
    dueDate: toInputDate(task?.dueDate),
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Please enter a task title');
    setSaving(true);
    try {
      await onSubmit(form);
      toast.success(task ? 'Task updated' : 'Task created');
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={task ? 'Edit task' : 'Create task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="title">Task title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Build login page" autoFocus />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" placeholder="What needs to be done?" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="input">
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="dueDate">Due date</label>
            <input id="dueDate" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input" />
          </div>
        </div>
        <div className={`grid gap-4 ${task ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <label className="label" htmlFor="assignedTo">Assign to</label>
            <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input">
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          {task && (
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="input">
                {STATUSES.map((s) => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
