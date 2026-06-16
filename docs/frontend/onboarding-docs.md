# TRIVARNA Onboarding Module Documentation

## 🔌 Backend API Handoff Specification

This handoff section defines the database schemas, API specs, validation parameters, authentication policies, and calculation models for the backend team to build APIs supporting the TRIVARNA onboarding module.

---

### 1. Database Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Onboarding Responses Table
CREATE TABLE onboarding_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 3. Profile Analysis Table
CREATE TABLE profile_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 4. AI Plans Table
CREATE TABLE ai_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wake_time VARCHAR(20) NOT NULL,
    sleep_target VARCHAR(20) NOT NULL,
    schedule JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Validation Rules

The backend validation layer must enforce the following rules for incoming payloads:

* **`lifeContext.role`**: Required. Must be one of: `student`, `working_professional`, `entrepreneur`, `freelancer`, `homemaker`, `other`.
* **`lifeContext.age`**: Required. Must be one of: `18-24`, `25-34`, `35-44`, `45+`.
* **`lifeContext.routine`**: Required. Must be one of: `mostly_studying`, `mostly_desk_work`, `mostly_active_work`, `mixed`.
* **`hydration`** (`bodyData.hydration`): Required. Integer. Minimum: `1`, Maximum: `10`.
* **`stressData` Fields**: Required. Dictionary of integers. Each rating value must be between `1` and `5` inclusive.
* **`lifestyleData` Fields**: Required. Dictionary of integers. Each rating value must be between `1` and `5` inclusive.
* **`balanceWheel` Values**: Required. Dictionary of integers. Each rating value must be between `1` and `10` inclusive.
* **`selectedGoals`** (`goals.selectedGoals`): Required. Array of strings. Minimum length: `1`.
* **`primaryGoal`** (`goals.primaryGoal`): Required. String value representing one of the values inside `selectedGoals`.
* **`sixMonthVision`** (`goals.sixMonthVision`): Optional. String. Maximum length: `1000` characters.
* **`version`** (API Payload Version): Required. String. Must equal `"1.0"`.

---

### 3. Authentication & Security

* **Authorization Format**: All onboarding endpoints must require a Bearer token.
  * Header: `Authorization: Bearer <JWT_TOKEN>`
* **Identity Extraction**: The backend must decode the JWT to identify the authenticated `user_id`.
* **Constraint**: The `user_id` parameter must never be sent in the request body from the frontend. It must be resolved strictly in the auth middleware from the token claims to prevent identity spoofing.

---

### 4. Response Formats

#### Success Response Format
Standard JSON wrapper envelope:
```json
{
  "success": true,
  "data": {}
}
```

#### Error Response Formats
Standardized schemas for application exceptions:

* **Validation Failures (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "hydration": "Value must be between 1 and 10",
      "goals.selectedGoals": "Array must contain at least 1 goal"
    }
  }
  ```
* **Unauthorized Access (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Unauthorized"
  }
  ```
* **Resource Deficit (404 Not Found)**:
  ```json
  {
    "success": false,
    "message": "Resource not found"
  }
  ```

---

### 5. Onboarding Lifecycle

* **Status Options**: `draft`, `completed`, `updated`.
* **Execution Rules**:
  1. **Save Draft**: Users can save progress intermediate steps. The record status remains `draft`.
  2. **Resume**: The frontend retrieves the existing `draft` responses to pre-populate inputs.
  3. **Completion & Updates**: Submitting the final step sets status to `completed`. Any subsequent profile modifications trigger status to `updated`.
  4. **Active Record Rule**: Each user has exactly **one** onboarding record. Subsequent submissions override previous states to avoid profile mismatch.

---

### 6. API Versioning

* Payloads must include `"version": "1.0"`.
* The database stores this version in `onboarding_responses.onboarding_version` to support database migration strategies if diagnostic questions expand in the future.

---

### 7. AI Plan & Schedule Generation Rules

The schedule engine must parse: `productiveWindow`, `primaryGoal`, `burnoutRisk`, `bodyData.sleep` (parsed to integer duration), and `bodyData.activity`.

#### Goal-Specific Tailoring Guidelines

* **`primaryGoal == "reduce_stress"`**
  * Increase mindfulness session frequency (add a secondary morning/evening breathing block).
  * Shorten contiguous work blocks to maximum 90 minutes. Insert mandatory 15-minute unplugged breaks.
  * Shift bedtime target 30 minutes earlier to increase recovery time.
* **`primaryGoal == "improve_sleep"`**
  * Shift screen sunset/digital disconnect block 30 minutes earlier.
  * Append evening relaxation instructions (reading, magnesium intake, low-light wind-down).
  * Set a strict static sleep wake cycle block in the schedule array.
