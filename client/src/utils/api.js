import axios from "axios";

// In development, Vite's dev server proxy (see vite.config.js) forwards
// relative "/api" calls to the local Express server. In production (e.g. a
// Vercel-hosted frontend talking to a separately-hosted backend on Render),
// there's no proxy, so we point directly at the deployed API via env var.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // sends the httpOnly JWT cookie automatically
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token as a fallback for environments where cookies don't persist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global handler: if a 401 comes back, the session is invalid — clear local auth state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
