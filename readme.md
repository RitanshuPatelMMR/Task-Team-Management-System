# Task & Team Management System

Full-stack task management app with role-based access control.

## Tech Stack
- Backend: Node.js, Express.js, Sequelize, PostgreSQL
- Frontend: React (Vite), Shadcn/ui, Tailwind CSS v4
- Auth: JWT + bcrypt

## Roles
- **Admin:** Full access to all modules
- **Manager:** Manage projects and tasks
- **Developer:** View and update status of assigned tasks only

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Database
```sql
CREATE DATABASE taskmanager;
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in DB credentials and JWT_SECRET
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Test Users (register via API)
- Admin: admin@test.com / Admin@123
- Manager: manager@test.com / Manager@123
- Developer: dev@test.com / Dev@123

## API Docs
Import `TaskManager.postman_collection.json` into Postman.
Set environment variable `base_url = http://localhost:5000/api`