* **`primaryGoal == "improve_focus"`**
  * Insert a dedicated 2-hour uninterrupted "⚡ Peak Deep Work Session" inside the user's `productiveWindow`.
  * Add a 30-minute afternoon research/skill building slot.
  * Minimize calendar micro-breaks around focus hours to avoid context switching.
* **`primaryGoal == "exercise_more"`**
  * Insert a 45-minute exercise/stretching block inside the morning or evening window.
  * Set 5-minute movement/mobility triggers every 3 hours.
* **`primaryGoal == "better_work_life_balance"`**
  * Hard cutoff for desk tasks at 6:00 PM.
  * Insert family/leisure slots in the evening blocks.
  * Set weekend recovery checklists.

#### Burnout-Specific Rules
* **`burnoutRisk == "High"`**
  * Force 20-minute restorative breaks after every deep focus task block.
  * Replace complex work directives with lighter administration tasks.
  * Push sleep target to 8.5+ hours.
  * Insert automatic 15-minute mindfulness breaks in both morning and afternoon schedules.

---

### 8. Future Extensibility

* **Wearable Integration Hooks**: The database schema uses JSONB. Future integrations (Fitbit, Apple Health, Google Fit) can persist raw activity profiles, steps, and resting heart rates directly inside the existing tables.
* **Digital Twin Engine**: The schema supports feeding values into neural network nodes to forecast weekly burnout indicators and generate "Future Self" health simulation profiles.

---

### 9. Backend Deliverables Checklist

The backend team is responsible for supplying:
1. **Authentication Middleware**: Resolves user token claims.
2. **Onboarding CRUD APIs**: Reads, writes, drafts, and updates.
3. **Validation Layer**: Asserts JSON field integrity.
4. **Score Calculation Engine**: Computes Mind, Body, and Lifestyle indices.
5. **Burnout Risk Engine**: Evaluates fatigue thresholds.
6. **AI Schedule Generator**: Tailors calendar events dynamically.
7. **PostgreSQL Persistence**: Manages database models and migrations.
8. **Profile Retrieval API**: Returns calculated scores and summaries.
9. **Onboarding Update API**: Overwrites old onboarding entries.
10. **Analytics API**: Aggregates population satisfaction metrics.
11. **Error Handling Middleware**: Standardizes HTTP status codes and responses.
12. **API Documentation**: OpenAPI / Swagger definition.
13. **Unit Tests**: Asserts algorithm math correctness.
14. **Integration Tests**: Tests authentication headers and endpoint paths.

---

### 10. Endpoints Reference (Frontend Specifications)

The frontend expects these structures:

#### A. Profile Summary API (`POST /api/onboarding/profile`)
Calculates balance scores (0–100%) and returns coach feedback:

```json
{
  "mindScore": 45,
  "bodyScore": 65,
  "lifestyleScore": 76,
  "overallScore": 61,
  "burnoutRisk": "Moderate",
  "coachSummary": "Your assessment reveals moderate strain. While you maintain decent alignment in your daily habits, there is minor friction between work demands and recovery time.",
  "strengths": [
    "Strong executive control and habit execution",
    "Clear awareness of primary personal growth targets"
  ],
  "risks": [
    "Potential risk of burnout due to overcommitment",
    "Sleep deficits impairing afternoon focus"
  ],
  "focusAreas": [
    "Reduce Stress",
    "Better Work-Life Balance"
  ],
  "productiveWindow": "Morning",
  "primaryGoal": "Reduce Stress"
}
```

##### Evaluation Algorithms
1. **Mind Score (Stress assessment)**: 9 stress items. Max points 45, min points 9. The backend should reverse score values for positive items: `wakeUpRefreshed`, `timeToRecover`, `motivatedToStart` (reversal formula: `reversed_score = 6 - raw_score`). Sum all scores:
   $$\text{Mind Score \%} = \text{round}\left(\frac{45 - \text{stressSum}}{36} \times 100\right)$$
2. **Body Score (Physical health index)**: Starts at a base of 50. Add/subtract points based on sleep (`7-8h`/`8+h` adds 20; `6-7h` adds 10; others subtract 15), activity (`moderately_active`/`very_active` adds 20; `lightly_active` adds 10; sedentary subtracts 10), and hydration (adds `(hydration - 5) * 3`). Clamp output between 15% and 100%.
3. **Lifestyle Score (Discipline metric)**: 5 lifestyle items. Max points 25, min points 5. Procrastination is reversed (`6 - raw_score`), others are added directly. Sum scores and divide by 25 to get percentage.
4. **Overall Score**: Average of the 8 categories in `balanceWheel`.
5. **Burnout Risk**: "High" if 5 or more stress items (excluding reversed keys) are rated $\ge 4$. "Moderate" if between 2 and 4 items are $\ge 4$. Otherwise "Low".

