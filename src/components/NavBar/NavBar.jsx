import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Button,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { Menu, Brightness4, Brightness7, AccountCircle } from '@mui/icons-material';
import { useState, useContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { Search, Sidebar } from '../index';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import { setUser } from '../../features/auth';
import { createSessionId, moviesApi } from '../../utils';

function Navbar({ onLoginClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const sx = styles(theme);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLocalStorage = localStorage.getItem('session_id');
  const recomovieUser = JSON.parse(localStorage.getItem('recomovie_user'));

  useEffect(() => {
    const logInUser = async () => {
      // Proceed if we have either a request_token (fresh login) or a stored session_id (returning user)
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


  const renderAuthButton = () => {
    // Recomovie
    if (recomovieUser) {
      return (
        <Button color="inherit" component={Link} to={`/recomovie-profile/${recomovieUser.id}`}>
          {!isMobile && 'My Profile '}
          <Avatar sx={{ width: 30, height: 30 }}>{recomovieUser.username[0].toUpperCase()}</Avatar>
        </Button>
      );
    }

    // TMDb
    if (isAuthenticated && user) {
      return (
        <Button color="inherit" component={Link} to={`/profile/${user.id}`}>
          {!isMobile && 'My Movies '}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={
              user?.avatar?.tmdb?.avatar_path
                ? `https://www.themoviedb.org/t/p/w64_and_h64_face${user.avatar.tmdb.avatar_path}`
                : undefined
            }
          />
        </Button>
      );
    }

    // Chưa login
    return (
      <Button color="inherit" startIcon={<AccountCircle />} onClick={onLoginClick}>
        LOGIN
      </Button>
    );
  };

  return (
    <>
      <AppBar position="fixed" sx={sx.appBar}>
        <Toolbar sx={sx.toolbar}>
          {/* Mobile menu */}
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)}>
              <Menu />
            </IconButton>
          )}

          {/* Toggle theme */}
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Search desktop */}
          {!isMobile && <Search />}

          {/* LOGIN / PROFILE */}
          {renderAuthButton()}

          {/* Search mobile */}
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={sx.drawer}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          slotProps={{ paper: { sx: sx.drawerPaper } }}
        >
          <Sidebar setMobileOpen={setMobileOpen} />
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;
