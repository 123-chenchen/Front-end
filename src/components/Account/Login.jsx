import LiveTvIcon from "@mui/icons-material/LiveTv";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import background from "../../assets/background/background.png";
import blueLogo from "../../assets/logo/bluelogo.png";
import redLogo from "../../assets/logo/redlogo.png";
import { loginWithRecomovie } from "../../features/recomovielogin";
import { fetchToken } from "../../utils";
import styles from "./styles";

export default function LoginPage({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const sx = styles(theme);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const logo = theme.palette.mode === "dark" ? redLogo : blueLogo;

  const from =
    (typeof location.state?.from === "string" && location.state.from) ||
    sessionStorage.getItem("auth_from") ||
    "/";
  const safeFrom = from.startsWith("/login") ? "/" : from;

  // TMDB login
  const handleTMDbLogin = () => {
    sessionStorage.setItem("auth_from", safeFrom);
    fetchToken();
  };

  // Recomovie login
  const handleRecomovieLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      await loginWithRecomovie(dispatch, { username, password });
      onClose?.();
      sessionStorage.removeItem("auth_from");
      navigate(safeFrom, { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed. Backend error.");
    }
  };

  return (
    <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={sx.overlay} />

      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>

      <Box sx={sx.content}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Sign In
          </Typography>

          {/* TMDb login*/}
          <Button
            variant="outlined"
            onClick={handleTMDbLogin}
            color={
              theme.palette.mode === "dark"
                ? theme.palette.error.main
                : theme.palette.primary.main
            }
            sx={sx.button}
            startIcon={<LiveTvIcon />}
          >
            <Typography sx={sx.text}>Sign in with TMDB</Typography>
          </Button>

          <Typography>Or</Typography>

          {/* Recomovie login */}
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="outlined"
            sx={sx.button}
            color={
              theme.palette.mode === "dark"
                ? theme.palette.error.main
                : theme.palette.primary.main
            }
            onClick={handleRecomovieLogin}
            startIcon={<LocalMoviesIcon />}
          >
            <Typography sx={sx.text}>Sign in Recomovie</Typography>
          </Button>

          <Typography>
            You don't have an account yet?
            <Typography
              component={RouterLink}
              to="/register"
              sx={{ ...sx.text, zIndex: 10, position: 'relative' }}
            >
              &nbsp; Sign up
            </Typography>
          </Typography>

          <Typography
            component={RouterLink}
            to="/reset-password"
            sx={{ ...sx.text, zIndex: 10, position: "relative" }}
          >
            &nbsp; Forgot password?
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