#### B. Daily Schedule AI Plan API (`POST /api/onboarding/plan`)
Calculates a routine structure utilizing the `productiveWindow` parameter:

```json
{
  "wakeTime": "06:30 AM",
  "sleepTarget": "10:30 PM",
  "schedule": [
    {
      "period": "Morning",
      "time": "06:00 AM - 12:00 PM",
      "items": [
        { "time": "06:30 AM", "label": "Wake up & immediate hydration (1 glass)" },
        { "time": "07:00 AM", "label": "Mindfulness block: 10 mins box breathing", "type": "mindfulness" },
        { "time": "08:30 AM", "label": "⚡ Peak Deep Work: Strategy, Coding, or Writing", "type": "work" }
      ]
    },
    {
      "period": "Afternoon",
      "time": "12:00 PM - 05:00 PM",
      "items": [
        { "time": "12:30 PM", "label": "Nutritious protein lunch & 15-minute unplugged walk", "type": "break" },
        { "time": "02:00 PM", "label": "Core Execution: Creative & Desk Tasks", "type": "work" },
        { "time": "04:30 PM", "label": "Hydration alert & dynamic mobility stretching" }
      ]
    },
    {
      "period": "Evening",
      "time": "05:00 PM - 09:00 PM",
      "items": [
        { "time": "05:30 PM", "label": "Exercise Block: 30-minute functional strength/cardio", "type": "exercise" },
        { "time": "07:00 PM", "label": "Balanced dinner & light social connection", "type": "break" },
        { "time": "08:15 PM", "label": "Leisure, Reading, and Low-energy Chores" }
      ]
    },
    {
      "period": "Night",
      "time": "09:00 PM - Wake",
      "items": [
        { "time": "09:30 PM", "label": "Screen sunset: digital devices disconnected" },
        { "time": "10:00 PM", "label": "Wind-down routine & screen-off preparation" },
        { "time": "10:30 PM", "label": "Bedtime target: aiming for 6-7 Hours sleep", "type": "sleep" }
      ]
    }
  ]
}
```

##### Schedule Tailoring Rules
* **Wake Time**: Calculate wake target depending on `productiveWindow`: `early_morning` -> 5:00 AM; `morning` -> 6:30 AM; `afternoon`/`evening` -> 7:30 AM; `late_night` -> 8:30 AM.
* **Sleep Target**: Position target bedtime between 7.5 to 8.5 hours before the wake target.
* **Deep Work Label**: Insert a high-cognitive-load focus slot marked with `"type": "work"` directly inside the client's `productiveWindow` period.

---

## 🎨 Design System & Styling (Frontend Reference)

The onboarding interface is built with a clean SaaS aesthetic, rounded corners (12px–16px), micro-shadows, and smooth transitions on focus hours, selection grids, and charts.

### Tailwind Color Mapping
Configured in [tailwind.config.js](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/tailwind.config.js):
* **Primary Purple** (`bg-primary-purple`, `text-primary-purple`): `#6C4CF1` — Used for active selection card borders, button baselines, active stepper fills, and focus scores.
* **Secondary Purple** (`text-secondary-purple`): `#8B6CFF` — Used for subtitles and secondary visual highlights.
* **Light Purple** (`bg-light-purple`): `#F3F0FF` — Used for selected card backgrounds, dynamic tags, and badge slots.
* **Text Primary** (`text-text-primary`): `#111827` — Body font headers.
* **Text Secondary** (`text-text-secondary`): `#6B7280` — Descriptions.
* **Success Green** (`text-success-green`): `#22C55E` — Used for positive scores, strengths, and stable wellness items.
* **Warning Yellow** (`text-warning-yellow`): `#F59E0B` — Used for moderate burnout indicators and break alerts.
* **Danger Red** (`text-danger-red`): `#EF4444` — Used for validation errors, burnout alerts, and work tags.

---

## 🧭 Onboarding Steps Flow

The onboarding coordinator ([Onboarding.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/Onboarding.jsx)) leads the user through **13 sequential steps**:

