from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime, date, timedelta
from database.supabase_client import supabase
from schemas.profile import ProfileUpdate

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

def calculate_streak(checkin_records):
    if not checkin_records:
        return 0
    
    parsed_dates = set()
    for record in checkin_records:
        created_at = record.get("created_at")
        if not created_at:
            continue
        try:
            # Parse datetime string, normalize timezone
            dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            parsed_dates.add(dt.date())
        except Exception:
            continue
            
    if not parsed_dates:
        return 0
        
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    # Streak can start today or yesterday
    current_date = today if today in parsed_dates else yesterday
    if current_date not in parsed_dates:
        return 0
        
    streak = 0
    while current_date in parsed_dates:
        streak += 1
        current_date -= timedelta(days=1)
        
    return streak

def get_dynamic_badges(checkin_records, streak):
    badges = []
    
    # 1. Streak Master: Streak >= 7
    if streak >= 7:
        badges.append({
            "title": "Streak Master",
            "desc": "Logged check-ins for 7 consecutive days.",
            "color": "text-orange-500 bg-orange-50 border-orange-100"
        })
        
    # 2. Hydra Hero: 3+ days with water intake >= 2.5L
    water_days = sum(1 for c in checkin_records if float(c.get("water_intake") or 0) >= 2.5)
    if water_days >= 3:
        badges.append({
            "title": "Hydra Hero",
            "desc": "Met water intake targets for 3 days.",
            "color": "text-blue-500 bg-blue-50 border-blue-100"
        })
        
    # 3. Sleep Deep: 3+ days with sleep hours >= 8
    sleep_days = sum(1 for c in checkin_records if float(c.get("sleep_hours") or 0) >= 8.0)
    if sleep_days >= 3:
        badges.append({
            "title": "Sleep Deep",
            "desc": "Averaged 8+ hours of sleep for 3 days.",
            "color": "text-indigo-500 bg-indigo-50 border-indigo-100"
        })
        
    # 4. Habit Master: logged 3+ daily check-ins
    if len(checkin_records) >= 3:
        badges.append({
            "title": "Habit Master",
            "desc": "Checked off all habits on your grid.",
            "color": "text-emerald-500 bg-emerald-50 border-emerald-100"
        })
        
    return badges

@router.get("/{user_id}")
def get_profile(user_id: str):
    try:
        # 1. Fetch user profile
        profile_res = (
            supabase
            .table("profiles")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        
        if not profile_res.data:
            # Create a profile if it doesn't exist
            profile_res = (
                supabase
                .table("profiles")
                .insert({"id": user_id})
                .execute()
            )
            
        profile = profile_res.data[0]
        
        # 2. Fetch daily checkins
        checkins_res = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        checkins = checkins_res.data or []
        
        # 3. Compute stats
        streak = calculate_streak(checkins)
        badges = get_dynamic_badges(checkins, streak)
        
        return {
            "success": True,
            "profile": {
                "full_name": profile.get("full_name") or "Explorer",
                "age": profile.get("age") or 28,
                "occupation": profile.get("occupation") or "Product Designer",
                "avatar_url": profile.get("avatar_url") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            },
            "stats": {
                "active_days": len(checkins),
                "current_streak": streak,
                "badges_unlocked": len(badges)
            },
            "achievements": badges
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}")
def update_profile(user_id: str, payload: ProfileUpdate):
    try:
        update_data = {}
        if payload.full_name is not None:
            update_data["full_name"] = payload.full_name
        if payload.age is not None:
            if payload.age == "":
                update_data["age"] = None
            else:
                try:
                    update_data["age"] = int(payload.age)
                except (ValueError, TypeError):
                    pass
        if payload.occupation is not None:
            update_data["occupation"] = payload.occupation
        if payload.avatar_url is not None:
            update_data["avatar_url"] = payload.avatar_url
            
        response = (
            supabase
            .table("profiles")
            .update(update_data)
            .eq("id", user_id)
            .execute()
        )
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": response.data[0] if response.data else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
