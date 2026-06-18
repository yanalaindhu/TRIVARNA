import api from "./api";

export const saveOnboarding = async (data) => {
  const res = await api.post(
    "/api/onboarding/save",
    data
  );
  return res.data;
};

export const completeOnboarding = async (userId) => {
  const res = await api.post(
    `/api/onboarding/complete/${userId}`
  );
  return res.data;
};

export const getOnboarding = async (userId) => {
  const res = await api.get(
    `/api/onboarding/${userId}`
  );
  return res.data;
};

export const generateProfile = async (userId) => {
  const res = await api.post(
    `/api/onboarding/complete/${userId}`
  );
  return res.data;
};

export const generateAIPlan = async (userId) => {
  const res = await api.post(
    `/api/onboarding/generate-plan/${userId}`
  );
  return res.data;
};