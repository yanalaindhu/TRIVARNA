def calculate_mind_score(emotion_data, stress_data):
    # emotion_data contains 'feelings' (list of strings)
    feelings = emotion_data.get("feelings", [])
    positives = {"happy", "calm", "excited", "motivated", "refreshed", "content", "peaceful", "energetic"}
    negatives = {"stressed", "anxious", "drained", "lonely", "sad", "angry", "overwhelmed", "exhausted", "tired"}
    
    feel_score = 70  # baseline
    for f in feelings:
        f_lower = f.lower()
        if f_lower in positives:
            feel_score += 10
        elif f_lower in negatives:
            feel_score -= 10
    feel_score = max(30, min(100, feel_score))
    
    # stress_data contains keys: mentallyExhausted, struggleToFocus, overwhelmed, wakeUpRefreshed, timeToRecover, emotionallyDrained, difficultToDisconnect, motivatedToStart, rushedOrBehind
    # Ratings are 1 to 5.
    stress_keys_normal = ["mentallyExhausted", "struggleToFocus", "overwhelmed", "rushedOrBehind", "emotionallyDrained", "difficultToDisconnect", "timeToRecover"]
    stress_keys_reversed = ["wakeUpRefreshed", "motivatedToStart"]
    
    stress_values = []
    for k in stress_keys_normal:
        val = stress_data.get(k, 3) # default middle rating
        try:
            stress_values.append(float(val))
        except (ValueError, TypeError):
            stress_values.append(3.0)
    for k in stress_keys_reversed:
        val = stress_data.get(k, 3)
        try:
            stress_values.append(6.0 - float(val))
        except (ValueError, TypeError):
            stress_values.append(3.0)
        
    avg_stress = sum(stress_values) / len(stress_values) if stress_values else 3.0
    # Map average stress (1 to 5) to score out of 100 (1 is 100%, 5 is 0%)
    stress_score = (5.0 - avg_stress) / 4.0 * 100
    
    # Combine: 40% feelings, 60% stress
    mind_score = (feel_score * 0.40) + (stress_score * 0.60)
    return max(0, min(100, round(mind_score)))


def calculate_body_score(body_data):
    # sleep: "<5 Hours", "5-6 Hours", "6-7 Hours", "7-8 Hours", "8+ Hours"
    sleep_str = body_data.get("sleep", "6-7 Hours")
    sleep_map = {
        "<5 Hours": 35,
        "5-6 Hours": 55,
        "6-7 Hours": 75,
        "7-8 Hours": 95,
        "8+ Hours": 100
    }
    sleep_score = sleep_map.get(sleep_str, 75)
    
    # activity: "sedentary", "lightly_active", "moderately_active", "very_active"
    activity_str = body_data.get("activity", "moderately_active")
    activity_map = {
        "sedentary": 40,
        "lightly_active": 65,
        "moderately_active": 85,
        "very_active": 100
    }
    activity_score = activity_map.get(activity_str, 85)
    
    # hydration: 1 to 10
    hydration_val = body_data.get("hydration", 5)
    try:
        hydration_score = float(hydration_val) * 10
    except (ValueError, TypeError):
        hydration_score = 50.0
    
    body_score = (sleep_score + activity_score + hydration_score) / 3
    return max(0, min(100, round(body_score)))


def calculate_lifestyle_score(lifestyle_data):
    # procrastinate: high is bad, others: high is good
    proc = lifestyle_data.get("procrastinate", 3)
    foc = lifestyle_data.get("focused", 3)
    hab = lifestyle_data.get("habits", 3)
    tm = lifestyle_data.get("timeManagement", 3)
    bal = lifestyle_data.get("balance", 3)
    
    try:
        proc_val = float(proc)
        foc_val = float(foc)
        hab_val = float(hab)
        tm_val = float(tm)
        bal_val = float(bal)
    except (ValueError, TypeError):
        proc_val = foc_val = hab_val = tm_val = bal_val = 3.0
    
    total = (6.0 - proc_val) + foc_val + hab_val + tm_val + bal_val
    lifestyle_score = (total / 25.0) * 100
    return max(0, min(100, round(lifestyle_score)))


def calculate_overall_score(
    mind_score,
    body_score,
    lifestyle_score
):
    return round(
        (mind_score +
         body_score +
         lifestyle_score) / 3
    )


def calculate_burnout_risk(
    mind_score,
    body_score
):
    avg = (mind_score + body_score) / 2
    if avg >= 70:
        return "LOW"
    elif avg >= 40:
        return "MODERATE"
    return "HIGH"