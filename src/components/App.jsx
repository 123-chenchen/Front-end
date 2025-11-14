import React, { useRef } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import styles from './styles';
import useAlan from './Alan';

import { Movies, Actors, MovieInfo, Navbar, Profile } from './index';

function App() {
  const theme = useTheme();
  const sx = styles(theme);
  const alanBtnContainer = useRef();

  useAlan();

  return (
    <Box sx={sx.root}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={sx.content}>
        <Box sx={sx.toolbar} />
        <Routes>
          <Route exact path="/" element={<Movies />} />
          <Route exact path="/approved" element={<Movies />} />
          <Route exact path="/movie/:id" element={<MovieInfo />} />
          <Route exact path="/actors/:id" element={<Actors />} />
          <Route exact path="/profile/:id" element={<Profile />} />
        </Routes>
      </Box>
      <div ref={alanBtnContainer} />
    </Box>
  );
}

export default App;
