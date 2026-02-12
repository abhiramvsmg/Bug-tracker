# Bug Tracker System

A modern, full-stack bug tracking application built with FastAPI and React. Track bugs, manage projects, and collaborate with your team efficiently.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with login and signup
- **Project Management**: Create and manage multiple projects
- **Bug/Ticket Tracking**: Create, update, and track bugs with detailed information
- **Kanban Board**: Visualize ticket workflow with drag-and-drop functionality
- **Team Collaboration**: Invite team members and assign tickets
- **Real-time Updates**: Live updates using modern web technologies
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login-page.png)

### Signup Page
![Signup Page](screenshots/signup-page.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Projects List
![Projects List](screenshots/projects-list.png)

### Create Project
![Create Project](screenshots/create-project.png)

### Ticket Details
![Ticket Details](screenshots/ticket-details.png)

### Kanban Board
![Kanban Board](screenshots/kanban-board.png)

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Relational database
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **JWT**: Secure authentication
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "BugTracker System App"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

The backend will run on `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Start the Backend**: Navigate to the backend directory and run `uvicorn app.main:app --reload`
2. **Start the Frontend**: Navigate to the frontend directory and run `npm run dev`
3. **Open Browser**: Visit `http://localhost:5173`
4. **Create Account**: Sign up with your email and password
5. **Start Tracking**: Create projects and start tracking bugs!

## 📁 Project Structure

```
BugTracker System App/
├── backend/
│   ├── app/
│   │   ├── auth/          # Authentication routes and logic
│   │   ├── projects/      # Project management
│   │   ├── tickets/       # Ticket/bug tracking
│   │   ├── database.py    # Database configuration
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── main.py        # FastAPI application
│   ├── migrations/        # Alembic migrations
│   ├── venv/             # Virtual environment
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
│
└── screenshots/          # Application screenshots
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/bugtracker
SECRET_KEY=your-secret-key-here
```

### Frontend (.env)
```env
VITE_API_URL=http://127.0.0.1:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Your Name - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- FastAPI documentation
- React documentation
- Tailwind CSS team
- PostgreSQL community
