import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getNewTranInfoApi = async (token) =>
  await axios.get(`${baseUrl}/new/new-tran-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addNewType = async (token, body) =>
  await axios.post(`${baseUrl}/new/add-new-type`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteType = async (token, body) =>
  await axios.post(`${baseUrl}/new/delete-type`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const editType = async (token, body) =>
  await axios.post(`${baseUrl}/new/edit-type`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addTran = async (token, body) =>
  await axios.post(`${baseUrl}/new/add-new-tran`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
