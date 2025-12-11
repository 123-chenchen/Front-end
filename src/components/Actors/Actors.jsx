import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';


import { useTheme } from '@mui/material/styles';
import styles from './styles';
import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import MovieList from '../MovieList/MovieList';

function Actors() {
  const theme = useTheme();
  const sx = styles(theme);
  const { id } = useParams();
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page: 1 });

  if (isFetching) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
      </Box>
    );
  }

  return (
    <>
      {/* Actor Info: 2-column layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 8,
          mt: 2,
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Actor Image - fixed width */}
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 250px' },
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <img
            style={sx.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data.name}
          />
        </Box>

        {/* Right: Actor Info - full width */}
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '1 1 auto' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            width: '100%',
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
            <Typography variant="h3" sx={{ fontSize: "2.2rem", fontWeight: "bold" }} gutterBottom>{data?.name}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 100, color: "#9bb0c1", mb: 1 }} gutterBottom>Born: {new Date(data?.birthday).toDateString()} ({new Date().getFullYear() - new Date(data?.birthday).getFullYear()} years old)</Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.2, fontSize: '0.7rem', mb: 2 }}>{data?.biography || 'Sorry, no biography yet...'}</Typography>
            <Box sx={sx.btns}>
              <Button variant="contained" color="primary" target="_blank" href={`https://www.imdb.com/name/${data?.imdb_id}`}>IMDB</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h2" gutterBottom align="left">Movies</Typography>
        {movies && <MovieList movies={movies} />}
      </Box>
    </>
  );
}

export default Actors;
