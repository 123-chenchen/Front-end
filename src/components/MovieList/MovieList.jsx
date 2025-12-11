import { Grid, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Movie } from '../index';

function MovieList({ movies, excludeFirst }) {
  const theme = useTheme();
  const startIndex = excludeFirst ? 1 : 0;
  
  return (
    <Grid container 
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 1
      }}
    >
      {movies.results.slice(startIndex).map((movie, i) => (
        <Movie key={movie.id} movie={movie} i={i} />
      ))}
    </Grid>
  );
}

export default MovieList;
