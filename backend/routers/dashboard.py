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

        latest_scores = (
            supabase
            .table("trivarna_scores")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        profile_data = latest_profile.data[0] if latest_profile.data else {}

        if latest_scores.data:
            profile_data["mind_score"] = latest_scores.data[0].get("mind_score", profile_data.get("mind_score"))
            profile_data["body_score"] = latest_scores.data[0].get("body_score", profile_data.get("body_score"))
            profile_data["lifestyle_score"] = latest_scores.data[0].get("lifestyle_score", profile_data.get("lifestyle_score"))
            profile_data["overall_score"] = latest_scores.data[0].get("overall_score", profile_data.get("overall_score"))

        # Fetch basic profiles info (name, age, occupation)
        user_profile_res = (
            supabase
            .table("profiles")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        if user_profile_res.data:
            user_prof = user_profile_res.data[0]
            for key, val in user_prof.items():
                if val is not None or key not in profile_data:
                    profile_data[key] = val

        return {
            "profile": profile_data if profile_data else None,

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