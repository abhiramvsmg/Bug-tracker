# 🐛 Bug Tracker – Modern Issue Tracking System

<div align="center">

![Bug Tracker](https://img.shields.io/badge/Bug%20Tracker-Production%20Ready-success?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**A full-stack bug tracking and project management system inspired by Jira, Linear, and ClickUp**

[Features](#-features) • [Demo](#-screenshots) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation)

</div>

---

##  Live Demo
- **Frontend (Web App)**: [https://bug-tracker-omega-jade.vercel.app](https://bug-tracker-omega-jade.vercel.app)
- **Backend (API Docs)**: [https://bug-tracker-iv8v.onrender.com/docs](https://bug-tracker-iv8v.onrender.com/docs)
- **Database**: Managed on Supabase (PostgreSQL)

---

## 📋 Overview

Bug Tracker is a production-ready, full-stack issue tracking system designed for modern development teams. Built with FastAPI and React, it provides a seamless experience for managing projects, tracking bugs, and collaborating with your team.

### ✨ Key Highlights

- 🔐 **Secure Authentication** – JWT-based auth with role-based access control
- 📊 **Kanban Board** – Drag-and-drop interface for visual task management
- 👥 **Team Collaboration** – Invite members, assign tasks, and track progress
- 🎯 **Smart Filtering** – Filter by priority, type, status, and assignee
- 🚀 **RESTful API** – Well-documented API with Swagger UI
- 🐳 **Docker Ready** – One-command deployment with Docker Compose
- 📱 **Responsive Design** – Beautiful UI built with Tailwind CSS

---

## 🎯 Features

### Core Functionality
- ✅ User registration and authentication with JWT tokens
- ✅ Workspace and project management
- ✅ Ticket creation (bugs, tasks, features, improvements)
- ✅ Kanban board with drag-and-drop functionality
- ✅ Team invitations and member management
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Status tracking (Backlog, In Progress, Done)
- ✅ Advanced filtering and search
- ✅ User settings and profile management

### Technical Features
- 🔒 Secure password hashing with PBKDF2
- 🔑 JWT token-based authentication
- 🗄️ PostgreSQL database with SQLAlchemy ORM
- 🔄 Async database operations
- 📝 Comprehensive API documentation
- 🎨 Modern, responsive UI with Tailwind CSS
- 🧪 Production-ready code structure

---

## 📸 Screenshots

### Login & Authentication
<div align="center">
  <img src="screenshots/login.png" alt="Login Page" width="800"/>
  <p><em>Secure login with JWT authentication</em></p>
</div>

### Workspace Overview
<div align="center">
  <img src="screenshots/workspace_overview.png" alt="Workspace Overview" width="800"/>
  <p><em>Manage multiple workspaces and projects</em></p>
</div>

### Projects Dashboard
<div align="center">
  <img src="screenshots/projects.png" alt="Projects Dashboard" width="800"/>
  <p><em>View and manage all your projects</em></p>
</div>

### Kanban Board

<div align="center">
  <img src="screenshots/kanban_backlog.png" alt="Kanban Backlog" width="800"/>
  <p><em>Backlog view with all pending tasks</em></p>
</div>

<div align="center">
  <img src="screenshots/kanban_inprogress.png" alt="Kanban In Progress" width="800"/>
  <p><em>Track tasks currently in progress</em></p>
</div>

<div align="center">
  <img src="screenshots/kanban_done.png" alt="Kanban Done" width="800"/>
  <p><em>Completed tasks and achievements</em></p>
</div>

### Team Collaboration
<div align="center">
  <img src="screenshots/invite_team.png" alt="Team Invitations" width="800"/>
  <p><em>Invite team members to collaborate</em></p>
</div>

### Filtering & Organization

<div align="center">
  <img src="screenshots/priority_filter.png" alt="Priority Filter" width="800"/>
  <p><em>Filter tickets by priority level</em></p>
</div>

<div align="center">
  <img src="screenshots/type_filter.png" alt="Type Filter" width="800"/>
  <p><em>Organize by ticket type (bug, task, feature)</em></p>
</div>

### Settings
<div align="center">
  <img src="screenshots/settings.png" alt="Settings" width="800"/>
  <p><em>Customize your profile and preferences</em></p>
</div>

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance Python web framework |
| **SQLAlchemy** | SQL toolkit and ORM |
| **PostgreSQL** | Relational database |
| **Pydantic** | Data validation using Python type hints |
| **JWT** | Secure token-based authentication |
| **Alembic** | Database migration tool |
| **Uvicorn** | ASGI server implementation |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library for building interfaces |
| **Vite** | Next-generation frontend tooling |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **TanStack Query** | Data fetching and state management |
| **DND Kit** | Drag-and-drop functionality |
| **Axios** | HTTP client for API requests |
| **Lucide React** | Beautiful icon library |

### DevOps
- **Docker** – Containerization
- **Docker Compose** – Multi-container orchestration
- **Git** – Version control

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Docker** & **Docker Compose** (recommended)
- **OR** Python 3.10+ and Node.js 18+ (for manual setup)
- **PostgreSQL** 14+ (if not using Docker)

### Option 1: Docker Setup (Recommended) 🐳

The easiest way to run the entire application:

```bash
# Clone the repository
git clone https://github.com/abhiramvsmg/Bug-tracker.git
cd Bug-tracker

# Start all services (backend, frontend, database)
docker-compose up --build
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup 🔧

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with:
# DATABASE_URL=postgresql://user:password@localhost:5432/bugtracker
# SECRET_KEY=your-secret-key-here
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# VITE_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

---

## 📚 API Documentation

Once the backend is running, you can explore the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT token
- `GET /auth/me` – Get current user profile

#### Projects
- `GET /projects` – List all projects
- `POST /projects` – Create a new project
- `GET /projects/{id}` – Get project details
- `PUT /projects/{id}` – Update project
- `DELETE /projects/{id}` – Delete project

#### Tickets
- `GET /tickets` – List all tickets
- `POST /tickets` – Create a new ticket
- `GET /tickets/{id}` – Get ticket details
- `PUT /tickets/{id}` – Update ticket
- `DELETE /tickets/{id}` – Delete ticket
- `PATCH /tickets/{id}/status` – Update ticket status

---

## 📁 Project Structure

```
Bug-tracker/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── auth/              # Authentication module
│   │   │   ├── router.py      # Auth endpoints
│   │   │   ├── schemas.py     # Pydantic models
│   │   │   └── utils.py       # Auth utilities
│   │   ├── projects/          # Project management
│   │   │   ├── router.py      # Project endpoints
│   │   │   └── schemas.py     # Project schemas
│   │   ├── tickets/           # Ticket management
│   │   │   ├── router.py      # Ticket endpoints
│   │   │   └── schemas.py     # Ticket schemas
│   │   ├── database.py        # Database configuration
│   │   ├── models.py          # SQLAlchemy models
│   │   └── main.py            # FastAPI app entry point
│   ├── migrations/            # Alembic migrations
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container config
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── KanbanBoard.jsx
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Node dependencies
│   └── Dockerfile            # Frontend container config
│
├── screenshots/              # Application screenshots
├── docker-compose.yml        # Docker orchestration
└── README.md                 # This file
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bugtracker

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🚢 Deployment

### Deploy to Production

1. **Update environment variables** for production
2. **Build the Docker images**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. **Deploy to your hosting platform** (AWS, DigitalOcean, Render, etc.)

### Recommended Hosting Platforms
- **Backend**: Railway, Render, Heroku, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: Railway, Supabase, AWS RDS

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhiram**
- GitHub: [@abhiramvsmg](https://github.com/abhiramvsmg)
- Repository: [Bug-tracker](https://github.com/abhiramvsmg/Bug-tracker)

---

## 🙏 Acknowledgments

- Inspired by [Jira](https://www.atlassian.com/software/jira), [Linear](https://linear.app/), and [ClickUp](https://clickup.com/)
- Built with ❤️ using FastAPI and React
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ and ☕**

</div>
