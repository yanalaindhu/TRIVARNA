-- ==========================================
-- TRIVARNA SAMPLE DATA
-- ==========================================

-- Profile

INSERT INTO profiles (
    id,
    full_name,
    age,
    occupation
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo User',
    21,
    'Student'
);

-- Daily Check-In

INSERT INTO daily_checkins (
    user_id,
    mood_score,
    stress_level,
    energy_level,
    sleep_hours,
    water_intake,
    exercise_minutes,
    productivity_score,
    notes
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    8,
    4,
    7,
    7.5,
    2.5,
    30,
    8,
    'Feeling productive today'
);

-- Journal

INSERT INTO journals (
    user_id,
    content,
    emotion_detected,
    sentiment_score
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Today was a productive day.',
    'Happy',
    0.85
);

-- TRIVARNA Scores

INSERT INTO trivarna_scores (
    user_id,
    mind_score,
    body_score,
    lifestyle_score,
    overall_score
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    78,
    82,
    75,
    78
);

-- Burnout Prediction

INSERT INTO burnout_predictions (
    user_id,
    burnout_score,
    risk_level
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    25,
    'Low'
);

-- Goal

INSERT INTO goals (
    user_id,
    goal_name,
    category,
    target_date,
    progress_percentage,
    status
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Exercise Daily',
    'Fitness',
    '2026-12-31',
    30,
    'active'
);

-- Habit

INSERT INTO habits (
    id,
    user_id,
    habit_name,
    category,
    target_frequency
)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Morning Walk',
    'Health',
    'Daily'
);

-- Habit Log

INSERT INTO habit_logs (
    habit_id,
    completed,
    completed_date
)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    TRUE,
    CURRENT_DATE
);

-- Schedule

INSERT INTO schedules (
    id,
    user_id,
    schedule_date,
    generated_by_ai
)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    TRUE
);

-- Schedule Task

INSERT INTO schedule_tasks (
    schedule_id,
    task_name,
    category,
    start_time,
    end_time,
    status
)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Morning Meditation',
    'Mind',
    '07:00:00',
    '07:15:00',
    'pending'
);