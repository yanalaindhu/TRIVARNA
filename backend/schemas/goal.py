from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class GoalCreate(BaseModel):
    user_id: UUID
    goal_name: str
    category: Optional[str] = None
    target_date: Optional[str] = None


class GoalUpdate(BaseModel):
    progress_percentage: int
    status: str