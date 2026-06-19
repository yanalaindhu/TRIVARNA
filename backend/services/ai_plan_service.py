def generate_plan(profile, onboarding=None):
    overall_score = profile.get("overall_score", 82)
    burnout_risk = profile.get("burnout_risk", "MODERATE")

    # Parse onboarding parameters
    life_context = {}
    body_data = {}
    productive_window = "morning"
    
    if onboarding:
        life_context = onboarding.get("life_context") or {}
        body_data = onboarding.get("body_data") or {}
        prod_win = onboarding.get("productive_window") or "morning"
        if isinstance(prod_win, list) and len(prod_win) > 0:
            productive_window = prod_win[0]
        else:
            productive_window = prod_win
        productive_window = str(productive_window).lower()

    # Determine wake_time and sleep_target based on productive window
    if "morning" in productive_window:
        wake_time = "06:00 AM"
        sleep_target = "10:00 PM"
        work_time = "09:00"
    elif "afternoon" in productive_window:
        wake_time = "07:30 AM"
        sleep_target = "11:30 PM"
        work_time = "14:00"
    elif "evening" in productive_window:
        wake_time = "08:00 AM"
        sleep_target = "12:00 AM"
        work_time = "17:00"
    elif "night" in productive_window:
        wake_time = "09:00 AM"
        sleep_target = "01:00 AM"
        work_time = "20:00"
    else:
        wake_time = "06:30 AM"
        sleep_target = "10:30 PM"
        work_time = "10:00"

    # Customize Work task label based on occupation
    occupation = str(life_context.get("occupation") or "").lower()
    if any(k in occupation for k in ["student", "study", "university", "college", "school", "learn"]):
        work_task = "Lecture Study & Revision"
    elif any(k in occupation for k in ["engineer", "developer", "programmer", "coder", "software", "tech"]):
        work_task = "Software Coding & Dev Sprint"
    elif any(k in occupation for k in ["designer", "artist", "creative", "writer", "architect"]):
        work_task = "Creative Design & Layouts"
    elif any(k in occupation for k in ["manager", "lead", "director", "executive", "admin", "owner"]):
        work_task = "Strategic Planning & Team Sync"
    elif any(k in occupation for k in ["doctor", "nurse", "medical", "health", "clinical"]):
        work_task = "Patient Care & Clinical Records"
    elif any(k in occupation for k in ["sales", "marketing", "business", "consultant"]):
        work_task = "Client Outreach & Campaigns"
    else:
        work_task = "Deep Focus Work Block"

    # Customize Exercise task label based on activity level
    activity = str(body_data.get("activity") or "").lower()
    if "sedentary" in activity:
        exercise_task = "Light Brisk Walk & Stretching"
        exercise_time = "16:30"
    elif "light" in activity:
        exercise_task = "Vinyasa Yoga & Flexibility Flow"
        exercise_time = "07:30"
    elif "moderate" in activity:
        exercise_task = "Exercise"  # Retain standard "Exercise" for Moderates
        exercise_time = "06:30"
    elif "very" in activity:
        exercise_task = "High-Intensity Strength Training"
        exercise_time = "06:00"
    else:
        exercise_task = "Daily Fitness Workout"
        exercise_time = "06:30"

    # Construct customized schedule
    schedule = []
    
    # 1. Add exercise task
    schedule.append({
        "time": exercise_time,
        "task": exercise_task,
        "category": "Body"
    })
    
    # 2. Add work task
    schedule.append({
        "time": work_time,
        "task": work_task,
        "category": "Lifestyle"
    })

    # 3. Add Mind Wellness / Relaxation / Journaling based on burnout risk
    if burnout_risk == "HIGH":
        med_time = "11:00" if "morning" in productive_window else "08:00"
        schedule.append({
            "time": med_time,
            "task": "Morning Meditation",
            "category": "Mind"
        })
        schedule.append({
            "time": "21:00",
            "task": "Digital Detox",
            "category": "Mind"
        })
    elif burnout_risk == "MODERATE":
        schedule.append({
            "time": "19:00",
            "task": "Reading",
            "category": "Mind"
        })
    else:
        schedule.append({
            "time": "20:00",
            "task": "Reflection Journal",
            "category": "Mind"
        })

    # Sort lexicographically by time
    schedule = sorted(schedule, key=lambda x: x["time"])

    return {
        "wake_time": wake_time,
        "sleep_target": sleep_target,
        "schedule": schedule
    }