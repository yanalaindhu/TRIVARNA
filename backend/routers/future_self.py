from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.future_self_service import generate_future_prediction

router = APIRouter(
    prefix="/future-self",
    tags=["Future Self Simulator"]
)
@router.post("/{user_id}")
def future_self(user_id: str):

    try:

        checkins = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        goals = (
            supabase
            .table("goals")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        habits = (
            supabase
            .table("habits")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        journals = (
            supabase
            .table("journals")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        insights = (
            supabase
            .table("ai_insights")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        context = f"""
        Checkins:
        {checkins.data}

        Goals:
        {goals.data}

        Habits:
        {habits.data}

        Journals:
        {journals.data}

        Insights:
        {insights.data}
        """

        prediction = generate_future_prediction(
            context
        )

        supabase.table(
            "future_self_predictions"
        ).insert({
            "user_id": user_id,
            "prediction_30_days": prediction["30_days"],
            "prediction_90_days": prediction["90_days"],
            "prediction_1_year": prediction["1_year"]
        }).execute()

        return prediction

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{user_id}")
def get_future_self(user_id: str):

    try:

        result = (
            supabase
            .table("future_self_predictions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not result.data:
            return {
                "30_days": "Simulate your twin to view 30-day forecast.",
                "90_days": "Simulate your twin to view 90-day forecast.",
                "1_year": "Simulate your twin to view 1-year forecast."
            }

        pred = result.data[0]
        return {
            "30_days": pred.get("prediction_30_days"),
            "90_days": pred.get("prediction_90_days"),
            "1_year": pred.get("prediction_1_year")
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )