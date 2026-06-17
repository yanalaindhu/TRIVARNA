def calculate_burnout_score(
    stress_level: int,
    sleep_hours: float,
    energy_level: int,
    productivity_score: int
):

    burnout_score = (
        stress_level * 5 +
        max(0, (8 - sleep_hours) * 8) +
        (10 - energy_level) * 3 +
        (10 - productivity_score) * 2
    )

    burnout_score = min(round(burnout_score), 100)

    if burnout_score >= 70:
        risk_level = "HIGH"
    elif burnout_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "burnout_score": burnout_score,
        "risk_level": risk_level
    }