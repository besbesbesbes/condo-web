import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getReportInfoApi = async (token, body) =>
  await axios.post(`${baseUrl}/report`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
