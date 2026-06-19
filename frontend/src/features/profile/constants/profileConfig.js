export const DEFAULT_USER_PROFILE = {
  name: "Sai Srikar",
  email: "saisrikar@trivarna.com",
  role: "Wellness Explorer",
  joinDate: "June 2026",
  streak: 12,
  level: 5,
};

export const DEFAULT_BALANCE_WHEEL = {
  mentalHealth: 7,
  physicalHealth: 6,
  career: 8,
  relationships: 7,
  personalGrowth: 9,
  finances: 5,
  leisure: 6,
  routine: 7,
};

export const DEFAULT_RESULTS = {
  mindScore: 75,
  bodyScore: 82,
  lifestyleScore: 68,
  overallScore: 75,
  burnoutRisk: "Moderate",
  coachSummary: "You are making steady progress toward balance. Your cognitive performance is high during morning periods, but your body profile indicates slightly elevated recovery demands. Focus on consistency in your night schedule to stabilize energy reserves.",
  productiveWindow: "9:00 AM - 12:00 PM",
  primaryGoal: "Build Stress Resilience & Focus Consistency",
  strengths: ["Highly Motivated", "Clear Focus Intent"],
  risks: ["Evening Stress Spikes", "Irregular Recovery Anchors"],
  focusAreas: ["Consistent Bedtime", "Mindful Micro-breaks"],
};

export const DEFAULT_AI_PLAN = {
  wakeTime: "07:00 AM",
  sleepTarget: "10:30 PM",
  schedule: [
    {
      period: "Morning",
      time: "07:00 AM - 12:00 PM",
      items: [
        { time: "07:00 AM", label: "Hydrate & Light Stretching", type: "exercise" },
        { time: "07:30 AM", label: "Mindfulness Breathing (5 min)", type: "mindfulness" },
        { time: "09:00 AM", label: "High-Priority Deep Focus Block", type: "work" },
      ],
    },
    {
      period: "Afternoon",
      time: "12:00 PM - 05:00 PM",
      items: [
        { time: "12:00 PM", label: "Nutritious Lunch & Sunshine Walk", type: "break" },
        { time: "02:00 PM", label: "Routine Tasks / Collaborations", type: "work" },
        { time: "04:00 PM", label: "Hydration Break & Reset", type: "break" },
      ],
    },
    {
      period: "Evening",
      time: "05:00 PM - 09:00 PM",
      items: [
        { time: "06:00 PM", label: "Aerobic Cardio or Strength Workout", type: "exercise" },
        { time: "07:30 PM", label: "Mindful Dinner & Digital Sunset Initiated", type: "mindfulness" },
      ],
    },
    {
      period: "Night",
      time: "09:00 PM - 10:30 PM",
      items: [
        { time: "09:15 PM", label: "Light Reading / Journaling", type: "break" },
        { time: "10:15 PM", label: "Wind down routine & Screen Lockout", type: "sleep" },
        { time: "10:30 PM", label: "Optimal Sleep Window Starts", type: "sleep" },
      ],
    },
  ],
};

export const DEFAULT_GOALS = {
  selectedGoals: ["Manage Stress", "Improve Sleep", "Increase Focus", "Work-Life Balance"],
  primaryGoal: "Build Stress Resilience & Focus Consistency",
  sixMonthVision: "To establish a resilient routine where work energy and personal wellness co-exist harmoniously without burnout cycles.",
};
