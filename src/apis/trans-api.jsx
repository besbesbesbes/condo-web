import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getTransApi = async (token, body) =>
  await axios.post(`${baseUrl}/trans`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const editTranApi = async (token, body) =>
  await axios.post(`${baseUrl}/trans/edit-tran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteTranApi = async (token, body) =>
  await axios.post(`${baseUrl}/trans/delete-tran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
