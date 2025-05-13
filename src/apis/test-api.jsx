import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const testDB = async () => await axios.get(`${baseUrl}/test`);
