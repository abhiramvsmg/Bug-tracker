Tech Stack
Frontend

React.js

Tailwind CSS

Axios

React Router

Backend

FastAPI (Python)

SQLAlchemy

PostgreSQL

JWT Authentication

Pydantic

Tools

Docker & Docker Compose

Swagger UI for API testing

Features

User registration and login with JWT authentication

Project creation and management

Ticket creation (bugs, tasks, features)

Assign tickets to users

Ticket status tracking

RESTful API design

Dockerized full-stack setup

Project Structure
bug-tracker/
│
├── backend/        # FastAPI backend
├── frontend/       # React frontend
├── docker-compose.yml
└── README.md

How to Run the Project
Prerequisites

Docker

Docker Compose

Steps

Clone the repository:

git clone https://github.com/abhiramvsmg/Bug-tracker.git
cd Bug-tracker


Start all services:

docker-compose up --build


Access the application:

Frontend: http://localhost:5173

Backend API: http://localhost:8000

Swagger Docs: http://localhost:8000/docs

API Endpoints (Sample)

POST /auth/register – Register user

POST /auth/login – Login user

GET /projects – List projects

POST /tickets – Create ticket

Current Status

Prototype stage with:

Authentication

Project APIs

Ticket APIs

Frontend integration

Dockerized environment

Future Improvements

Kanban board

Comments on tickets

Role-based access

File uploads

Cloud deployment

Author

Abhiram V
Computer Science Engineering Student
2022–2026

What to do now (2 steps)
Step 1: Replace README

In VS Code:

Open README.md

Replace everything with the content above

Save

Step 2: Push updated README to GitHub

In terminal:

git add README.md
git commit -m "Updated professional README"
git push