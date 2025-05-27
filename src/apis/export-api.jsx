import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const exportReportApi = async (token, body) =>
  await axios.get(`${baseUrl}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });
