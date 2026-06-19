from fastapi import APIRouter
from fastapi import HTTPException

from database.supabase_client import supabase

from schemas.goal import (
    GoalCreate,
    GoalUpdate
)

router = APIRouter(
    prefix="/goals",
    tags=["Goals"]
)
@router.post("/")
async def create_goal(payload: GoalCreate):

    try:
        from datetime import datetime, date
        if payload.target_date:
            try:
                target_dt = datetime.strptime(payload.target_date, "%Y-%m-%d").date()
                if target_dt < date.today():
                    raise HTTPException(
                        status_code=400,
                        detail="Target deadline date cannot be in the past."
                    )
            except ValueError:
                pass

        data = payload.model_dump(
            mode="json"
        )

        result = (
            supabase
            .table("goals")
            .insert(data)
            .execute()
        )

        return {
            "success": True,
            "goal": result.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/{user_id}")
async def get_goals(user_id: str):

    result = (
        supabase
        .table("goals")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return result.data
@router.patch("/{goal_id}")
async def update_goal(
    goal_id: str,
    payload: GoalUpdate
):

    result = (
        supabase
        .table("goals")
        .update(
            payload.model_dump()
        )
        .eq("id", goal_id)
        .execute()
    )

    return {
        "success": True,
        "goal": result.data
    }