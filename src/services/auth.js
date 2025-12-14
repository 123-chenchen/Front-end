import api from "../utils/api";

// Login to backend (.NET)
export const login = async (username, password) => {
  const response = await api.post(
    "/Account/Login",
    { Username: username,
      Password: password },
    { 
      headers: { "Content-Type": "application/json" }
    }
  );

  // Save JWT token
  localStorage.setItem("recomovie_token", response.data.accessToken);
  return response.data;
};

// Get current authenticated user from backend
export const getUser = async () => {
  const response = await api.get("/UserAccount");
  return response.data;
};
