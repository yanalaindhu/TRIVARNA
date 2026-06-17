from datetime import date

from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.scheduler_service import generate_schedule

router = APIRouter(
    prefix="/schedules",
    tags=["Schedules"]
)


@router.post("/generate/{user_id}")
async def generate_daily_schedule(user_id: str):

    try:

        # Get latest checkin
        latest_checkin = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not latest_checkin.data:
            raise HTTPException(
                status_code=404,
                detail="No checkins found"
            )

        checkin = latest_checkin.data[0]

        # Get latest burnout prediction
        latest_burnout = (
            supabase
            .table("burnout_predictions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not latest_burnout.data:
            raise HTTPException(
                status_code=404,
                detail="No burnout data found"
            )

        burnout = latest_burnout.data[0]

        # Get user habits
        habits = (
            supabase
            .table("habits")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        # Generate tasks
        tasks = generate_schedule(
            stress_level=checkin["stress_level"],
            burnout_level=burnout["risk_level"],
            habits=habits.data
        )

        # Save schedule
        schedule_response = (
            supabase
            .table("schedules")
            .insert({
                "user_id": user_id,
                "schedule_date": str(date.today()),
                "generated_by_ai": True
            })
            .execute()
        )

        schedule_id = schedule_response.data[0]["id"]

        # Save schedule tasks
        for task in tasks:

            (
                supabase
                .table("schedule_tasks")
                .insert({
                    "schedule_id": schedule_id,
                    "task_name": task["task_name"],
                    "category": task["category"],
                    "start_time": task["start_time"],
                    "end_time": task["end_time"]
                })
                .execute()
            )

        return {
            "success": True,
            "message": "Schedule generated successfully",
            "schedule_id": schedule_id,
            "tasks": tasks
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{user_id}")
async def get_schedule(user_id: str):

    try:

        schedule = (
            supabase
            .table("schedules")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not schedule.data:
            return {
                "message": "No schedule found"
            }

        schedule_id = schedule.data[0]["id"]

        tasks = (
            supabase
            .table("schedule_tasks")
            .select("*")
            .eq("schedule_id", schedule_id)
            .execute()
        )

        return {
            "schedule": schedule.data[0],
            "tasks": tasks.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/test")
async def test_schedule():
    return {
        "message": "Schedules Router Working"
    }