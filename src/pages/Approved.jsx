import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import { createSessionId, moviesApi } from '../utils';
import { setUser } from '../features/auth';

export default function Approved() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeTmdbSession = async () => {
      try {
        // Create or reuse session id, then fetch account and store user
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = await createSessionId();
        }

        if (sessionId) {
          const { data } = await moviesApi.get(`/account?session_id=${sessionId}`);
          dispatch(setUser(data));
        }

        // Go to main layout
        navigate('/', { replace: true });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('TMDb approval handling failed:', err);
        navigate('/login', { replace: true });
      }
    };

    finalizeTmdbSession();
  }, [dispatch, navigate]);

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
          Finalizing sign-in...
        </Typography>
      </Box>
    </Box>
  );
}