1. **Welcome Screen** ([WelcomeStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/WelcomeStep.jsx)): Intro to TRIVARNA (Mind • Body • Soul plan targets).
2. **Life Context** ([LifeContextStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/LifeContextStep.jsx)): Collects Role (Student, Professional, etc.), Age Group, and Daily Routine profile (Mostly desk, active, mixed).
3. **Emotional Wellbeing** ([EmotionStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/EmotionStep.jsx)): Multi-select checkboard of recent feelings. If negative options (Anxious, Sad, Overwhelmed, etc.) are highlighted, conditionally reveals a sub-question for emotional triggers (Work, Finances, relationships, etc.).
4. **Wellbeing Drivers** ([WellbeingDriversStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/WellbeingDriversStep.jsx)): Captures core recent life impacts (Time pressures, sleep, uncertainty, finances, etc. - multi-select).
5. **Stress Assessment** ([StressAssessmentStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/StressAssessmentStep.jsx)): 9-item Likert assessment mapping mental exhaust, disconnection difficulties, focus drops, and energy.
6. **Body Assessment** ([BodyAssessmentStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/BodyAssessmentStep.jsx)): Gathers average sleep hours, physical active tiers, peak circadian alertness hours, and a 1-10 slider hydration indicator.
7. **Productive Window** ([ProductiveHoursStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/ProductiveHoursStep.jsx)): Captures the specific focus time blocks (`productiveWindow`) to map intense tasks.
8. **Lifestyle Assessment** ([LifestyleAssessmentStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/LifestyleAssessmentStep.jsx)): 5-item Likert assessment mapping procrastination, work focus, and time management.
9. **Life Balance Wheel** ([BalanceWheelStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/BalanceWheelStep.jsx)): Sliders for 8 pillars (Mental, Physical, Career, Relationships, Growth, Finances, Leisure & Fun, Daily Routine) paired with a real-time updating **Recharts Radar Chart**.
10. **Goals Anchor** ([GoalsStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/GoalsStep.jsx)): Selects focus areas, dynamically creates single-select card choices for the primary anchor target, and records a 6-month vision statement.
11. **Calculations Screen** ([AnalysisStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/AnalysisStep.jsx)): Automatically displays progress computations for stress indicators, burnout levels, peak windows, and recommendation matrices using [LoadingAnalysis.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/LoadingAnalysis.jsx) for 3 seconds.
12. **Analysis Results** ([ResultsStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/ResultsStep.jsx)): Displays Mind/Body/Lifestyle scores, AI Life Coach Narrative assessment, burnout risk status (Low/Moderate/High), strengths, and risks list.
13. **First AI Plan** ([AIPlanStep.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/pages/onboarding/AIPlanStep.jsx)): Displays a morning-to-night personalized schedule (wake up times, mindfulness blocks, peak work, physical mobility, wind-down offset, sleep targets) with a redirect to the application dashboard.

---

## 🏗️ Technical Architecture

### 1. State Management (Zustand Store)
Located at [onboardingStore.js](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/store/onboardingStore.js).
Manages steps (`currentStep` 1 to 13), response dictionaries, and calculations results:
* `lifeContext`: `{ role, age, routine }`
* `emotionData`: `{ feelings: [], triggers: [] }`
* `wellbeingDrivers`: `[]`
* `stressData`: Likert values dictionary.
* `bodyData`: `{ sleep, activity, energeticTime, hydration }`
* `productiveWindow`: selected peak hours string.
* `lifestyleData`: Likert values dictionary.
* `balanceWheel`: Satisfaction levels (1-10) for the 8 pillars.
* `goals`: `{ selectedGoals: [], primaryGoal: '', sixMonthVision: '' }`
* `results`: Diagnostic outputs.
* `aiPlan`: Generated daily timeline blocks.

### 2. Service Layer
Located at [onboardingService.js](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/services/onboardingService.js).
Processes the questionnaire states using Promise mock functions:
* `submitOnboarding(data)`: resolves after data sync.
* `generateProfile(data)`: Dynamically calculates:
  * **Mind Score**: Scaled based on stress Likert answers (lower stress = higher score).
  * **Body Score**: Scaled based on sleep hours, activity level, and hydration numbers.
  * **Lifestyle Score**: Derived from execution habits.
  * **Overall Balance**: Average score of the 8 balance wheel pillars.
  * **Burnout Risk**: Evaluates high-tension nodes into Low, Moderate, or High classes.
  * **AI Summary narrative**: Selects matching coach commentary text.
* `generateAIPlan(data)`: Tailors daily times, peak deep work targets, and sleep targets based on user habits.

### 3. Reusable Component Dictionary
* [ProgressStepper.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/ProgressStepper.jsx): Progress trackers.
* [OptionCard.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/OptionCard.jsx): Interactive cards for single select options.
* [MultiSelectCard.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/MultiSelectCard.jsx): Dynamic icon checkboxes.
* [QuestionCard.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/QuestionCard.jsx): Spacers for query headings.
* [RatingScale.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/RatingScale.jsx): Handles Likert arrays and slider ranges.
* [NavigationButtons.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/NavigationButtons.jsx): Next/Prev/Submit control buttons.
* [ScoreCard.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/components/onboarding/ScoreCard.jsx): SVG rendering circle progress.

### 4. Routing Configuration
Located at [AppRoutes.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/routes/AppRoutes.jsx).
Includes:
* `/onboarding`: Renders `<Onboarding />`.
* `/dashboard`: Renders standard account dashboard summary with details of user's active goals and an onboarding reset action.
* Default redirects point directly to `/onboarding`.

