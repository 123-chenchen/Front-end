import React from "react";
import { useParams } from "react-router-dom";
import { ExitToApp } from "@mui/icons-material";
import { Box, Button, Typography, Avatar } from "@mui/material";

  // Load recomovie user
export default function RecomovieProfile() {
  const storedUser = JSON.parse(localStorage.getItem("recomovie_user"));
  const { id } = useParams();

  // Logout -> clear token and user fetch from POST Account/Login
  const logout = () => {
    localStorage.removeItem("recomovie_token");
    localStorage.removeItem("recomovie_user");
    window.location.href = "/";
  };
   
  // Wait??
  if (!storedUser) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Not logged in
        </Typography>
      </Box>
    );
  }

  // Personal profile
  return (
    <Box sx={{ padding: 3 }}>
      {/* Top bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>

      {/* Basic user info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2,
          mb: 4,
        }}
      >
        <Avatar sx={{ width: 56, height: 56, bgcolor: "#555" }}>
          {storedUser.username[0].toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h6">{storedUser.username}</Typography>
        </Box>
      </Box>

      {/* Wait for database part... */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        Favorite Movies
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, opacity: 0.7 }}>
        (Feature coming soon — Database is on progress...)
      </Typography>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Watchlist
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        (Feature coming soon — Database is on progress...)
      </Typography>
    </Box>
  );
}
