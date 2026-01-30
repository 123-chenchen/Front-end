import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import background from "../../assets/background/background.png";
import blueLogo from "../../assets/logo/bluelogo.png";
import redLogo from "../../assets/logo/redlogo.png";
import api from "../../utils/api";
import styles from "./style";

export default function ForgotPassword() {
  const theme = useTheme();
  const sx = styles(theme);
  const logo = theme.palette.mode === "dark" ? redLogo : blueLogo;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);
  const showAlert = (severity, text) => setAlert({ severity, text });

  const canSubmit = useMemo(() => {
    return email.trim() && !loading;
  }, [email, loading]);

  const onSubmit = async () => {
    setAlert(null);

    const e = email.trim();
    if (!e) {
      showAlert("warning", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      // Backend always returns OK to avoid enumeration
      const res = await api.post("/Account/ForgotPassword", { email: e });

      showAlert(
        "success",
        res?.data?.message ||
          "If the email exists, a reset link has been sent.",
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Request failed.";
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
     <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={sx.overlay} />
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>

       <Box sx={sx.content}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Reset Password
          </Typography>

          {alert && <Alert severity={alert.severity}>{alert.text}</Alert>}

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button disabled={!canSubmit} onClick={onSubmit}
           variant="outlined"
            color={
              theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main
            }
            sx={sx.button}
            startIcon={<EmailIcon />}
          >
            <Typography sx={sx.text}>Send reset link</Typography>
          </Button>


        <Typography>
          Remember your password?
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
