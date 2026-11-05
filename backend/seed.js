// Run with: npm run seed   (wipes users + tasks, then adds demo data)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Task.deleteMany()]);

  const [admin, rahul, sanjay] = await User.create([
    { name: 'Brijesh', email: 'admin@taskflow.com', password: 'admin123', role: 'Admin' },
    { name: 'Rahul', email: 'member@taskflow.com', password: 'member123', role: 'Member' },
    { name: 'Sanjay', email: 'sanjay@taskflow.com', password: 'member123', role: 'Member' },
  ]);

  const t = (title, description, priority, status, user, due) => ({
    title, description, priority, status,
    assignedTo: user._id, dueDate: daysFromNow(due), createdBy: admin._id,
  });

  await Task.create([
    t('Design login screen', 'Create a clean login and register layout.', 'Medium', 'Completed', rahul, -3),
    t('Set up MongoDB schema', 'User and Task models with references.', 'High', 'Completed', admin, -5),
    t('Build REST APIs', 'Auth, tasks and users endpoints with JWT.', 'High', 'In Progress', admin, 2),
    t('Kanban drag and drop', 'Move cards between columns and save status.', 'High', 'In Progress', rahul, 3),
    t('Write API documentation', 'Document endpoints in the README.', 'Low', 'To Do', sanjay, 7),
    t('Analytics charts', 'Status distribution and team workload charts.', 'Medium', 'Review', sanjay, 1),
    t('Fix mobile layout', 'Board should scroll nicely on small screens.', 'Medium', 'To Do', rahul, 5),
    t('Add toast notifications', 'Show feedback after every action.', 'Low', 'Review', rahul, 4),
    t('Deploy to production', 'Frontend on Vercel, backend on Render.', 'High', 'To Do', admin, 10),
    t('Write unit tests', 'Cover auth and task controllers.', 'Low', 'To Do', sanjay, -1),
  ]);

  console.log('Seeded! Demo logins:');
  console.log('  Admin  -> admin@taskflow.com  / admin123');
  console.log('  Member -> member@taskflow.com / member123');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
