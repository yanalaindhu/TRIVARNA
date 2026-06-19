import api from "../../../services/api";

/**
 * Attempts to fetch user profile data from backend.
 * Safely catches any errors and returns null.
 */
export const fetchBackendProfile = async (userId) => {
  try {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.warn("profileService.fetchBackendProfile failed: ", error.message);
    return null;
  }
};

/**
 * Attempts to fetch dashboard data from backend.
 * Safely catches any errors and returns null.
 */
export const fetchBackendDashboard = async (userId) => {
  try {
    const response = await api.get(`/api/dashboard/${userId}`);
    return response.data;
  } catch (error) {
    console.warn("profileService.fetchBackendDashboard failed: ", error.message);
    return null;
  }
};

/**
 * Attempts to fetch onboarding profile data from backend.
 * Safely catches any errors and returns null.
 */
export const fetchBackendOnboardingProfile = async (userId) => {
  try {
    const response = await api.get(`/api/onboarding/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.warn("profileService.fetchBackendOnboardingProfile failed: ", error.message);
    return null;
  }
};
