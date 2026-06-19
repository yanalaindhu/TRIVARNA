from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import auth
from routers import checkins
from routers import dashboard
from routers import goals
from routers import habits
from routers import schedules
from routers import onboarding
from routers import journals
from routers import coach
from routers import insights
from routers import future_self
from routers import reports
from routers import memory
from routers import rag
from routers import chat
from routers import timeline
from routers import chatbot
from routers import profile

app = FastAPI(
    title="TRIVARNA API"
)

# CORS CONFIGURATION
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",

    # Current Vercel URL
    "https://trivarna-frontend.vercel.app",

    # Future URLs
    "https://trivarna.vercel.app",
    "https://trivarna-ai.vercel.app",
    "https://trivarna-app.vercel.app",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(checkins.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(habits.router)
app.include_router(schedules.router)
app.include_router(onboarding.router)
app.include_router(journals.router)
app.include_router(coach.router)
app.include_router(insights.router)
app.include_router(future_self.router)
app.include_router(reports.router)
app.include_router(memory.router)
app.include_router(rag.router)
app.include_router(chat.router)
app.include_router(timeline.router)
app.include_router(chatbot.router)
app.include_router(profile.router)
