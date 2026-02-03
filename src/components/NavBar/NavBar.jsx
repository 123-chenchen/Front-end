import {
  AccountCircle,
  Brightness4,
  Brightness7,
  ExitToApp,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { setUser } from "../../features/auth";
import { moviesApi } from "../../utils";
import { ColorModeContext } from "../../utils/ToggleColorMode";
import { Search, Sidebar } from "../index";
import styles from "./styles";

function Navbar({ onLoginClick }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const sx = styles(theme);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  /* ================= MENU STATE ================= */
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("recomovie_user");
    localStorage.removeItem("recomovie_token");
    localStorage.removeItem("session_id");

    dispatch(setUser(null));

    handleMenuClose();
    navigate("/");
  };

  /* ================= USER SOURCE ================= */
  const recomovieUser = (() => {
    try {
      const raw = localStorage.getItem("recomovie_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const profileRoute = recomovieUser
    ? `/recomovie-profile/${recomovieUser.id}`
    : isAuthenticated && user
      ? `/tmdb-profile/${user.id}`
      : null;

  const isOnProfile = profileRoute
    ? location.pathname.startsWith(profileRoute)
    : false;

  /* ================= HANDLE MY MOVIES CLICK ================= */
  const handleMyMoviesClick = (event) => {
    if (!profileRoute) return;

    if (!isOnProfile) {
      navigate(profileRoute);
    } else {
      handleMenuOpen(event);
    }
  };

  /* ================= TMDB SESSION LOAD ================= */
  useEffect(() => {
    const logInUser = async () => {
      if (recomovieUser) return;

      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) return;

      try {
        const { data } = await moviesApi.get(
          `/account?session_id=${sessionId}`,
        );
        dispatch(setUser(data));
      } catch (err) {
        console.error(err);
      }
    };

    logInUser();
  }, [dispatch]);

  /* ================= LOGIN CLICK ================= */
  const handleLoginClick = () => {
    if (typeof onLoginClick === "function") {
      onLoginClick();
      return;
    }

    const from = `${location.pathname}${location.search}${location.hash}`;
    sessionStorage.setItem("auth_from", from);

    navigate("/login", { state: { from } });
  };

  /* ================= RENDER AUTH BUTTON ================= */
  const renderAuthButton = () => {
    if (recomovieUser) {
      return (
        <Button
          color="inherit"
          startIcon={<Avatar>{recomovieUser.username[0].toUpperCase()}</Avatar>}
          onClick={handleMyMoviesClick}
        >
          My Movies
        </Button>
      );
    }

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
          onClick={handleMyMoviesClick}
        >
          My Movies
        </Button>
      );
    }

    return (
      <Button
        color="inherit"
        startIcon={<AccountCircle />}
        onClick={handleLoginClick}
      >
        LOGIN
      </Button>
    );
  };

  /* ================= RENDER ================= */
  return (
    <>
      <AppBar position="fixed" sx={sx.appBar}>
        <Toolbar sx={sx.toolbar}>
          {/* Theme toggle */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Search */}
          <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
            <Search />
          </Box>

          {/* Auth button */}
          {renderAuthButton()}

          {/* Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>
              Logout &nbsp; <ExitToApp />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={sx.drawer}>
        <Drawer
          variant="permanent"
          slotProps={{ paper: { sx: sx.drawerPaper } }}
        >
          <Sidebar />
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;
