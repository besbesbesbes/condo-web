import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (body) =>
  await axios.post(`${baseUrl}/auth/login`, body);
