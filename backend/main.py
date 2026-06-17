from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth
from routers import checkins
from routers import dashboard
from routers import goals
from routers import habits
from routers import schedules

app = FastAPI(
    title="TRIVARNA API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
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