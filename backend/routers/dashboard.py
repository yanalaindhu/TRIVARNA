from fastapi import APIRouter
from fastapi import HTTPException

from database.supabase_client import supabase

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/{user_id}")
async def get_dashboard(user_id: str):

    try:

        latest_checkin = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        latest_score = (
            supabase
            .table("trivarna_scores")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        latest_burnout = (
            supabase
            .table("burnout_predictions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        return {
            "latest_checkin":
                latest_checkin.data[0]
                if latest_checkin.data
                else None,

            "latest_scores":
                latest_score.data[0]
                if latest_score.data
                else None,

            "latest_burnout":
                latest_burnout.data[0]
                if latest_burnout.data
                else None
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )