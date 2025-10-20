import React from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route } from 'react-router-dom';

import { Actors, MovieInformation, Movies, Profile, NavBar } from "./";

const App = () => (
  <div>
    <CssBaseline />
    <NavBar />
    <main>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route exact path="/actors/:id" element={<h1>Actors</h1>} />
        <Route exact path="/profile/:id" element={<h1>Profiles</h1>} />
        <Route exact path="/" element={<h1>Movies</h1>} />
        <Route exact path="/movie/:id" element={<h1>MovieInformation</h1>} />
      </Routes>
    </main>
  </div>
);

export default App;