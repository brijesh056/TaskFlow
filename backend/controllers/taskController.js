const Task = require('../models/Task');
const { asyncHandler } = require('../middleware/errorMiddleware');

const STATUSES = ['To Do', 'In Progress', 'Review', 'Completed'];
const populateFields = [
  { path: 'assignedTo', select: 'name email' },
  { path: 'createdBy', select: 'name' },
];

const isAdmin = (user) => user.role === 'Admin';
const isAssignee = (task, user) => task.assignedTo && task.assignedTo.toString() === user._id.toString();

// GET /api/tasks  -> Admin: all tasks, Member: only assigned tasks
const getTasks = asyncHandler(async (req, res) => {
  const filter = isAdmin(req.user) ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(filter).populate(populateFields).sort('-createdAt');
  res.json(tasks);
});

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (!isAdmin(req.user) && !isAssignee(task, req.user)) {
    return res.status(403).json({ message: 'This task is not assigned to you' });
  }
  await task.populate(populateFields);
  res.json(task);
});

// POST /api/tasks  (Admin)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignedTo, dueDate } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    createdBy: req.user._id,
  });
  await task.populate(populateFields);
  res.status(201).json(task);
});

// PUT /api/tasks/:id  (Admin)
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, description, priority, status, assignedTo, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  await task.populate(populateFields);
  res.json(task);
});

// DELETE /api/tasks/:id  (Admin)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.deleteOne();
  res.json({ message: 'Task deleted', id: req.params.id });
});

// PATCH /api/tasks/:id/status  (Admin or the assigned Member)
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (!isAdmin(req.user) && !isAssignee(task, req.user)) {
    return res.status(403).json({ message: 'You can only move tasks assigned to you' });
  }

  task.status = status;
  await task.save();
  await task.populate(populateFields);
  res.json(task);
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus };
