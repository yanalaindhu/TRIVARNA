from fastapi import APIRouter
from fastapi import HTTPException

from database.supabase_client import supabase

from schemas.habit import (
    HabitCreate,
    HabitLogCreate
)

router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)
@router.post("/")
async def create_habit(payload: HabitCreate):

    data = payload.model_dump(
        mode="json"
    )

    result = (
        supabase
        .table("habits")
        .insert(data)
        .execute()
    )

    return {
        "success": True,
        "habit": result.data
    }

@router.get("/{user_id}")
async def get_habits(user_id: str):

    result = (
        supabase
        .table("habits")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return result.data

@router.post("/logs")
async def create_habit_log(
    payload: HabitLogCreate
):

    data = payload.model_dump(
        mode="json"
    )

    result = (
        supabase
        .table("habit_logs")
        .insert(data)
        .execute()
    )

    return {
        "success": True,
        "log": result.data
    }