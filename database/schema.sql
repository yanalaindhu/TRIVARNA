CREATE TABLE profiles (
    id UUID PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

    full_name TEXT,
    age INT,
    occupation TEXT,
    avatar_url TEXT,

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



CREATE TABLE journals (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES profiles(id)
    ON DELETE CASCADE,

    content TEXT NOT NULL,

    emotion_detected TEXT,

    sentiment_score DECIMAL(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


 --Onboarding Responses Table
CREATE TABLE onboarding_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    life_context JSONB NOT NULL,
    emotion_data JSONB NOT NULL,
    wellbeing_drivers JSONB NOT NULL,
    stress_data JSONB NOT NULL,
    body_data JSONB NOT NULL,
    productive_window VARCHAR(50) NOT NULL,
    lifestyle_data JSONB NOT NULL,
    balance_wheel JSONB NOT NULL,
    goals JSONB NOT NULL,
    onboarding_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, completed, updated
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user queries
CREATE UNIQUE INDEX idx_onboarding_user_active ON onboarding_responses(user_id) WHERE (status = 'completed' OR status = 'updated');

--  Profile Analysis Table
CREATE TABLE profile_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mind_score INTEGER NOT NULL,
    body_score INTEGER NOT NULL,
    lifestyle_score INTEGER NOT NULL,
    overall_score INTEGER NOT NULL,
    burnout_risk VARCHAR(20) NOT NULL, -- Low, Moderate, High
    strengths JSONB NOT NULL,
    risks JSONB NOT NULL,
    focus_areas JSONB NOT NULL,
    coach_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Plans Table
CREATE TABLE ai_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    wake_time VARCHAR(20) NOT NULL,
    sleep_target VARCHAR(20) NOT NULL,
    schedule JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Future Self Predictions Table
CREATE TABLE future_self_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prediction_30_days TEXT NOT NULL,
    prediction_90_days TEXT NOT NULL,
    prediction_1_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);