import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const addTranMail = async (token, body) =>
  await axios.post(`${baseUrl}/mail/addTran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
