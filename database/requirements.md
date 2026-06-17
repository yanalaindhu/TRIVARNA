# TRIVARNA Database Requirements

## Overview

The database is responsible for storing and managing all user, wellness, scheduling, AI, and personalization data required by the TRIVARNA platform.

## Database Technology

- Supabase
- PostgreSQL

## Core Objectives

- Store user profile information
- Track daily wellness check-ins
- Store journal entries
- Calculate and store TRIVARNA scores
- Manage goals and habits
- Generate and store AI schedules
- Store AI insights and recommendations
- Predict burnout risk
- Store AI conversation history
- Maintain user memory for personalization and RAG

## Tables

### 1. profiles
Stores user profile information.

### 2. daily_checkins
Stores daily wellness assessments including mood, stress, sleep, energy, hydration, exercise, and productivity.

### 3. journals
Stores user journal entries and emotion analysis results.

### 4. trivarna_scores
Stores Mind, Body, Lifestyle, and Overall Balance scores.

### 5. goals
Stores user goals and progress tracking.

### 6. habits
Stores user habits.

### 7. habit_logs
Stores habit completion records.

### 8. schedules
Stores AI-generated schedules.

### 9. schedule_tasks
Stores tasks generated inside each schedule.

### 10. ai_insights
Stores AI-generated recommendations and insights.

### 11. burnout_predictions
Stores burnout scores and risk levels.

### 12. conversations
Stores conversation history between the user and AI Coach.

### 13. user_memory
Stores long-term user memory used for personalization and RAG.

## Relationships

auth.users
    ↓
profiles
    ├── daily_checkins
    ├── journals
    ├── trivarna_scores
    ├── goals
    ├── habits
    │      └── habit_logs
    ├── schedules
    │      └── schedule_tasks
    ├── ai_insights
    ├── burnout_predictions
    ├── conversations
    └── user_memory

## Security

Row Level Security (RLS) will be enabled on all user-related tables to ensure users can access only their own data.

## Total Tables

13