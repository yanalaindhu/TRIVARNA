CREATE TABLE profiles (
    id UUID PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

    full_name TEXT,
    age INT,
    occupation TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES profiles(id),

    mood_score INT,
    stress_level INT,
    energy_level INT,

    sleep_hours NUMERIC,
    water_intake NUMERIC,
    exercise_minutes INT,

    productivity_score INT,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE trivarna_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES profiles(id),

    mind_score INT,
    body_score INT,
    lifestyle_score INT,

    overall_score INT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE burnout_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES profiles(id),

    burnout_score INT,

    risk_level TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES profiles(id),

    schedule_date DATE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE schedule_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    schedule_id UUID REFERENCES schedules(id),

    task_name TEXT,

    category TEXT,

    start_time TIME,
    end_time TIME,

    status TEXT DEFAULT 'pending'
);

CREATE TABLE trivarna_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES profiles(id),

    mind_score INT,
    body_score INT,
    lifestyle_score INT,

    overall_score INT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE burnout_predictions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES profiles(id),

    burnout_score INT,

    risk_level TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);


CREATE TABLE goals (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES profiles(id),

    goal_name TEXT NOT NULL,

    category TEXT,

    target_date DATE,

    progress_percentage INT DEFAULT 0,

    status TEXT DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE habits (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES profiles(id),

    habit_name TEXT NOT NULL,

    category TEXT,

    target_frequency TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE habit_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    habit_id UUID NOT NULL
    REFERENCES habits(id),

    completed BOOLEAN DEFAULT FALSE,

    completed_date DATE NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE schedules (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES profiles(id),

    schedule_date DATE NOT NULL,

    generated_by_ai BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE schedule_tasks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    schedule_id UUID NOT NULL
    REFERENCES schedules(id),

    task_name TEXT NOT NULL,

    category TEXT,

    start_time TIME,

    end_time TIME,

    status TEXT DEFAULT 'pending',

    created_at TIMESTAMPTZ DEFAULT NOW()

);



