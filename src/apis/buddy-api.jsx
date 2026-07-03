import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const requestBuddyApi = async (token, body) =>
  await axios.post(`${baseUrl}/buddy/request`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
