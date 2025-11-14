import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import styles from './styles';
import Movie from '../Movie/Movie';

function MovieList({ movies, numberOfMovies, excludeFirst }) {
  const theme = useTheme();
  const sx = styles(theme);
  const startFrom = excludeFirst ? 1 : 0;

  return (
    <Grid container sx={sx.moviesContainer}>
      {movies.results.slice(startFrom, numberOfMovies).map((movie, i) => (
        <Movie key={i} movie={movie} i={i} />
      ))}
    </Grid>
  );
}

export default MovieList;
