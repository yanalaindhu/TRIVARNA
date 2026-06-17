from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class HabitCreate(BaseModel):
    user_id: UUID
    habit_name: str
    category: Optional[str] = None
    target_frequency: Optional[str] = None


class HabitLogCreate(BaseModel):
    habit_id: UUID
    completed: bool
    completed_date: str