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

        latest_profile = (
            supabase
            .table("profile_analysis")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        latest_plan = (
            supabase
            .table("ai_plans")
            .select("*")
            .eq("user_id", user_id)
            .order("generated_at", desc=True)
            .limit(1)
            .execute()
        )

        latest_onboarding = (
            supabase
            .table("onboarding_responses")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        latest_checkin = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        return {
            "profile":
                latest_profile.data[0]
                if latest_profile.data
                else None,

            "plan":
                latest_plan.data[0]
                if latest_plan.data
                else None,

            "onboarding":
                latest_onboarding.data[0]
                if latest_onboarding.data
                else None,

            "latest_checkin":
                latest_checkin.data[0]
                if latest_checkin.data
                else None
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )