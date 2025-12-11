import { Typography, Grid, Grow, Tooltip, Rating, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import styles from './styles';

function Movie({ movie, i }) {
  const theme = useTheme();
  const sx = styles(theme);

  return (
    <Grow in key={i} mountOnEnter unmountOnExit timeout={300}       >
      <div style={{
          transform: 'scale(0.97)',
          animation: 'scaleUp 0.35s ease forwards',
        }}
      >
        <Grid>
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

            <Typography sx={sx.title} variant="h5">
              {movie.title}
            </Typography>

            <Tooltip disableTouchListener title={`${movie.vote_average} / 10`}>
              <div>
                <Rating readOnly value={movie.vote_average / 2} precision={0.1} />
              </div>
            </Tooltip>
          </MuiLink>
        </Grid>
      </div>
    </Grow>
  );
}

export default Movie;
