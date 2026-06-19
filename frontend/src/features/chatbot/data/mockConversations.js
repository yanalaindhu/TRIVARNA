export const MOCK_CHIPS = {
  mind_rag: [
    { label: 'Analyze my stress', prompt: 'Analyze my stress' },
    { label: 'Mood trends', prompt: 'Mood trends' }
  ],
  body_rag: [
    { label: 'Sleep quality', prompt: 'Sleep quality' },
    { label: 'Hydration summary', prompt: 'Hydration summary' }
  ],
  lifestyle_rag: [
    { label: 'Productivity review', prompt: 'Productivity review' },
    { label: 'Habit consistency', prompt: 'Habit consistency' }
  ],
  hybrid_rag: [
    { label: 'Generate life balance summary', prompt: 'Generate life balance summary' },
    { label: 'Create balanced schedule', prompt: 'Create balanced schedule' }
  ]
};

export const MOCK_RESPONSES = {
  mind_rag: {
    'analyze my stress': {
      text: 'Based on your recent stress assessment logs, your stress levels appear **moderate**. You registered feeling "Overwhelmed" (3/5) and "Mentally Exhausted" (3/5) during your working hours. The logs indicate that cognitive load peaks around 3 PM, likely due to continuous desk sessions. Incorporating a 10-minute deep box-breathing break at 2:30 PM is highly recommended to prevent late-day exhaustion.',
      sources: ['Mood Logs Index', 'Stress Assessment Reports', 'journals Table']
    },
    'mood trends': {
      text: 'Analyzing your mood records over the past week reveals a **stable to positive trend** (averaging 7.2/10). On days where you selected "Motivated" and "Calm", your sleep duration was consistently above 7.5 hours. A slight dip (mood: 5/10, feelings: "Frustrated") was logged on Tuesday, coinciding with high stress levels and a lack of recovery time.',
      sources: ['Mood Logs Index', 'journals Table']
    },
    fallback: {
      text: 'I have successfully searched your Mind-RAG database (Mood logs, Journal entries, and Stress assessment files) for references to your query. While I didn\'t find an exact match for that phrase, your logs generally indicate good emotional resilience with minor cognitive fatigue during afternoon desk work. Try asking about your "stress" or "mood trends" for a detailed breakdown.',
      sources: ['Mood Logs Index', 'Stress Assessment Reports']
    }
  },
  body_rag: {
    'sleep quality': {
      text: 'Your sleep log data shows an average sleep duration of **6.8 hours** over the past 7 days (Sleep Quality Score: 85%). You experienced restless periods on nights following intense late-afternoon work blocks. To stabilize your deep sleep phases, I recommend establishing a strict "screen sunset" disconnect at 9:30 PM.',
      sources: ['Sleep Logs Index', 'Fitness & Exercise Trackers']
    },
    'hydration summary': {
      text: 'Your hydration intake averages **2.1 liters** (approx. 7 glasses) per day. This is slightly below your optimal target of 3.0 liters. Energy correlation indices show that on days when you logged 9+ glasses of water, your physical alert levels in the afternoon were 25% higher compared to dehydrated days.',
      sources: ['Hydration Intake Logs']
    },
    fallback: {
      text: 'I have queried your Body-RAG vector indices. Your physiological datasets show stable active energy, although hydration remains a primary focus area. Let me know if you would like me to summarize your "sleep quality" or "hydration summary"!',
      sources: ['Sleep Logs Index', 'Hydration Intake Logs']
    }
  },
  lifestyle_rag: {
    'productivity review': {
      text: 'Your productivity levels average **8/10**. Your highest focus window occurs during the Morning block (8 AM - 12 PM), where task completion rate is at 92%. A noticeable productivity lag occurs between 3 PM and 5 PM, which correlates with hydration drops. Shifting minor administrative tasks to this block can help optimize your cognitive energy.',
      sources: ['Productivity & Focus metrics', 'Active Goals Register']
    },
    'habit consistency': {
      text: 'You achieved an overall habit compliance rate of **82%** this week. Your "Drink Water" and "Morning Walk" habits are leading with 100% compliance. However, "Meditation" fell to 40% compliance. Habit-stacking suggestion: Try practicing 5 minutes of meditation immediately following your morning walk to anchor the habit.',
      sources: ['Habit Completion History', 'Productivity & Focus metrics']
    },
    fallback: {
      text: 'Lifestyle-RAG search completed. Your routine index shows strong compliance on foundational habits, but goals progress is lagging slightly on evening routines. Please ask about your "productivity review" or "habit consistency" for details.',
      sources: ['Active Goals Register', 'Habit Completion History']
    }
  },
  hybrid_rag: {
    'generate life balance summary': {
      text: 'Unified Multi-RAG balance synthesis completed. \n\n* **Overall Balance**: 74% (Healthy Baseline)\n* **🧠 Mind**: Moderate stress (3/5) with stable emotional resilience. Cognitive fatigue accumulates in the late afternoon.\n* **💪 Body**: Rest profile is slightly constrained (average 6.8h sleep). Hydration (2.1L) needs optimization.\n* **✨ Life (Lifestyle)**: Outstanding habit compliance (82%), but time-blocking needs adjustment around peak focus.\n\n**Key Recommendation**: Align your exercise block with your afternoon energy drop (around 5:30 PM) to reset cognitive load and promote better sleep onset.',
      sources: ['Unified TRIVARNA Vector Master']
    },
    'create balanced schedule': {
      text: 'Here is your RAG-optimized daily routine structure based on your complete history:\n\n* **06:30 AM**: Wake up & immediate hydration (1 glass)\n* **07:00 AM**: 🧠 Mindfulness: 10 mins box breathing\n* **08:30 AM**: ⚡ Peak Deep Work Session (Focus: Strategy & Execution)\n* **12:30 PM**: 💪 Lunch & 15-minute unplugged walk\n* **02:00 PM**: ⚡ Admin block (low cognitive demand tasks)\n* **05:30 PM**: 💪 Exercise block: 30-minute functional strength\n* **07:00 PM**: 🧠 Social connection & balanced dinner\n* **09:30 PM**: ⚡ Screen sunset (all digital inputs disconnected)\n* **10:30 PM**: 💪 Sleep routine (aiming for 7-8 hours)',
      sources: ['Unified TRIVARNA Vector Master']
    },
    fallback: {
      text: 'Hybrid-RAG master search completed. I have queried all your mind, body, and lifestyle databases. Ask me to "generate life balance summary" or "create balanced schedule" to see synthesized analyses.',
      sources: ['Unified TRIVARNA Vector Master']
    }
  }
};
