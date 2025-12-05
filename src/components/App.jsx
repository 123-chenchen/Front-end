import React, { useRef } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import styles from './styles';
import useAlan from './Alan';

import { Movies, Actors, MovieInfo, Navbar, Profile } from './index';

import RecomovieLogin from "../pages/RecomovieLogin";
import RecomovieProfile from "../components/RecomovieProfile/RecomovieProfile";

function App() {
  const theme = useTheme();
  const sx = styles(theme);
  const alanBtnContainer = useRef();

  const location = useLocation();

  // Routes where Navbar and sidebar layout should be hidden
  const noLayoutRoutes = ["/recomovie-login"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  useAlan();

  return (
    <Box sx={sx.root}>
      <CssBaseline />

      {/* Hide Navbar on certain pages */}
      {!hideLayout && <Navbar />}

      <Box component="main" sx={sx.content}>
        {/* Only push content down when navbar is visible */}
        {!hideLayout && <Box sx={sx.toolbar} />}

        <Routes>
          <Route exact path="/" element={<Movies />} />
          <Route exact path="/approved" element={<Movies />} />
          <Route exact path="/movie/:id" element={<MovieInfo />} />
          <Route exact path="/actors/:id" element={<Actors />} />
          <Route exact path="/profile/:id" element={<Profile />} />

          {/* 2 new routes */}
          <Route path="/recomovie-login" element={<RecomovieLogin />} />
          <Route path="/recomovie-profile/:id" element={<RecomovieProfile />} />
        </Routes>
      </Box>

      {/* Hide Alan button too for clean login page */}
      {!hideLayout && <div ref={alanBtnContainer} />}
    </Box>
  );
}

export default App;
