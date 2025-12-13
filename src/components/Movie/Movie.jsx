import { Typography, Grid, Tooltip, Rating, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import styles from './styles';

function Movie({ movie, i }) {
  const theme = useTheme();
  const sx = styles(theme);

  return (
  <Grid>
    <Tooltip  title={`${movie.title} ${movie.vote_average.toFixed(1)} / 10`} arrow placement="top">
    <MuiLink component={RouterLink} sx={sx.movie} to={`/movie/${movie.id}`}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
            : 'https://www.fillmurray.com/200/300'
        }
        alt={movie.title}
        style={sx.image}
      />

    <Typography sx={sx.title} variant="h5">{movie.title}</Typography>
    <Rating readOnly value={movie.vote_average / 2} precision={0.1} />
             

          </MuiLink>
          </Tooltip>
        </Grid>
   
  );
}

export default Movie;
