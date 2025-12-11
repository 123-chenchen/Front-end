// src/components/MovieList/MovieList.jsx
import React from 'react';
import { Grid } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import Movie from '../Movie/Movie';
import styles from './styles';

function MovieList({ movies, excludeFirst }) {
  const theme = useTheme();
  const sx = styles(theme);

  const startIndex = excludeFirst ? 1 : 0;

  return (
    <Grid container sx={sx.moviesContainer} spacing={2}>
      {movies.results.slice(startIndex).map((movie, i) => (
        <Movie key={movie.id} movie={movie} i={i} />
      ))}
    </Grid>
  );
}

export default MovieList;
