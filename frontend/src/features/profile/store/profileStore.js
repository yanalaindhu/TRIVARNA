import { create } from "zustand";

export const useProfileStore = create((set) => ({
  profileData: null,
  loading: false,
  error: null,
  lastSynced: null,
  isSynced: false,
  
  setProfileData: (data, isSynced = false) => set({ 
    profileData: data, 
    error: null,
    isSynced,
    lastSynced: new Date().toISOString() 
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearStore: () => set({ profileData: null, loading: false, error: null, lastSynced: null, isSynced: false }),
}));
