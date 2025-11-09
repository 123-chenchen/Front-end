import React from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route } from 'react-router-dom';

const App = () => (
  <div>
    <CssBaseline />
    <main>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route exact path="/movies" element={<h1>Movies</h1>} />
      </Routes>
    </main>
  </div>
);

export default App;