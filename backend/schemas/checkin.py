from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional


class CheckinCreate(BaseModel):
    user_id: UUID

    mood_score: int = Field(..., ge=1, le=10)
    stress_level: int = Field(..., ge=1, le=10)
    energy_level: int = Field(..., ge=1, le=10)

    sleep_hours: float = Field(..., ge=0, le=24)

    water_intake: float = Field(..., ge=0)

    exercise_minutes: int = Field(..., ge=0)

    productivity_score: int = Field(..., ge=1, le=10)

    notes: Optional[str] = None


class CheckinResponse(BaseModel):
    success: bool
    message: str