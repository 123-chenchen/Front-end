import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import background from "../../assets/background/background.png";
import blueLogo from "../../assets/logo/bluelogo.png";
import redLogo from "../../assets/logo/redlogo.png";
import api from "../../utils/api";
import styles from "./styles";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

export default function Register() {
  const theme = useTheme();
  const sx = styles(theme);
  const navigate = useNavigate();

  const logo = theme.palette.mode === "dark" ? redLogo : blueLogo;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [alert, setAlert] = useState(null);
  const showAlert = (severity, text) => setAlert({ severity, text });

  const canSubmit = useMemo(() => {
    return (
      fullName.trim() &&
      email.trim() &&
      username.trim() &&
      password &&
      confirmPassword &&
      !loading
    );
  }, [fullName, email, username, password, confirmPassword, loading]);

  const onSubmit = async () => {
    setAlert(null);

    // quick frontend checks
    if (
      !fullName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password ||
      !confirmPassword
    ) {
      showAlert("warning", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("warning", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        username: username.trim(),
        password,
        confirmPassword,
      };

      const res = await api.post("/Account/Register", payload);

      // BE returns 201 with { message, userId }
      showAlert(
        "success",
        res?.data?.message || "Registered! Check your email to verify.",
      );

      // optional UX: send to login after a short moment
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Register failed.";
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setAlert(null);

    const e = email.trim();
    if (!e) {
      showAlert("warning", "Enter your email above first.");
      return;
    }

    try {
      setResendLoading(true);
      const res = await api.post("/Account/ResendVerificationEmail", {
        email: e,
      });
      showAlert(
        "info",
        res?.data?.message ||
          "If the email exists, we sent a new verification link.",
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Resend failed.";
      showAlert("error", msg);
    } finally {
      setResendLoading(false);
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
      {/* Content */}

      <Box sx={sx.content}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Register
          </Typography>

          {alert && <Alert severity={alert.severity}>{alert.text}</Alert>}

          {/* Recomovie register */}
          <TextField
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            disabled={!canSubmit}
            onClick={onSubmit}
            variant="outlined"
            sx={sx.button}
            color={
              theme.palette.mode === "dark"
                ? theme.palette.error.main
                : theme.palette.primary.main
            }
            startIcon={<DoneIcon />}
          >
            <Typography sx={sx.text}>Submit</Typography>
          </Button>

          <Button
            disabled={resendLoading}
            onClick={resendVerification}
            variant="outlined"
            sx={sx.button}
            color={
              theme.palette.mode === "dark"
                ? theme.palette.error.main
                : theme.palette.primary.main
            }
            startIcon={<LocalMoviesIcon />}
          >
            <Typography sx={sx.text}>Resend verification email</Typography>
          </Button>

          <Typography>
            Already have an account?
            <Typography
              component={RouterLink}
              to="/login"
              sx={{ ...sx.text, zIndex: 10, position: "relative" }}
            >
              &nbsp; Sign in
            </Typography>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
