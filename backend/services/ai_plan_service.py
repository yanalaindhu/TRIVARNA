def generate_plan(profile):

    overall_score = profile["overall_score"]
    burnout_risk = profile["burnout_risk"]

    wake_time = "06:00 AM"
    sleep_target = "10:00 PM"

    schedule = []

    if burnout_risk == "HIGH":

        schedule = [
            {
                "time": "07:00",
                "task": "Morning Meditation",
                "category": "Mind"
            },
            {
                "time": "09:00",
                "task": "Light Study Session",
                "category": "Lifestyle"
            },
            {
                "time": "17:00",
                "task": "Walk",
                "category": "Body"
            },
            {
                "time": "21:00",
                "task": "Digital Detox",
                "category": "Mind"
            }
        ]

    elif burnout_risk == "MODERATE":

        schedule = [
            {
                "time": "06:30",
                "task": "Exercise",
                "category": "Body"
            },
            {
                "time": "09:00",
                "task": "Deep Work",
                "category": "Lifestyle"
            },
            {
                "time": "19:00",
                "task": "Reading",
                "category": "Mind"
            }
        ]

    else:

        schedule = [
            {
                "time": "06:00",
                "task": "Workout",
                "category": "Body"
            },
            {
                "time": "09:00",
                "task": "Productive Work Block",
                "category": "Lifestyle"
            },
            {
                "time": "20:00",
                "task": "Reflection Journal",
                "category": "Mind"
            }
        ]

    return {
        "wake_time": wake_time,
        "sleep_target": sleep_target,
        "schedule": schedule
    }