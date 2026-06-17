from fastapi import APIRouter, HTTPException

from schemas.onboarding import OnboardingCreate
from database.supabase_client import supabase
from services.ai_plan_service import generate_plan
router = APIRouter(
    prefix="/api/onboarding",
    tags=["Onboarding"]
)


@router.post("/save")
def save_onboarding(payload: OnboardingCreate):

    try:

        response = (
            supabase
            .table("onboarding_responses")
            .insert({
                "user_id": payload.user_id,

                "life_context": payload.life_context,
                "emotion_data": payload.emotion_data,
                "wellbeing_drivers": payload.wellbeing_drivers,
                "stress_data": payload.stress_data,
                "body_data": payload.body_data,

                "productive_window": payload.productive_window,

                "lifestyle_data": payload.lifestyle_data,

                "balance_wheel": payload.balance_wheel,

                "goals": payload.goals,

                "status": "draft"
            })
            .execute()
        )

        return {
            "success": True,
            "message": "Onboarding saved successfully",
            "data": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/{user_id}")
def get_onboarding(user_id: str):

    try:

        response = (
            supabase
            .table("onboarding_responses")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            return {
                "success": False,
                "message": "No onboarding found"
            }

        return {
            "success": True,
            "data": response.data[0]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
from services.profile_services import (
    calculate_mind_score,
    calculate_body_score,
    calculate_lifestyle_score,
    calculate_overall_score,
    calculate_burnout_risk
)
@router.post("/complete/{user_id}")
def complete_onboarding(user_id: str):

    try:

        response = (
            supabase
            .table("onboarding_responses")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Onboarding not found"
            )

        onboarding = response.data[0]

        # Calculate Scores

        mind_score = calculate_mind_score(
            onboarding["emotion_data"],
            onboarding["stress_data"]
        )

        body_score = calculate_body_score(
            onboarding["body_data"]
        )

        lifestyle_score = calculate_lifestyle_score(
            onboarding["lifestyle_data"]
        )

        overall_score = calculate_overall_score(
            mind_score,
            body_score,
            lifestyle_score
        )

        burnout_risk = calculate_burnout_risk(
            mind_score,
            body_score
        )

        # Save Analysis

        analysis = (
            supabase
            .table("profile_analysis")
            .insert({
                "user_id": user_id,
                "mind_score": mind_score,
                "body_score": body_score,
                "lifestyle_score": lifestyle_score,
                "overall_score": overall_score,
                "burnout_risk": burnout_risk,

                "strengths": [
                    "Motivated"
                ],

                "risks": [
                    "Stress Management"
                ],

                "focus_areas": [
                    "Sleep",
                    "Consistency"
                ],

                "coach_summary":
                "Your onboarding analysis is completed."
            })
            .execute()
        )

        # Mark onboarding complete

        supabase.table(
            "onboarding_responses"
        ).update({
            "status": "completed"
        }).eq(
            "id",
            onboarding["id"]
        ).execute()

        return {
            "success": True,
            "message": "Onboarding Completed",
            "analysis": analysis.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.post("/generate-plan/{user_id}")
def generate_ai_plan(user_id: str):

    try:

        profile = (
            supabase
            .table("profile_analysis")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not profile.data:
            raise HTTPException(
                status_code=404,
                detail="Profile analysis not found"
            )

        profile_data = profile.data[0]

        plan = generate_plan(profile_data)

        result = (
            supabase
            .table("ai_plans")
            .insert({
                "user_id": user_id,
                "wake_time": plan["wake_time"],
                "sleep_target": plan["sleep_target"],
                "schedule": plan["schedule"]
            })
            .execute()
        )

        return {
            "success": True,
            "plan": result.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/plan/{user_id}")
def get_plan(user_id: str):

    response = (
        supabase
        .table("ai_plans")
        .select("*")
        .eq("user_id", user_id)
        .order("generated_at", desc=True)
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return response.data[0]