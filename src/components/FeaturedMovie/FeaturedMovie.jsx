import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import styles from './styles';

function FeaturedMovie({ movie }) {
  const theme = useTheme();
  const sx = styles(theme);

  if (!movie) return null;

  return (
    <Box component={Link} to={`/movie/${movie.id}`} sx={sx.featuredCardContainer}>
      <Card sx={{ ...sx.cardRoot, ...sx.card }}>
        <CardMedia
          media="picture"
          alt={movie.title}
          image={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
          title={movie.title}
          sx={sx.cardMedia}
        />
        <Box padding="20px">
          <CardContent sx={{ ...sx.cardContentRoot, ...sx.cardContent }}>
            <Typography variant="h5" gutterBottom>{movie.title}</Typography>
            <Typography variant="body2">{movie.overview}</Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default FeaturedMovie;
