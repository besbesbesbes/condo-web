import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (body) =>
  await axios.post(`${baseUrl}/auth/login`, body);

export const registerApi = async (body) =>
  await axios.post(`${baseUrl}/auth/register`, body);
