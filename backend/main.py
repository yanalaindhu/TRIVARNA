from fastapi import FastAPI

from routers import auth
from routers import checkins

from routers import dashboard
from routers import goals
from routers import habits
from routers import schedules
from routers import onboarding
app = FastAPI(
    title="TRIVARNA API"
)

app.include_router(auth.router)
app.include_router(checkins.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(habits.router)
app.include_router(schedules.router)
app.include_router(onboarding.router)