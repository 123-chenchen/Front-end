import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing token.');
        return;
      }

      try {
        const res = await api.get(`/Account/VerifyEmail?token=${encodeURIComponent(token)}`);
        if (!mounted) return;

        setStatus('success');
        setMessage(res?.data?.message || 'Email verified successfully.');
      } catch (err) {
        if (!mounted) return;

        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed (token invalid/expired).');
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Verify Email
        </Typography>

        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContenr: 'center'}}>
            <CircularProgress />
          </Box>
        )}

        {status !== 'loading' && (
          <Typography sx={{ mt: 2 }} variant="body1">
            {message}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button component={Link} to="/login" variant="contained">
            Go to Login
          </Button>
          <Button component={Link} to="/" variant="outlined">
            Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}