from fastapi import APIRouter, HTTPException

from schemas.onboarding import OnboardingCreate
from database.supabase_client import supabase
from services.ai_plan_service import generate_plan
from services.email_service import send_email
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

def calculate_onboarding_recommendations(onboarding_data, mind_score, body_score, lifestyle_score):
    recs = []
    
    # Check goals
    goals = onboarding_data.get("goals", {})
    selected_goals = goals.get("selectedGoals", []) if isinstance(goals, dict) else []
    
    # 1. Mind Recommendations
    if mind_score < 70:
        recs.append("Integrate 10 minutes of daily mindfulness or breathwork to manage stress spikes.")
    if "reduce_stress" in selected_goals or "improve_mental_health" in selected_goals:
        recs.append("Dedicate a quiet window before sleep for reflective journaling to unload mental loops.")
    if not recs:
        recs.append("Practice regular mental check-ins to monitor daily stress changes.")
        
    # 2. Body Recommendations
    body_data = onboarding_data.get("body_data", {})
    sleep_str = body_data.get("sleep", "")
    hydration_val = body_data.get("hydration", 5)
    
    if body_score < 70 or sleep_str in ["<5 Hours", "5-6 Hours"]:
        recs.append("Restructure your sleep routine to target 7-8 hours of sleep, avoiding screens 1 hour before bed.")
    
    try:
        hyd = int(hydration_val)
    except (ValueError, TypeError):
        hyd = 5
        
    if hyd < 6:
        recs.append("Increase daily water intake to at least 8-10 glasses (2.5L) to optimize focus and energy.")
    if "exercise_more" in selected_goals:
        recs.append("Schedule three 30-minute physical sessions (cardio, strength, or yoga) per week.")
    if len(recs) < 3:
        recs.append("Maintain a consistent bedtime and waking routine to optimize circadian rhythm.")
        
    # 3. Life / Lifestyle Recommendations
    life_context = onboarding_data.get("life_context", {})
    occupation = life_context.get("occupation", "")
    
    if lifestyle_score < 70:
        recs.append("Implement structured study or work focus blocks (e.g. Pomodoro technique) to combat procrastination.")
    if "improve_focus" in selected_goals or "build_discipline" in selected_goals:
        recs.append("Utilize focused time blocks and disable non-essential digital notifications during key tasks.")
    if occupation in ["student", "working_professional"]:
        recs.append("Establish clear boundaries between study/work hours and offline leisure to prevent burnout.")
        
    # De-duplicate while preserving order
    seen = set()
    unique_recs = []
    for r in recs:
        if r not in seen:
            seen.add(r)
            unique_recs.append(r)
            
    return unique_recs[:4]

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

        # Update profiles table with age and occupation from life_context
        life_context = onboarding.get("life_context") or {}
        profile_update = {}
        if "age" in life_context and life_context["age"] != "":
            try:
                profile_update["age"] = int(life_context["age"])
            except (ValueError, TypeError):
                pass
        if "occupation" in life_context and life_context["occupation"]:
            profile_update["occupation"] = str(life_context["occupation"])

        if profile_update:
            try:
                supabase.table("profiles").update(profile_update).eq("id", user_id).execute()
            except Exception as e:
                print(f"Warning: Failed to update profiles table: {e}")

        # Compute dynamic focus areas (recommendations)
        dynamic_recs = calculate_onboarding_recommendations(
            onboarding,
            mind_score,
            body_score,
            lifestyle_score
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

                "strengths": [],
                "risks": [],
                "focus_areas": dynamic_recs,

                "coach_summary": "Your onboarding analysis is completed."
            })
            .execute()
        )

        # Archive previous completed/updated onboarding responses for this user to avoid unique key violation
        supabase.table("onboarding_responses").update({
            "status": "archived"
        }).eq("user_id", user_id).in_("status", ["completed", "updated"]).execute()

        # Mark onboarding complete

        supabase.table(
            "onboarding_responses"
        ).update({
            "status": "completed"
        }).eq(
            "id",
            onboarding["id"]
        ).execute()

        # Send onboarding results and recommendations email
        try:
            profile_res = supabase.table("profiles").select("email, full_name").eq("id", user_id).execute()
            if profile_res.data:
                user_email = profile_res.data[0].get("email")
                full_name = profile_res.data[0].get("full_name") or "Explorer"
                if user_email:
                    rec_html = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #6C4CF1;">Your TRIVARNA Onboarding Analysis Results 🌿</h2>
                            <p>Hi {full_name},</p>
                            <p>Great news! Your onboarding assessment analysis is complete. Below are your diagnostic wellbeing scores and personalized recommendations:</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr style="background-color: #F3F0FF;">
                                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Wellness Category</th>
                                    <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Score</th>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 10px;">🧠 Mind Score</td>
                                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #6C4CF1;">{mind_score}/100</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 10px;">💪 Body Score</td>
                                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #6C4CF1;">{body_score}/100</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 10px;">⚡ Lifestyle Score</td>
                                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #6C4CF1;">{lifestyle_score}/100</td>
                                </tr>
                                <tr style="background-color: #F8F8FC; font-weight: bold;">
                                    <td style="border: 1px solid #ddd; padding: 10px;">🌿 Overall Wellness Score</td>
                                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #22C55E;">{overall_score}/100</td>
                                </tr>
                            </table>

                            <p><strong>Burnout Risk Level:</strong> <span style="color: #EF4444; font-weight: bold;">{burnout_risk}</span></p>

                            <div style="background-color: #F9F9FA; padding: 15px; border-left: 4px solid #6C4CF1; margin: 20px 0; border-radius: 4px;">
                                <h3 style="margin-top: 0; color: #6C4CF1;">Coach Recommendations Summary:</h3>
                                <p style="font-style: italic;">"Your onboarding analysis is completed. Focus on consistent hydration, Posture during screen hours, and regular rest."</p>
                            </div>

                            <p>To view your full daily routine schedule, wellness trackers, and get more AI Coach insights, head over to your Dashboard.</p>
                            <br />
                            <p>Warmly,</p>
                            <p><strong>The TRIVARNA Team</strong></p>
                        </body>
                    </html>
                    """
                    send_email(user_email, "Your TRIVARNA Onboarding Recommendations & Results 🌿", rec_html)
        except Exception as email_err:
            print(f"Warning: Failed to send onboarding recommendations email: {email_err}")

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

        onboarding = (
            supabase
            .table("onboarding_responses")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        onboarding_data = onboarding.data[0] if onboarding.data else None

        plan = generate_plan(profile_data, onboarding_data)

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