import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

export const api = axios.create({
  baseURL,
  timeout: 60 * 1000, // One minute timeout
});
