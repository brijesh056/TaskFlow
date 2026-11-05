# TaskFlow – Kanban Task Manager

A simple MERN-stack Kanban board with drag-and-drop, role-based access (Admin / Member) and a Recharts analytics page.

## Features
- Register, login, logout with JWT + bcrypt password hashing
- Protected routes (frontend and backend)
- Role-based access: **Admin** creates / edits / deletes / assigns tasks and sees everything; **Member** sees only assigned tasks and can move them between columns
- Kanban board with 4 columns (To Do, In Progress, Review, Completed) – drag a card and the new status is saved in MongoDB
- Dashboard with stats, recent tasks, progress and priority summary
- Analytics: task status chart + team workload chart (real data)
- Responsive UI, loading / empty / error states, toast notifications

## Tech stack
**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, @dnd-kit/core, Recharts, Lucide React, react-hot-toast
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, CORS

## Screenshots
_Add screenshots here (login, dashboard, board, analytics)._

## Folder structure
```text
TaskFlow/
├── frontend/
│   └── src/ components/ pages/ layouts/ services/ context/ hooks/  App.jsx  main.jsx
├── backend/
│   ├── config/ controllers/ middleware/ models/ routes/
│   ├── server.js
│   └── seed.js
└── README.md
```

## Installation

You need Node.js 18+ and MongoDB (local, or a free MongoDB Atlas cluster).

### Backend
```bash
cd backend
npm install
npm run seed     # creates demo users + tasks
npm run dev      # http://localhost:5000
```

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Environment variables

`backend/.env`
```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=change_this_to_a_long_random_string
```

`frontend/.env`
```text
VITE_API_URL=http://localhost:5000/api
```

## Demo credentials (after `npm run seed`)
| Role   | Email                | Password  |
|--------|----------------------|-----------|
| Admin  | admin@taskflow.com   | admin123  |
| Member | member@taskflow.com  | member123 |
| Member | sanjay@taskflow.com  | member123 |

The login page also has one-click "Admin demo" / "Member demo" buttons.
Running `npm run seed` again resets all users and tasks.

## API overview
| Method | Endpoint                  | Access          |
|--------|---------------------------|-----------------|
| POST   | /api/auth/register        | Public          |
| POST   | /api/auth/login           | Public          |
| GET    | /api/auth/me              | Logged in       |
| GET    | /api/tasks                | Admin: all, Member: own |
| POST   | /api/tasks                | Admin           |
| GET    | /api/tasks/:id            | Admin / assignee |
| PUT    | /api/tasks/:id            | Admin           |
| DELETE | /api/tasks/:id            | Admin           |
| PATCH  | /api/tasks/:id/status     | Admin / assignee |
| GET    | /api/users                | Admin           |

Send the token as `Authorization: Bearer <token>`.

## Future improvements
- Comments and attachments on tasks
- Email / in-app notifications for due dates
- Drag to reorder cards inside a column
- Teams / projects, and admin-only role management
- Deployment guide (Vercel + Render + MongoDB Atlas)
