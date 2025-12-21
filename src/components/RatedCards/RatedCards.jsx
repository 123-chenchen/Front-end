import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './styles';
import Movie from '../Movie/Movie';

function RatedCards({ title, movies }) {
  const theme = useTheme();
  const sx = styles(theme);

  // Make sure each movie has poster_path, whether it came from TMDb (poster_path) or from backend (posterPath)
  const normalizedResults = (movies?.results || []).map((movie) => ({
    ...movie,
    poster_path: movie.poster_path ?? movie.posterPath ?? '',
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Box display="flex" flexWrap="wrap" sx={sx.container}>
        {movies?.results.map((movie, i) => (
          <Movie key={movie.id} movie={movie} i={i} />
        ))}
      </Box>
    </Box>
  );
}

export default RatedCards;