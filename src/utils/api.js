import axios from "axios";

const API_BASE_URL = "http://45.77.248.87:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT from personal login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("recomovie_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token may be invalid or expired.");

      localStorage.removeItem("recomovie_token");
      localStorage.removeItem("recomovie_user");

      window.location.href = "/recomovie-login";
    }
    return Promise.reject(error);
  }
);

export default api;