from pydantic import BaseModel
from typing import Dict, Any


class OnboardingCreate(BaseModel):
    user_id: str

    life_context: Dict[str, Any]

    emotion_data: Dict[str, Any]

    wellbeing_drivers: Dict[str, Any]

    stress_data: Dict[str, Any]

    body_data: Dict[str, Any]

    productive_window: str

    lifestyle_data: Dict[str, Any]

    balance_wheel: Dict[str, Any]

    goals: Dict[str, Any]