import axios from "axios";
import { refreshIfNeeded } from "./authUtils";

export const spotifyClient = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_API_URL,
});

// Auto-inject valid token into every request
spotifyClient.interceptors.request.use(async (config) => {
  const token = await refreshIfNeeded();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
