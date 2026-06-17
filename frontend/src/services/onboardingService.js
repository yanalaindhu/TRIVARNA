// Mock onboarding service simulating backend processing.

export const onboardingService = {
  /**
   * Submits the gathered onboarding data to the mock API server.
   */
  submitOnboarding: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 1500);
    });
  },

  /**
   * Processes responses to output personalized scores, insights, risk metrics, and coaching text.
   */
  generateProfile: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { stressData, bodyData, lifestyleData, balanceWheel, goals } = data;

        // --- Calculate Mind Score (derived from stress questions) ---
        // 9 questions, max points 45. Lower stress scores (reversed where necessary) = higher Mind Score
        // reversed questions: wakeUpRefreshed, timeToRecover, motivatedToStart
        let stressSum = 0;
        if (stressData) {
          Object.keys(stressData).forEach((key) => {
            const val = stressData[key] || 3;
            // if reversed, subtract from 6
            if (['wakeUpRefreshed', 'timeToRecover', 'motivatedToStart'].includes(key)) {
              stressSum += (6 - val);
            } else {
              stressSum += val;
            }
          });
        } else {
          stressSum = 27; // default average
        }
        // convert to 0-100 scale (where lower stress is better)
        // stressSum ranges from 9 (best) to 45 (worst)
        const mindScore = Math.max(10, Math.min(100, Math.round(((45 - stressSum) / 36) * 100)));

        // --- Calculate Body Score ---
        let bodyPoints = 50; // base
        if (bodyData) {
          // Sleep duration impact
          if (bodyData.sleep === '7-8 Hours' || bodyData.sleep === '8+ Hours') bodyPoints += 20;
          else if (bodyData.sleep === '6-7 Hours') bodyPoints += 10;
          else bodyPoints -= 15;

          // Activity level impact
          if (bodyData.activity === 'moderately_active' || bodyData.activity === 'very_active') bodyPoints += 20;
          else if (bodyData.activity === 'lightly_active') bodyPoints += 10;
          else bodyPoints -= 10;

          // Hydration impact
          const hyd = bodyData.hydration || 5;
          bodyPoints += (hyd - 5) * 3;
        }
        const bodyScore = Math.max(15, Math.min(100, bodyPoints));

        // --- Calculate Lifestyle Score ---
        // 5 questions, max points 25. High focused, habits, timeManagement, balance + Low procrastinate = better
        let lifestyleSum = 0;
        if (lifestyleData) {
          Object.keys(lifestyleData).forEach((key) => {
            const val = lifestyleData[key] || 3;
            if (key === 'procrastinate') {
              lifestyleSum += (6 - val);
            } else {
              lifestyleSum += val;
            }
          });
        } else {
          lifestyleSum = 15;
        }
        const lifestyleScore = Math.max(10, Math.min(100, Math.round((lifestyleSum / 25) * 100)));

        // --- Calculate Overall Balance Score ---
        // Average of the 8 categories in balanceWheel
        let balanceSum = 0;
        let count = 0;
        if (balanceWheel) {
          Object.keys(balanceWheel).forEach((key) => {
            balanceSum += balanceWheel[key] || 5;
            count++;
          });
        }
        const overallScore = count > 0 ? Math.round((balanceSum / (count * 10)) * 100) : 55;

        // --- Burnout Risk Evaluation ---
        let burnoutRisk = "Low";
        const highStressCount = stressData 
          ? Object.keys(stressData).filter(k => !['wakeUpRefreshed', 'timeToRecover', 'motivatedToStart'].includes(k) && stressData[k] >= 4).length
          : 0;
        if (highStressCount >= 5) {
          burnoutRisk = "High";
        } else if (highStressCount >= 2) {
          burnoutRisk = "Moderate";
        }

        // --- AI Coach Insight Generator ---
        let summaryText = "";
        const roleStr = data.lifeContext?.role?.replace('_', ' ') || "individual";
        const focusWindow = data.productiveWindow || "Morning";

        if (burnoutRisk === "High") {
          summaryText = `Based on your responses, you are currently experiencing high levels of stress and depletion as a ${roleStr}. Your Mind score of ${mindScore}% indicates significant cognitive fatigue. Our coaching recommendation is to prioritize emotional recovery and boundary setting immediately, leveraging your natural productive window in the ${focusWindow.replace('_', ' ')}.`;
        } else if (burnoutRisk === "Moderate") {
          summaryText = `Your assessment reveals moderate strain. While you maintain decent alignment in your daily habits, there is minor friction between work demands and recovery time. Cultivating consistent micro-habits during your peak ${focusWindow.replace('_', ' ')} will help stabilize your overall balance score.`;
        } else {
          summaryText = `You are maintaining a healthy baseline, with an overall balance score of ${overallScore}%. You have built solid foundational habits, particularly in managing day-to-day responsibilities. To reach peak performance, we will fine-tune your schedule around your most focused window in the ${focusWindow.replace('_', ' ')}.`;
        }

        // --- Generate Strengths & Risks ---
        const strengths = [];
        const risks = [];
        const focusAreas = [];

        // Strengths selection
        if (lifestyleScore > 70) strengths.push("Strong executive control and habit execution");
        if (bodyScore > 70) strengths.push("Excellent physiological recovery and physical energy");
        if (mindScore > 70) strengths.push("High resilience and emotional stability under load");
        if (strengths.length === 0) strengths.push("Eagerness to establish structured workflows");
        strengths.push("Clear awareness of primary personal growth targets");

        // Risks selection
        if (burnoutRisk === "High") risks.push("Severe risk of burnout due to overcommitment");
        if (bodyScore < 50) risks.push("Sleep deficits or physical inactivity impairing focus");
        if (lifestyleScore < 50) risks.push("Habit fragmentation or chronic procrastination patterns");
        if (risks.length === 0) risks.push("Potential misalignment between peak hours and chore timings");

        // Focus Areas mapping
        if (goals?.selectedGoals && goals.selectedGoals.length > 0) {
          goals.selectedGoals.forEach(g => {
            const formatted = g.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            focusAreas.push(formatted);
          });
        } else {
          focusAreas.push("Stress Reduction", "Time Management", "Restoration");
        }

        resolve({
          mindScore,
          bodyScore,
          lifestyleScore,
          overallScore,
          burnoutRisk,
          coachSummary: summaryText,
          strengths,
          risks,
          focusAreas,
          productiveWindow: focusWindow.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          primaryGoal: goals?.primaryGoal ? goals.primaryGoal.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Balance Plan"
        });
      }, 1000);
    });
  },

  /**
   * Creates a high-fidelity personalized schedule based on onboarding answers.
   */
  generateAIPlan: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prod = data.productiveWindow || 'morning';
        const sleepOpt = data.bodyData?.sleep || '7-8 Hours';
        
        let wakeTime = "06:30 AM";
        let sleepTarget = "10:30 PM";
        
        if (prod === 'early_morning') {
          wakeTime = "05:00 AM";
          sleepTarget = "09:30 PM";
        } else if (prod === 'late_night') {
          wakeTime = "08:30 AM";
          sleepTarget = "12:30 AM";
        } else if (prod === 'evening') {
          wakeTime = "07:30 AM";
          sleepTarget = "11:30 PM";
        }

        // Configure deep work based on peak window
        let morningTask = "Focus Session: Task Prioritization & Admin";
        let afternoonTask = "Core Execution: Creative & Desk Tasks";
        let eveningTask = "Leisure, Reading, and Low-energy Chores";
        let nightTask = "Wind-down routine & screen-off preparation";

        if (prod === 'early_morning') {
          morningTask = "⚡ Peak Deep Work: High Cognitive Challenge Tasks";
        } else if (prod === 'morning') {
          morningTask = "⚡ Peak Deep Work: Strategy, Coding, or Writing";
        } else if (prod === 'afternoon') {
          afternoonTask = "⚡ Peak Deep Work: Hard Technical Tasks & Coding";
        } else if (prod === 'evening') {
          eveningTask = "⚡ Peak Deep Work: Creative Brainstorming & Planning";
        } else if (prod === 'late_night') {
          nightTask = "⚡ Peak Deep Work: Solitary Deep Writing/Research";
        }

        resolve({
          wakeTime,
          sleepTarget,
          schedule: [
            {
              period: "Morning",
              time: "06:00 AM - 12:00 PM",
              items: [
                { time: wakeTime, label: "Wake up & immediate hydration (1 glass)" },
                { time: "07:00 AM", label: "Mindfulness block: 10 mins box breathing", type: "mindfulness" },
                { time: "08:30 AM", label: morningTask, type: "work" },
              ]
            },
            {
              period: "Afternoon",
              time: "12:00 PM - 05:00 PM",
              items: [
                { time: "12:30 PM", label: "Nutritious protein lunch & 15-minute unplugged walk", type: "break" },
                { time: "02:00 PM", label: afternoonTask, type: "work" },
                { time: "04:30 PM", label: "Hydration alert & dynamic mobility stretching" }
              ]
            },
            {
              period: "Evening",
              time: "05:00 PM - 09:00 PM",
              items: [
                { time: "05:30 PM", label: "Exercise Block: 30-minute functional strength/cardio", type: "exercise" },
                { time: "07:00 PM", label: "Balanced dinner & light social connection", type: "break" },
                { time: "08:15 PM", label: eveningTask },
              ]
            },
            {
              period: "Night",
              time: "09:00 PM - Wake",
              items: [
                { time: "09:30 PM", label: "Screen sunset: digital devices disconnected" },
                { time: "10:00 PM", label: nightTask },
                { time: sleepTarget, label: `Bedtime target: aiming for ${sleepOpt} sleep`, type: "sleep" }
              ]
            }
          ]
        });
      }, 800);
    });
  }
};
