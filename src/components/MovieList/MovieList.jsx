// import { Grid, Fade, Box } from '@mui/material';
import { Grid, Box } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';
import { Movie } from '../index';
import styles from './styles';
import { useTheme } from '@mui/material/styles';

function MovieList({ movies, excludeFirst }) {
  const theme = useTheme();
  const sx = styles(theme);

  // const [mounted, setMounted] = useState(false);
  const startIndex = excludeFirst ? 1 : 0;

  /* useEffect(() => {
    setMounted(true);
  }, []);*/

  // ✅ normalize input: accept both array and { results: array }
  const list = useMemo(() => {
    if (!movies) return [];
    if (Array.isArray(movies)) return movies;
    if (Array.isArray(movies.results)) return movies.results;
    return [];
  }, [movies]);

  if (!list.length) return null;

  /* return (
    <Grid container sx={sx.grid}>
      {list.slice(startIndex).map((movie, i) => (
        <Fade
          key={movie?.id ?? `${i}`}
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
  ); */

  return (
    <Grid container sx={sx.grid}>
      {list.slice(startIndex).map((movie, i) => (
        <Box key={movie?.id ?? `${i}`} sx={sx.box}>
          <Movie movie={movie} i={i} />
        </Box>
      ))}
    </Grid>
  );
}

export default MovieList;