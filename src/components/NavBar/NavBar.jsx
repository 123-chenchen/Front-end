import { AppBar, IconButton, Toolbar, Drawer, Button, Avatar, useMediaQuery, Box } from '@mui/material';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import styles from './styles';
import Search from '../Search/Search';
import Sidebar from '../Sidebar/Sidebar';
import { setUser } from '../../features/auth';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import { fetchToken, createSessionId, moviesApi } from '../../utils/index';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const sx = styles(theme);

  // Constant block for Authentication
  const dispatch = useDispatch();
  const token = localStorage.getItem('request_token');
  const sessionIdFromLocalStorage = localStorage.getItem('session_id');
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Login + Dropdown
  const [openLoginMenu, setOpenLoginMenu] = useState(false);
  const loginRef = useRef(null);

  // Close dropdown by clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setOpenLoginMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Add listener for recomovie login
  useEffect(() => {
  const handleStorageUpdate = () => {
    // Component will naturally re-render when localStorage/auth state changes
  };

  window.addEventListener("storage-update", handleStorageUpdate);
  return () => window.removeEventListener("storage-update", handleStorageUpdate);
  }, []);

  // TMDb Auth Logic
  useEffect(() => {
    const logInUser = async () => {
      if (!token) return;

      try {
        let sessionId = sessionIdFromLocalStorage;

        if (!sessionId) {
          sessionId = await createSessionId();
        }

        if (!sessionId) {
          console.warn('No valid session_id available.');
          return;
        }

        const { data: userData } = await moviesApi.get(`/account?session_id=${sessionId}`);
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Failed fetching account info:', error);
      }
    };

    logInUser();
  }, [token, sessionIdFromLocalStorage, dispatch]);

  return (
    <>
      <AppBar position="fixed" sx={sx.appBar}>
        <Toolbar sx={sx.toolbar}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={sx.menuButton}
            >
              <Menu />
            </IconButton>
          )}

          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {!isMobile && <Search />}

          {/* Login button + Dropdown */}
          <div ref={loginRef} style={{ position: "relative", marginLeft: "20px" }}>
            {(() => {

              // Detect Recomovie user from localStorage (localStotage store accessToken fetch from POST Account/Login)
              const recomovieUser = JSON.parse(localStorage.getItem("recomovie_user"));

              // Recomovie authentication
              if (recomovieUser) {
                return (
                  <Button
                    color="inherit"
                    component={Link}
                    to={`/recomovie-profile/${recomovieUser.id}`}
                    sx={sx.linkButton}
                  >
                    {!isMobile && <>My Profile &nbsp;</>}
                    <Avatar
                      style={{
                        width: 30,
                        height: 30,
                        background: "#555",
                        fontSize: "1rem",
                      }}
                    >
                      {recomovieUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Button>
                );
              }

              // TMDb authentication
              if (isAuthenticated) {
                return (
                  <Button
                    color="inherit"
                    component={Link}
                    to={`/profile/${user.id}`}
                    sx={sx.linkButton}
                  >
                    {!isMobile && <>My Movies &nbsp;</>}
                    <Avatar
                      style={{ width: 30, height: 30 }}
                      alt="Profile"
                      src={`https://www.themoviedb.org/t/p/w64_and_h64_face${user?.avatar?.tmdb?.avatar?.avatar_path}`}
                    />
                  </Button>
                );
              }

              // No user -> show only LOGIN button
              return (
                <>
                  <Button
                    color="inherit"
                    onClick={() => setOpenLoginMenu((prev) => !prev)}
                    endIcon={<AccountCircle />}
                  >
                    LOGIN
                  </Button>

                  {openLoginMenu && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "40px",
                        right: 0,
                        background: theme.palette.background.paper,
                        borderRadius: "6px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                        width: "180px",
                        overflow: "hidden",
                        zIndex: 20,
                        animation: "fadeIn 0.15s ease-out",
                      }}
                    >
                      <Button
                        fullWidth
                        sx={{ justifyContent: "flex-start", textTransform: "none" }}
                        onClick={() => {
                          setOpenLoginMenu(false);
                          fetchToken(); // TMDb login
                        }}
                      >
                        Login with TMDb
                      </Button>

                      <Button
                        fullWidth
                        sx={{
                          justifyContent: "flex-start",
                          textTransform: "none",
                          borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        component={Link}
                        to="/recomovie-login" // Recomovie login page
                        onClick={() => setOpenLoginMenu(false)}
                      >
                        Login with Recomovie
                      </Button>
                    </Box>
                  )}
                </>
              );
            })()}
          </div>
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={sx.drawer}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen((prev) => !prev)}
            slotProps={{ paper: { sx: sx.drawerPaper } }}
            ModalProps={{ keepMounted: true }}
          >
            <Sidebar setMobileOpen={setMobileOpen} />
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            slotProps={{ paper: { sx: sx.drawerPaper } }}
          >
            <Sidebar setMobileOpen={setMobileOpen} />
          </Drawer>
        )}
      </Box>
    </>
  );
}

export default Navbar;
