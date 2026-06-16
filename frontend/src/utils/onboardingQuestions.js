export const LIFE_CONTEXT_QUESTIONS = {
  role: {
    question: "What best describes you?",
    options: [
      { id: "student", label: "Student", desc: "Currently studying or pursuing academics" },
      { id: "working_professional", label: "Working Professional", desc: "Corporate, trade, or salaried employee" },
      { id: "entrepreneur", label: "Entrepreneur", desc: "Building a business or start-up" },
      { id: "freelancer", label: "Freelancer", desc: "Self-employed or contract consultant" },
      { id: "homemaker", label: "Homemaker", desc: "Managing household and family needs" },
      { id: "other", label: "Other", desc: "None of the above match my daily focus" },
    ]
  },
  ageGroup: {
    question: "Select your age group",
    options: [
      { id: "18-24", label: "18-24" },
      { id: "25-34", label: "25-34" },
      { id: "35-44", label: "35-44" },
      { id: "45+", label: "45+" },
    ]
  },
  dailyRoutine: {
    question: "What does your typical daily routine involve?",
    options: [
      { id: "mostly_studying", label: "Mostly Studying", desc: "Classes, lectures, reading, exam prep" },
      { id: "mostly_desk_work", label: "Mostly Desk Work", desc: "Sitting, computer screens, meetings" },
      { id: "mostly_active_work", label: "Mostly Active Work", desc: "Physical movement, standing, manual labor" },
      { id: "mixed", label: "Mixed Routine", desc: "Balance of sitting, moving, and offline tasks" },
    ]
  }
};

export const EMOTION_QUESTIONS = {
  feelings: {
    question: "How have you felt during the last 7 days?",
    options: [
      { id: "happy", label: "Happy", isPositive: true },
      { id: "calm", label: "Calm", isPositive: true },
      { id: "motivated", label: "Motivated", isPositive: true },
      { id: "neutral", label: "Neutral", isPositive: true },
      { id: "anxious", label: "Anxious", isPositive: false },
      { id: "overwhelmed", label: "Overwhelmed", isPositive: false },
      { id: "frustrated", label: "Frustrated", isPositive: false },
      { id: "sad", label: "Sad", isPositive: false },
      { id: "exhausted", label: "Exhausted", isPositive: false },
    ]
  },
  triggers: {
    question: "What contributes most to these feelings?",
    options: [
      { id: "work", label: "Work" },
      { id: "studies", label: "Studies" },
      { id: "relationships", label: "Relationships" },
      { id: "health", label: "Health" },
      { id: "family", label: "Family" },
      { id: "finances", label: "Finances" },
      { id: "other", label: "Other factors" },
    ]
  }
};

export const WELLBEING_DRIVERS_QUESTION = {
  question: "What has had the biggest impact on your wellbeing recently?",
  options: [
    { id: "work_studies", label: "Work / Studies", desc: "Job pressure, classes, academic loads" },
    { id: "deadlines", label: "Deadlines", desc: "Imminent targets, project delivery dates" },
    { id: "relationships", label: "Relationships", desc: "Partners, friendships, social circles" },
    { id: "family", label: "Family", desc: "Responsibilities, home climate, relatives" },
    { id: "health", label: "Health", desc: "Physical fitness, chronic issues, overall vitality" },
    { id: "finances", label: "Finances", desc: "Bills, budgets, savings, investments" },
    { id: "lack_of_time", label: "Lack of Time", desc: "Feeling rushed, over-committed, packed schedules" },
    { id: "sleep_problems", label: "Sleep Problems", desc: "Insomnia, restless nights, irregular routines" },
    { id: "uncertainty", label: "Uncertainty", desc: "Career shifts, life transitions, major changes" },
    { id: "other", label: "Other", desc: "Miscellaneous factors not listed" },
  ]
};

export const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" }
];

