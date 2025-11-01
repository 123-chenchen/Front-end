import React from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route } from 'react-router-dom';

import useStyles from './styles';

import { Actors, MovieInformation, Movies, Profile, NavBar } from "./";

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />  
        <Routes>
          <Route path="/actors/:id" element={<h1>Actors</h1>} />
          <Route path="/profile/:id" element={<h1>Profiles</h1>} />
          <Route path="/" element={<h1>Movies</h1>} />
          <Route path="/movie/:id" element={<h1>MovieInformation</h1>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;