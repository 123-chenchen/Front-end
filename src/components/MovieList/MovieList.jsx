import { Grid, Fade, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Movie } from '../index';
import styles from './styles';
import { useTheme } from '@mui/material/styles';

function MovieList({ movies, excludeFirst }) {
  const theme = useTheme();
  const sx = styles(theme);

  const [mounted, setMounted] = useState(false); 
  const startIndex = excludeFirst ? 1 : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!movies?.results?.length) return null; 

  return (
    <Grid container sx={sx.grid}>
      {movies.results.slice(startIndex).map((movie, i) => (
        <Fade
          key={movie.id}
          in={mounted}
          appear
          mountOnEnter
          timeout={300 + i * 120}
        >
          <Box sx={sx.box}>
            <Movie movie={movie} i={i} />
          </Box>
        </Fade>
      ))}
    </Grid>
  );
}

export default MovieList;
