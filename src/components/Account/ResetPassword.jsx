import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import background from '../../assets/background/background.png';
import blueLogo from '../../assets/logo/bluelogo.png';
import redLogo from '../../assets/logo/redlogo.png';
import api from '../../utils/api';
import styles from './styles';

export default function ResetPassword() {
  const theme = useTheme();
  const sx = styles(theme);
  const navigate = useNavigate();

  const logo = theme.palette.mode === 'dark' ? redLogo : blueLogo;

  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null); // { severity, text }
  const showAlert = (severity, text) => setAlert({ severity, text });

  const canSubmit = useMemo(() => {
    return token.trim() && newPassword && confirmPassword && !loading;
  }, [token, newPassword, confirmPassword, loading]);

  const onSubmit = async () => {
    setAlert(null);

    const t = token.trim();
    if (!t || !newPassword || !confirmPassword) {
      showAlert('warning', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('warning', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        token: t,
        newPassword,
        confirmPassword,
      };

      const res = await api.post('/Account/ResetPassword', payload);

      showAlert('success', res?.data?.message || 'Password reset successfully.');

      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Reset failed.';
      showAlert('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={{ ...sx.overlay, pointerEvents: 'none' }} />

    

      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>

      <Box sx={{ ...sx.content, position: 'relative', zIndex: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Reset Password
          </Typography>

          {alert && <Alert severity={alert.severity}>{alert.text}</Alert>}

          {/* allow paste token if user opens page manually */}
          <TextField
            label="Reset token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="button" disabled={!canSubmit} onClick={onSubmit}>
            <Typography sx={sx.text}>{loading ? 'Saving…' : 'Submit'}</Typography>
          </Button>
        </Stack>

        <Typography variant="body2" mt={3}>
          Back to{' '}
          <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </Typography>

        <Typography variant="body2" mt={1}>
          Need a reset email?{' '}
          <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'underline' }}>
            Request one
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
