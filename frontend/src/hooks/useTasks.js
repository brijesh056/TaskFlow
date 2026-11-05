import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

// All task data + actions in one place. Pages just call these functions.
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload) => {
    const { data } = await api.post('/tasks', payload);
    setTasks((prev) => [data, ...prev]);
    return data;
  };

  const updateTask = async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // Optimistic update: move the card instantly, roll back if the API fails
  const moveTask = async (id, status) => {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await api.patch(`/tasks/${id}/status`, { status });
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask };
}
