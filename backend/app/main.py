from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from .auth.router import router as auth_router
from .projects.router import router as projects_router
from .tickets.router import router as tickets_router

app = FastAPI(title="Bug Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tickets_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Bug Tracker API"}
