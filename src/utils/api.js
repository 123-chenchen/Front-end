import axios from "axios";

const API_BASE_URL = "http://45.77.248.87:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auto attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout if the token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token may be invalid or expired.");
      localStorage.removeItem("token");
      
      // Redirect to login:
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
