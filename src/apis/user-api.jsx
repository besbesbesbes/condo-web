import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getUserInfoApi = async (token) =>
  await axios.get(`${baseUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const changePasswordApi = async (token, input) =>
  await axios.post(`${baseUrl}/user/change-password`, input, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
