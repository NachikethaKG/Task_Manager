# React + PostgreSQL To-Do App

Full-stack task manager built with React, Node.js/Express, and PostgreSQL.

## Prerequisites

- **Node.js** (v14+)
- **PostgreSQL** (v12+) installed and running
- **npm** or **yarn**

## Project Structure

```
react-postgres-todo/
├── client/          # React frontend (Create React App)
├── server/          # Express backend + PostgreSQL
│   ├── .env         # Environment variables (DB credentials)
│   ├── server.js    # API routes (CRUD for tasks)
│   ├── db-init.sql  # Database initialization script
│   └── setup-db.ps1 # PowerShell helper to create DB
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```powershell
# Backend
cd server
npm install

# Frontend
cd ..\client
npm install
```

### 2. Configure Database

Edit `server/.env` with your PostgreSQL credentials:

```env
PGHOST=localhost
PGUSER=postgres
PGDATABASE=todo_react_db
PGPASSWORD=your_password_here
PGPORT=5432

PORT=5000
```

### 3. Initialize Database

**Option A: Using psql directly**

```powershell
cd server
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -d postgres -f db-init.sql
```

**Option B: Using the setup script** (if psql is in PATH)

```powershell
cd server
.\setup-db.ps1
```

This creates:
- Database: `todo_react_db`
- Table: `tasks` (task_id, description, completed, created_at)

### 4. Start the Application

**Terminal 1 - Backend:**
```powershell
cd server
node server.js
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm start
# React app opens on http://localhost:3000
```

The React app proxies API requests to the Express server via the `proxy` setting in `client/package.json`.

## API Endpoints

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| GET    | `/api/tasks`     | Get all tasks                |
| POST   | `/api/tasks`     | Create a new task            |
| PUT    | `/api/tasks/:id` | Update task (toggle/edit)    |
| DELETE | `/api/tasks/:id` | Delete a task                |
| GET    | `/api/test`      | Health check                 |

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete (click task text)
- ✅ Delete tasks
- ✅ Tasks sorted by creation date (newest first)
- ✅ Persistent storage in PostgreSQL

## Technologies

- **Frontend:** React 19, Create React App
- **Backend:** Node.js, Express 5
- **Database:** PostgreSQL 17
- **Middleware:** CORS, dotenv
- **Client:** pg (node-postgres)

## Troubleshooting

**Database connection errors:**
- Verify PostgreSQL is running
- Check credentials in `server/.env`
- Ensure `todo_react_db` exists (run `db-init.sql`)

**Port conflicts:**
- Change `PORT=5000` in `server/.env` if needed
- Update proxy in `client/package.json` to match

**Module not found:**
- Run `npm install` in both `client/` and `server/`

## License

MIT
