import { Grid, Fade, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { Movie } from '../index';
import styles from './styles';


function List({ movies, excludeFirst }) {
  const theme = useTheme();
  const sx = styles(theme);

  const [mounted, setMounted] = useState(false); // ✅ hook lên trên
  const startIndex = excludeFirst ? 1 : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!movies?.results?.length) return null; // ✅ return sau hook

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

export default List;
