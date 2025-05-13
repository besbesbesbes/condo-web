import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getChatInfoApi = async (token) =>
  await axios.get(`${baseUrl}/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addNewMsg = async (token, body) =>
  await axios.post(`${baseUrl}/chat/add`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
