import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getTagTranApi = async (token, body) =>
  await axios.post(`${baseUrl}/tag/get-tag-tran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTagApi = async (token) =>
  await axios.get(`${baseUrl}/tag/get-tag`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const editTagTranApi = async (token, body) =>
  await axios.post(`${baseUrl}/tag/edit-tag-tran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
