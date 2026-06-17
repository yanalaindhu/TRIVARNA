from fastapi import APIRouter
from fastapi import HTTPException

from schemas.checkin import (
    CheckinCreate
)

from database.supabase_client import supabase

from services.score_service import (
    calculate_mind_score,
    calculate_body_score,
    calculate_lifestyle_score,
    calculate_overall_score
)
from services.burnout_service import (
    calculate_burnout_score
)

router = APIRouter(
    prefix="/checkins",
    tags=["Daily Checkins"]
)


@router.post("/")
async def create_checkin(payload: CheckinCreate):

    try:

        # -------------------------
        # Save Checkin
        # -------------------------

        checkin_data = payload.model_dump(
            mode="json"
        )

        supabase.table(
            "daily_checkins"
        ).insert(
            checkin_data
        ).execute()

        # -------------------------
        # Calculate Scores
        # -------------------------

        mind_score = calculate_mind_score(
            payload.mood_score,
            payload.stress_level,
            payload.energy_level
        )

        body_score = calculate_body_score(
            payload.sleep_hours,
            payload.water_intake,
            payload.exercise_minutes
        )

        lifestyle_score = calculate_lifestyle_score(
            payload.productivity_score
        )

        overall_score = calculate_overall_score(
            mind_score,
            body_score,
            lifestyle_score
        )

        burnout = calculate_burnout_score(
            payload.stress_level,
            payload.sleep_hours,
            payload.energy_level,
            payload.productivity_score
        )

        # -------------------------
        # Save Scores
        # -------------------------

        supabase.table(
            "trivarna_scores"
        ).insert(
            {
                "user_id": str(payload.user_id),
                "mind_score": mind_score,
                "body_score": body_score,
                "lifestyle_score": lifestyle_score,
                "overall_score": overall_score
            }
        ).execute()
        supabase.table(
            "burnout_predictions"
        ).insert(
            {
                "user_id": str(payload.user_id),
                "burnout_score": burnout["burnout_score"],
                "risk_level": burnout["risk_level"]
            }
        ).execute()

        # -------------------------
        # Response
        # -------------------------

        return {
            "success": True,
            "message": "Check-in saved successfully",

            "scores": {
                "mind_score": mind_score,
                "body_score": body_score,
                "lifestyle_score": lifestyle_score,
                "overall_score": overall_score
            },
            "burnout": burnout
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )