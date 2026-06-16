import { create } from 'zustand';

const initialStoreState = {
  currentStep: 1,
  userProfile: {},
  lifeContext: {
    role: '',
    age: '',
    routine: '',
  },
  emotionData: {
    feelings: [], // array of string emotions
    triggers: [], // array of trigger strings (if negative selected)
  },
  wellbeingDrivers: [], // array of selected drivers
  stressData: {
    mentallyExhausted: 3,
    struggleToFocus: 3,
    overwhelmed: 3,
    wakeUpRefreshed: 3,
    timeToRecover: 3,
    emotionallyDrained: 3,
    difficultToDisconnect: 3,
    motivatedToStart: 3,
    rushedOrBehind: 3,
  },
  bodyData: {
    sleep: '',
    activity: '',
    energeticTime: '',
    hydration: 5,
  },
  productiveWindow: '', // focus window
  lifestyleData: {
    procrastinate: 3,
    focused: 3,
    habits: 3,
    timeManagement: 3,
    balance: 3,
  },
  balanceWheel: {
    mentalHealth: 5,
    physicalHealth: 5,
    career: 5,
    relationships: 5,
    personalGrowth: 5,
    finances: 5,
    leisure: 5,
    routine: 5,
  },
  goals: {
    selectedGoals: [],
    primaryGoal: '',
    sixMonthVision: '',
  },
  results: null,
  aiPlan: null,
};

export const useOnboardingStore = create((set) => ({
  ...initialStoreState,

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 13) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),

  updateLifeContext: (data) => set((state) => ({
    lifeContext: { ...state.lifeContext, ...data }
  })),

  updateEmotionData: (data) => set((state) => ({
    emotionData: { ...state.emotionData, ...data }
  })),

  updateWellbeingDrivers: (drivers) => set({
    wellbeingDrivers: drivers
  }),

  updateStressData: (data) => set((state) => ({
    stressData: { ...state.stressData, ...data }
  })),

  updateBodyData: (data) => set((state) => ({
    bodyData: { ...state.bodyData, ...data }
  })),

  updateProductiveWindow: (window) => set({
    productiveWindow: window
  }),

  updateLifestyleData: (data) => set((state) => ({
    lifestyleData: { ...state.lifestyleData, ...data }
  })),

  updateBalanceWheel: (data) => set((state) => ({
    balanceWheel: { ...state.balanceWheel, ...data }
  })),

  updateGoals: (data) => set((state) => ({
    goals: { ...state.goals, ...data }
  })),

  setResults: (results) => set({ results }),
  setAIPlan: (aiPlan) => set({ aiPlan }),

  resetOnboarding: () => set(initialStoreState),
}));
