import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import RatedCards from '../RatedCards/RatedCards';
import { useGetListQuery } from '../../services/TMDB';

// TMDb login profile
function Profile() {
  const { user } = useSelector((state) => state.user);
  const sessionId = localStorage.getItem('session_id');

  // Favorite Movies
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery(
    { listName: 'favorite/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  // Watchlist
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery(
    { listName: 'watchlist/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  // Check session id to fetch the remaing Favorites and Watchlist
  useEffect(() => {
    if (user?.id && sessionId) {
      refetchFavorites();
      refetchWatchlisted();
    }
  }, [user?.id, sessionId, refetchFavorites, refetchWatchlisted]);

  // Logout -> clear localStorage
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Logout + Empty status of Favorites and Watchlists
  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      
      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography variant="h5">Add favourite or watchlist same movies to see them here!</Typography>
        : (
          <Box>
            <RatedCards title="Favorite Movies" movies={favoriteMovies} />
            <RatedCards title="Watchlist" movies={watchlistMovies} />
          </Box>
        )}
    </Box>
  );
}

export default Profile;
