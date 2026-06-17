-- ==========================================
-- PROFILES
-- ==========================================

INSERT INTO profiles (
id,
full_name,
age,
occupation
)
VALUES (
'11111111-1111-1111-1111-111111111111',
'Demo User',
21,
'Student'
);

-- ==========================================
-- DAILY CHECKINS
-- ==========================================

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
'11111111-1111-1111-1111-111111111111',
8,
4,
7,
7.5,
2.5,
30,
8,
'Feeling productive today'
);

-- ==========================================
-- TRIVARNA SCORES
-- ==========================================

INSERT INTO trivarna_scores (
user_id,
mind_score,
body_score,
lifestyle_score,
overall_score
)
VALUES (
'11111111-1111-1111-1111-111111111111',
78,
82,
75,
78
);

-- ==========================================
-- BURNOUT PREDICTIONS
-- ==========================================

INSERT INTO burnout_predictions (
user_id,
burnout_score,
risk_level
)
VALUES (
'11111111-1111-1111-1111-111111111111',
25,
'Low'
);

-- ==========================================
-- GOALS
-- ==========================================

INSERT INTO goals (
user_id,
goal_name,
category,
target_date,
progress_percentage,
status
)
VALUES (
'11111111-1111-1111-1111-111111111111',
'Exercise Daily',
'Fitness',
'2026-12-31',
30,
'active'
);

-- ==========================================
-- HABITS
-- ==========================================

INSERT INTO habits (
id,
user_id,
habit_name,
category,
target_frequency
)
VALUES (
'22222222-2222-2222-2222-222222222222',
'11111111-1111-1111-1111-111111111111',
'Morning Walk',
'Health',
'Daily'
);

-- ==========================================
-- HABIT LOGS
-- ==========================================

INSERT INTO habit_logs (
habit_id,
completed,
completed_date
)
VALUES (
'22222222-2222-2222-2222-222222222222',
TRUE,
CURRENT_DATE
);

-- ==========================================
-- SCHEDULES
-- ==========================================

INSERT INTO schedules (
id,
user_id,
schedule_date,
generated_by_ai
)
VALUES (
'33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111',
CURRENT_DATE,
TRUE
);

-- ==========================================
-- SCHEDULE TASKS
-- ==========================================

INSERT INTO schedule_tasks (
schedule_id,
task_name,
category,
start_time,
end_time,
status
)
VALUES (
'33333333-3333-3333-3333-333333333333',
'Morning Meditation',
'Mind',
'07:00:00',
'07:15:00',
'pending'
);
