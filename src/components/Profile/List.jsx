import React from 'react';
import { Typography, Box } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import styles from './styles';
import Movie from '../Movie/Movie';

function List({ title, movies }) {
  const theme = useTheme();
  const sx = styles(theme);


  return (
    <Box>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Box display="flex"  sx={{margin: '20px 0',}}>
        {movies?.results.map((movie, i) => (
          <Movie key={movie.id} movie={movie} i={i} />
        ))}
      </Box>
    </Box>
  );
}

export default List;