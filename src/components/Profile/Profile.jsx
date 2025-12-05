import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import { useGetListQuery } from '../../services/TMDB';
import RatedCards from '../RatedCards/RatedCards';

function Profile() {
  const { user } = useSelector((state) => state.user);
  const sessionId = localStorage.getItem('session_id');

  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery(
    { listName: 'favorite/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery(
    { listName: 'watchlist/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h5">Profile: {id}</Typography>
    </Box>
  );
}

export default Profile;