export const STRESS_QUESTIONS = [
  { id: "mentallyExhausted", label: "I often feel mentally exhausted" },
  { id: "struggleToFocus", label: "I struggle to focus" },
  { id: "overwhelmed", label: "I feel overwhelmed by responsibilities" },
  { id: "wakeUpRefreshed", label: "I wake up feeling refreshed", isReversed: true },
  { id: "timeToRecover", label: "I have enough time to recover", isReversed: true },
  { id: "emotionallyDrained", label: "I feel emotionally drained." },
  { id: "difficultToDisconnect", label: "I find it difficult to disconnect from work." },
  { id: "motivatedToStart", label: "I feel motivated to start my day.", isReversed: true },
  { id: "rushedOrBehind", label: "I often feel rushed or behind schedule." },
];

export const BODY_QUESTIONS = {
  sleep: {
    question: "Sleep Duration",
    options: [
      { id: "<5 Hours", label: "< 5 Hours" },
      { id: "5-6 Hours", label: "5 - 6 Hours" },
      { id: "6-7 Hours", label: "6 - 7 Hours" },
      { id: "7-8 Hours", label: "7 - 8 Hours" },
      { id: "8+ Hours", label: "8+ Hours" },
    ]
  },
  activity: {
    question: "Activity Level",
    options: [
      { id: "sedentary", label: "Sedentary", desc: "Little to no exercise, mostly sitting" },
      { id: "lightly_active", label: "Lightly Active", desc: "Light exercise/sports 1-3 days/week" },
      { id: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
      { id: "very_active", label: "Very Active", desc: "Hard exercise or physical job 6-7 days/week" },
    ]
  },
  energeticTime: {
    question: "Most Energetic Time",
    options: [
      { id: "morning", label: "Morning", desc: "Sunrise to mid-day (6 AM - 12 PM)" },
      { id: "afternoon", label: "Afternoon", desc: "Mid-day to dusk (12 PM - 5 PM)" },
      { id: "evening", label: "Evening", desc: "Dusk to bedtime (5 PM - 10 PM)" },
      { id: "night", label: "Night", desc: "Late night/early hours (10 PM - 6 AM)" },
    ]
  },
  hydration: {
    question: "Hydration Intake (Glasses per Day)",
    min: 1,
    max: 10
  }
};

export const PRODUCTIVE_HOURS_QUESTION = {
  question: "When do you usually feel most focused and productive?",
  options: [
    { id: "early_morning", label: "Early Morning", desc: "5:00 AM - 8:00 AM" },
    { id: "morning", label: "Morning", desc: "8:00 AM - 12:00 PM" },
    { id: "afternoon", label: "Afternoon", desc: "12:00 PM - 5:00 PM" },
    { id: "evening", label: "Evening", desc: "5:00 PM - 9:00 PM" },
    { id: "late_night", label: "Late Night", desc: "9:00 PM - 2:00 AM" }
  ]
};

export const LIFESTYLE_QUESTIONS = [
  { id: "procrastinate", label: "I procrastinate important tasks" },
  { id: "focused", label: "I stay focused during work", isReversed: true },
  { id: "habits", label: "I maintain consistent habits", isReversed: true },
  { id: "timeManagement", label: "I manage my time effectively", isReversed: true },
  { id: "balance", label: "I balance work and personal life", isReversed: true },
];

export const BALANCE_WHEEL_CATEGORIES = [
  { id: "mentalHealth", label: "Mental Health" },
  { id: "physicalHealth", label: "Physical Health" },
  { id: "career", label: "Career" },
  { id: "relationships", label: "Relationships" },
  { id: "personalGrowth", label: "Personal Growth" },
  { id: "finances", label: "Finances" },
  { id: "leisure", label: "Leisure & Fun" },
  { id: "routine", label: "Daily Routine" },
];

export const GOALS_QUESTION = {
  question: "Select your main areas of interest",
  options: [
    { id: "reduce_stress", label: "Reduce Stress", icon: "Smile" },
    { id: "improve_sleep", label: "Improve Sleep", icon: "Moon" },
    { id: "build_discipline", label: "Build Discipline", icon: "TrendingUp" },
    { id: "improve_focus", label: "Improve Focus", icon: "Target" },
    { id: "exercise_more", label: "Exercise More", icon: "Activity" },
    { id: "improve_mental_health", label: "Improve Mental Health", icon: "Heart" },
    { id: "reduce_screen_time", label: "Reduce Screen Time", icon: "MonitorOff" },
    { id: "better_work_life_balance", label: "Better Work-Life Balance", icon: "Clock" },
  ]
};
