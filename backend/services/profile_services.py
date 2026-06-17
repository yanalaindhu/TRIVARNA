def calculate_mind_score(emotion_data, stress_data):

    mood = emotion_data.get("mood_score", 5)
    stress = stress_data.get("stress_level", 5)

    score = (mood * 10) - (stress * 5)

    return max(0, min(100, score))


def calculate_body_score(body_data):

    sleep_hours = body_data.get("sleep_hours", 6)

    score = (sleep_hours / 8) * 100

    return round(score)


def calculate_lifestyle_score(lifestyle_data):

    productivity = lifestyle_data.get(
        "productivity_score",
        5
    )

    return productivity * 10


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