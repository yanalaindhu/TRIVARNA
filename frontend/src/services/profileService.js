import api from "./api";

export const getProfile = async (userId) => {
  const response = await api.get(`/api/profile/${userId}`);
  return response.data;
};

export const updateProfile = async (userId, data) => {
  const response = await api.put(`/api/profile/${userId}`, data);
  return response.data;
};
