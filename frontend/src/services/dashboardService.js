import api from "./api";

export const getDashboard = async (userId) => {
  const res = await api.get(
    `/dashboard/${userId}`
  );

  return res.data;
};