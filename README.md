# Bug Tracker – Issue Tracking System

A full-stack Bug Tracker application inspired by tools like **Jira, Linear, and ClickUp**.  
This system allows teams to manage projects, track bugs, assign tasks, and monitor progress.

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- FastAPI (Python)
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic

### Tools
- Docker & Docker Compose
- Swagger UI for API testing

---

## Features
- User registration and login with JWT authentication
- Workspace and project management
- Ticket creation (bugs, tasks, features)
- Kanban board with drag-and-drop
- Team collaboration and invites
- Priority and type filtering
- Ticket status tracking
- RESTful API design
- Dockerized full-stack setup

---

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Workspace Overview
![Workspace Overview](screenshots/workspace_overview.png)

### Projects Dashboard
![Projects](screenshots/projects.png)

### Kanban Board - Backlog
![Kanban Backlog](screenshots/kanban_backlog.png)

### Kanban Board - In Progress
![Kanban In Progress](screenshots/kanban_inprogress.png)

### Kanban Board - Done
![Kanban Done](screenshots/kanban_done.png)

### Team Invitations
![Invite Team](screenshots/invite_team.png)

### Priority Filter
![Priority Filter](screenshots/priority_filter.png)

### Type Filter
![Type Filter](screenshots/type_filter.png)

### Settings
![Settings](screenshots/settings.png)

---

## How to Run the Project

### Prerequisites
- Docker & Docker Compose
- OR Python 3.10+ and Node.js 18+

### Option 1: Using Docker

```bash
# Clone the repository
git clone https://github.com/abhiramvsmg/Bug-tracker.git
cd Bug-tracker

# Start all services
docker-compose up --build
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Project Structure

```
Bug-tracker/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── auth/     # Authentication routes
│   │   ├── projects/ # Project management
│   │   ├── tickets/  # Ticket management
│   │   └── main.py   # App entry point
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
└── docker-compose.yml
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is open source and available under the MIT License
