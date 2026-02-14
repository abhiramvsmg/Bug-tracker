from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os

from .auth.router import router as auth_router
from .projects.router import router as projects_router
from .tickets.router import router as tickets_router

app = FastAPI(title="Bug Tracker API")

# Get allowed origins from environment variable or use defaults
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
)
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tickets_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Bug Tracker API"}
