# TRIVARNA Database Requirements

## Database Technology

- Supabase
- PostgreSQL

## Purpose

The database is responsible for storing user information, onboarding responses, wellness tracking data, AI-generated plans, goals, habits, schedules, journals, and burnout prediction data.

## Modules Supported

1. User Management
2. Onboarding Assessment
3. Profile Analysis
4. AI Planning
5. Daily Wellness Tracking
6. Journaling
7. Goal Tracking
8. Habit Tracking
9. Burnout Prediction
10. Adaptive Scheduling

## Tables

### profiles
Stores user profile information.

### onboarding_responses
Stores onboarding assessment answers.

### profile_analysis
Stores AI-generated onboarding analysis.

### ai_plans
Stores personalized plans generated after onboarding.

### daily_checkins
Stores daily wellness information.

### journals
Stores user journal entries.

### trivarna_scores
Stores Mind, Body, Lifestyle, and Overall scores.

### burnout_predictions
Stores burnout prediction results.

### goals
Stores user goals and progress.

### habits
Stores user habits.

### habit_logs
Stores habit completion history.

### schedules
Stores AI-generated schedules.

### schedule_tasks
Stores tasks inside schedules.

## Database Structure

auth.users
      │
      ▼
   profiles
      │
      ├── onboarding_responses
      ├── profile_analysis
      ├── ai_plans
      ├── daily_checkins
      ├── journals
      ├── trivarna_scores
      ├── burnout_predictions
      ├── goals
      ├── habits
      │      └── habit_logs
      └── schedules
             └── schedule_tasks