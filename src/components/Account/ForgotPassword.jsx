import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import background from '../../assets/background/background.png';
import blueLogo from '../../assets/logo/bluelogo.png';
import redLogo from '../../assets/logo/redlogo.png';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import api from '../../utils/api';
import styles from './style';

export default function ForgotPassword() {
  const theme = useTheme();
  const sx = styles(theme);
  const colorMode = useContext(ColorModeContext);

  const logo = theme.palette.mode === 'dark' ? redLogo : blueLogo;

  const [email, setEmail] = useState('');
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
      showAlert('warning', 'Please enter your email.');
      return;
    }

    try {
      setLoading(true);

      // Backend always returns OK to avoid enumeration
      const res = await api.post('/Account/ForgotPassword', { email: e });

      showAlert(
        'success',
        res?.data?.message || 'If the email exists, a reset link has been sent.',
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Request failed.';
      showAlert('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={{ ...sx.overlay, pointerEvents: 'none' }} />

      {/* Toggle theme */}
      <IconButton
        onClick={colorMode.toggleColorMode}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          color: 'white',
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>

      <Box sx={{ ...sx.content, position: 'relative', zIndex: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Forgot Password
          </Typography>

          {alert && <Alert severity={alert.severity}>{alert.text}</Alert>}

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="button" disabled={!canSubmit} onClick={onSubmit}>
            <Typography sx={sx.text}>{loading ? 'Sending…' : 'Send reset link'}</Typography>
          </Button>
        </Stack>

        <Typography variant="body2" mt={3}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
