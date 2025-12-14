// src/components/Profile/LoginMenu.jsx
import { Button, Avatar, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import { setUser } from '../../features/auth';
import { fetchToken, createSessionId, moviesApi } from '../../utils';

function LoginMenu({ isMobile }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLocalStorage = localStorage.getItem('session_id');

  const [openLoginMenu, setOpenLoginMenu] = useState(false);
  const loginRef = useRef(null);

  // Click outside
  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setOpenLoginMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // TMDb auth
  useEffect(() => {
    const logInUser = async () => {
      if (!token) return;

      try {
        let sessionId = sessionIdFromLocalStorage;
        if (!sessionId) sessionId = await createSessionId();

        const { data } = await moviesApi.get(`/account?session_id=${sessionId}`);
        dispatch(setUser(data));
      } catch (err) {
        console.error(err);
      }
    };

    logInUser();
  }, [token, sessionIdFromLocalStorage, dispatch]);

  // Recomovie user
  const recomovieUser = JSON.parse(localStorage.getItem('recomovie_user'));

  return (
    <div ref={loginRef} style={{ position: 'relative', marginLeft: 20 }}>
      {/* Recomovie */}
      {recomovieUser && (
        <Button
          color="inherit"
          component={Link}
          to={`/recomovie-profile/${recomovieUser.id}`}
        >
          {!isMobile && 'My Profile '}
          <Avatar sx={{ width: 30, height: 30 }}>
            {recomovieUser.username[0].toUpperCase()}
          </Avatar>
        </Button>
      )}

      {/* TMDb */}
      {!recomovieUser && isAuthenticated && (
        <Button
          color="inherit"
          component={Link}
          to={`/profile/${user.id}`}
        >
          {!isMobile && 'My Movies '}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={`https://www.themoviedb.org/t/p/w64_and_h64_face${user?.avatar?.tmdb?.avatar?.avatar_path}`}
          />
        </Button>
      )}

      {/* No user */}
      {!recomovieUser && !isAuthenticated && (
        <>
          <Button
            color="inherit"
            endIcon={<AccountCircle />}
            onClick={() => setOpenLoginMenu((p) => !p)}
          >
            LOGIN
          </Button>

          {openLoginMenu && (
            <Box
              sx={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 180,
                bgcolor: theme.palette.background.paper,
                boxShadow: 4,
                borderRadius: 1,
                overflow: 'hidden',
                zIndex: 20,
              }}
            >
              <Button
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  setOpenLoginMenu(false);
                  fetchToken();
                }}
              >
                Login with TMDb
              </Button>

              <Button
                fullWidth
                component={Link}
                to="/recomovie-login"
                sx={{
                  justifyContent: 'flex-start',
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
                onClick={() => setOpenLoginMenu(false)}
              >
                Login with Recomovie
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
}

export default LoginMenu;
