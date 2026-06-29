import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const addMemo = async (token, body) =>
  await axios.post(`${baseUrl}/memo/add-memo`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMemo = async (token) =>
  await axios.get(`${baseUrl}/memo/get-memo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const editMemo = async (token, body) =>
  await axios.post(`${baseUrl}/memo/edit-memo`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteMemo = async (token, body) =>
  await axios.post(`${baseUrl}/memo/delete-memo`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
