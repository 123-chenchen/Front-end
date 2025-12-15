import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchToken } from '../utils';
import { setRecomovieUser } from '../features/auth';

export default function LoginPage({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingTMDB, setLoadingTMDB] = useState(false);
  const [loadingRecomovie, setLoadingRecomovie] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ===== TMDB LOGIN =====
  const handleTMDbLogin = async () => {
    setLoadingTMDB(true);
    try {
      await fetchToken(); // redirect TMDB
      onClose?.();        // 👈 đóng popup nếu redirect
    } catch (err) {
      console.error(err);
      alert('TMDB login failed');
    } finally {
      setLoadingTMDB(false);
    }
  };

  // ===== RECOMOVIE LOGIN =====
  const handleRecomovieLogin = async () => {
    if (!username || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoadingRecomovie(true);

    try {
      const response = await fetch(
        'http://45.77.248.87:8081/api/Account/Login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok && response.status !== 204) {
        alert('Invalid email or password');
        return;
      }

      let data = {};
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data.accessToken) {
        localStorage.setItem('recomovie_token', data.accessToken);
      }

      localStorage.setItem(
        'recomovie_user',
        JSON.stringify({
          id: data.id ?? null,
          username: data.username ?? username,
        })
      );

      window.dispatchEvent(new Event('storage-update'));

      dispatch(
        setRecomovieUser({
          user: {
            id: data.id ?? null,
            username: data.username ?? username,
          },
          token: data.accessToken ?? null,
        })
      );

      onClose?.();   // 👈 đóng popup
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed. Backend error.');
    } finally {
      setLoadingRecomovie(false);
    }
  };

  return (
    <Paper
      elevation={12}
      sx={{
        width: 420,
        p: 4,
        borderRadius: 3,
        background:
          'linear-gradient(180deg, rgba(11,15,20,0.95), rgba(2,6,23,0.95))',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Sign in
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Welcome user, please sign in to continue
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={handleTMDbLogin}
          disabled={loadingTMDB}
        >
          {loadingTMDB ? <CircularProgress size={22} /> : 'Sign In With TMDb'}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          disabled
        >
          Sign In With Google
        </Button>

        <Divider>Or</Divider>

        <TextField
          label="Email"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleRecomovieLogin}
          disabled={loadingRecomovie}
        >
          {loadingRecomovie ? (
            <CircularProgress size={22} />
          ) : (
            'Sign In With Email And Password'
          )}
        </Button>
      </Stack>
    </Paper>
  );
}
