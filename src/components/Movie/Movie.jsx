import React from 'react';
import { Typography, Grid, Grow, Tooltip, Rating, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import styles from './styles';

function Movie({ movie, i }) {
  const theme = useTheme();
  const sx = styles(theme);

  return (
    <Grid
      item
      sx={sx.movie}
    >
      <Grow in key={i} timeout={(i + 1) * 250}>
        <MuiLink component={RouterLink} sx={sx.links} to={`/movie/${movie.id}`}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
                : 'https://www.fillmurray.com/200/300'
            }
            loading="lazy"
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
      </Grow>
    </Grid>
  );
}

export default Movie;
