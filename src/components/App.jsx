import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import styles from './styles';

import { Movies, Actors, MovieInfo, Navbar, Profile } from './index';

import RecomovieLogin from "../pages/RecomovieLogin";
import RecomovieProfile from "../components/RecomovieProfile/RecomovieProfile";

function App() {
  const theme = useTheme();
  const sx = styles(theme);

  const location = useLocation();

  // Routes where Navbar and sidebar layout should be hidden
  const noLayoutRoutes = ["/recomovie-login"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

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
          <Route exact path="/actors/:name" element={<Actors />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route exact path="/genres/:genre" element={<Movies />} />

          {/* Recomovie routes */}
          <Route path="/recomovie-login" element={<RecomovieLogin />} />
          <Route path="/recomovie-profile/:id" element={<RecomovieProfile />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
