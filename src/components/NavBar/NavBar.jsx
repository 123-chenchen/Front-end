import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Drawer, IconButton, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { setUser } from '../../features/auth';
import { createSessionId, moviesApi } from '../../utils';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import { Search, Sidebar } from '../index';
import styles from './styles';

function Navbar({ onLoginClick }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const sx = styles(theme);

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLocalStorage = localStorage.getItem('session_id');
  const recomovieUser = JSON.parse(localStorage.getItem('recomovie_user'));

  useEffect(() => {
    const logInUser = async () => {
      if (!token && !sessionIdFromLocalStorage) return;

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

  const handleLoginClick = () => {
    if (typeof onLoginClick === 'function') {
      onLoginClick();
      return;
    }

    const from = `${location.pathname}${location.search}${location.hash}`;
    sessionStorage.setItem('auth_from', from);
    navigate('/login', { state: { from } });
  };

  const renderAuthButton = () => {
    // Recomovie
    if (recomovieUser) {
      return (
        <Button
          startIcon={<Avatar>{recomovieUser.username[0].toUpperCase()}</Avatar>}
          color="inherit"
          component={Link}
          to={`/recomovie-profile/${recomovieUser.id}`}
        >
          My Movies
        </Button>
      );
    }

    // TMDb
    if (isAuthenticated && user) {
      return (
        <Button
          color="inherit"
          startIcon={
            <Avatar
              src={
                user?.avatar?.tmdb?.avatar_path
                  ? `https://www.themoviedb.org/t/p/w64_and_h64_face${user.avatar.tmdb.avatar_path}`
                  : undefined
              }
            />
          }
          component={Link}
          to={`/tmdb-profile/${user.id}`}
        >
          My Movies
        </Button>
      );
    }

    // Not login yet
    return (
      <Button color="inherit" startIcon={<AccountCircle />} onClick={handleLoginClick}>
        LOGIN
      </Button>
    );
  };

  return (
    <>
      <AppBar position="fixed" sx={sx.appBar}>
        <Toolbar sx={sx.toolbar}>
          {/* Toggle theme */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Search */}
          <Search />

          {/* LOGIN / PROFILE */}
          {renderAuthButton()}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={sx.drawer}>
        <Drawer variant="permanent" slotProps={{ paper: { sx: sx.drawerPaper } }}>
          <Sidebar />
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;