def calculate_mind_score(
    mood_score: int,
    stress_level: int,
    energy_level: int
):

    score = (
        mood_score * 0.4 +
        (10 - stress_level) * 0.4 +
        energy_level * 0.2
    )

    return round(score * 10)


def calculate_body_score(
    sleep_hours: float,
    water_intake: float,
    exercise_minutes: int
):

    sleep_score = min((sleep_hours / 8) * 100, 100)

    water_score = min((water_intake / 3) * 100, 100)

    exercise_score = min((exercise_minutes / 30) * 100, 100)

    score = (
        sleep_score * 0.4 +
        water_score * 0.3 +
        exercise_score * 0.3
    )

    return round(score)


def calculate_lifestyle_score(
    productivity_score: int
):

    return productivity_score * 10


def calculate_overall_score(
    mind_score: int,
    body_score: int,
    lifestyle_score: int
):

    score = (
        mind_score * 0.35 +
        body_score * 0.35 +
        lifestyle_score * 0.30
    )

    return round(score)