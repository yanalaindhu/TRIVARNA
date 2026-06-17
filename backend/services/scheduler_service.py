def generate_schedule(
    stress_level: int,
    burnout_level: str,
    habits: list
):

    tasks = []

    tasks.append({
        "task_name": "Drink Water",
        "category": "Body",
        "start_time": "06:30",
        "end_time": "06:40"
    })

    tasks.append({
        "task_name": "Morning Walk",
        "category": "Body",
        "start_time": "07:00",
        "end_time": "07:30"
    })

    if stress_level >= 7:
        tasks.append({
            "task_name": "Meditation",
            "category": "Mind",
            "start_time": "20:00",
            "end_time": "20:20"
        })

    if burnout_level == "HIGH":
        tasks.append({
            "task_name": "Digital Detox",
            "category": "Mind",
            "start_time": "21:00",
            "end_time": "22:00"
        })

    current_hour = 9

    for habit in habits:

        tasks.append({
            "task_name": habit["habit_name"],
            "category": "Lifestyle",
            "start_time": f"{current_hour:02d}:00",
            "end_time": f"{current_hour + 1:02d}:00"
        })

        current_hour += 1

    return tasks