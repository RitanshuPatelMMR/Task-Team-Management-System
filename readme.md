# 🚀 Task & Team Management System

A modern full-stack Task & Team Management application built with role-based access control, project tracking, and task collaboration features.

---

# 📌 Overview

This project helps teams manage projects, assign tasks, and track progress efficiently.

It supports three different user roles:

- 👑 Admin
- 📋 Manager
- 💻 Developer

Each role has specific permissions and access levels inside the system.

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL

## Frontend
- React (Vite)
- Tailwind CSS v4
- Shadcn/ui

## Authentication & Security
- JWT Authentication
- bcrypt Password Hashing

---

# ✨ Features

- 🔐 Secure Authentication
- 👥 Role-Based Access Control
- 📁 Project Management
- ✅ Task Assignment & Tracking
- 📊 Task Status Updates
- ⚡ REST API Architecture
- 🎨 Responsive Modern UI
- 🔒 Protected Routes
- 🗂️ PostgreSQL Database Integration

---

# 👥 User Roles

## 👑 Admin
- Full system access
- Manage all users
- Manage projects and tasks

## 📋 Manager
- Create and manage projects
- Assign tasks to developers
- Track project progress

## 💻 Developer
- View assigned tasks
- Update task status
- Track personal work progress

---

# ⚙️ Installation & Setup

## 📋 Prerequisites

Before starting, make sure you have installed:

- Node.js 18+
- PostgreSQL 14+
- Git

---

# Step 1 — Clone Repository

```bash
git clone https://github.com/RitanshuPatelMMR/Task-Team-Management-System.git
cd Task-Team-Management-System
```

---

# Step 2 — Backend Setup

Move into backend directory:

```bash
cd backend
```

Copy environment file:

```bash
cp .env.example .env
```

Now open `.env` file and update the following values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=supersecretjwtkey123
JWT_EXPIRES_IN=7d
```

---

# Step 3 — Create PostgreSQL Database

Run the following command:

```bash
psql -U postgres -c "CREATE DATABASE taskmanager;"
```

---

# Step 4 — Run Database Schema / Backup

```bash
pg_dump -U postgres taskmanager > full_backup.sql
```

---

# Step 5 — Install Dependencies & Start Backend

```bash
npm install
npm run dev
```

If everything is configured correctly, you should see:

```bash
Server running on port 5000
```

Backend URL:

```bash
http://localhost:5000
```

---

# Step 6 — Frontend Setup

Move to frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start frontend server:

```bash
npm run dev
```

Frontend URL:

```bash
http://localhost:5173
```

---

# 🔐 Test Users

Use the following test accounts for development/testing:

| Role | Email | Password |
|------|------|------|
| Admin | admin@test.com | Admin@123 |
| Manager | karan@gmail.com | 12345 |
| Developer | john@gmail.com | 12345 |

---

# 📬 API Documentation

Import the following Postman collection:

```bash
TaskManager.postman_collection.json
```

Set Postman environment variable:

```bash
base_url = http://localhost:5000/api
```