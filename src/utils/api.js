// utils/api.js
import axios from "axios";

const API_BASE_URL = "https://localhost:7013/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT from personal login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("recomovie_token"); // 👈 correct key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401 (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token may be invalid or expired.");

      // 👇 clear *personal* session
      localStorage.removeItem("recomovie_token");
      localStorage.removeItem("recomovie_user");

      // 👇 send back to the correct login page
      window.location.href = "/recomovie-login";
    }
    return Promise.reject(error);
  }
);

export default api;
