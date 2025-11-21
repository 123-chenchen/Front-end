import { Box, TextField, Button, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

// Import Redux dispatcher
import { useDispatch } from "react-redux";
import { setRecomovieUser } from "../features/auth";

export default function RecomovieLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch data from POST Account/Login
  const handleSubmit = async () => {
    try {
      const response = await fetch("https://localhost:7013/api/Account/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok && response.status !== 204) {
        alert("Invalid username or password");
        return;
      }

      // 204 → no JSON body
      let data = {};
      if (response.status !== 204) {
        data = await response.json();
      }

      // Use values only when they exist
      if (data.accessToken) {
        localStorage.setItem("recomovie_token", data.accessToken);
      }
      if (data.id && data.username) {
        localStorage.setItem(
          "recomovie_user",
          JSON.stringify({ id: data.id, username: data.username })
        );
      }

      // Tell Navbar to refresh login state
      window.dispatchEvent(new Event("storage-update"));

      dispatch(
        setRecomovieUser({
          user: {
            id: data.id ?? null,
            username: data.username ?? username, // fallback
          },
          token: data.accessToken ?? null
        })
      );

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check backend server.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 380,
          padding: "40px 30px",
          borderRadius: 3,
          background: "#1e1e1e",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            margin: "0 auto 10px",
            bgcolor: "#1976d2",
            width: 56,
            height: 56,
          }}
        >
          <LockOutlinedIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: 600, color: "#fff", mb: 3 }}>
          Login to Recomovie
        </Typography>

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": { background: "#ccc" }
          }}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiInputBase-root": { background: "#ccc" }
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 1,
            background: "#1976d2",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 2,
          }}
          onClick={handleSubmit}
        >
          Log In
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 3, color: "#aaaaaa", cursor: "pointer" }}
        >
          Forgot your password?
        </Typography>
      </Paper>
    </Box>
  );
}
