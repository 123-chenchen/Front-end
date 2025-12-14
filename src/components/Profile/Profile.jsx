// src/components/Profile/Profile.jsx
import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import RatedCards from '../RatedCards/RatedCards';
import { useGetListQuery } from '../../services/moviesApi';

// TMDb login profile (data served by your backend)
function Profile() {
  // /profile/:id -> TMDb account id
  const { id } = useParams();
  const accountId = id;

  const { user } = useSelector((state) => state.user);

  // TMDb session id (still stored so backend can use it if needed)
  const sessionId = localStorage.getItem('session_id');

  const shouldSkip = !accountId || !sessionId;

  // Favorites
  const {
    data: favoriteMovies,
    refetch: refetchFavorites,
  } = useGetListQuery(
    { listName: 'favorite/movies', accountId, sessionId, page: 1 },
    { skip: shouldSkip },
  );

  // Watchlist
  const {
    data: watchlistMovies,
    refetch: refetchWatchlisted,
  } = useGetListQuery(
    { listName: 'watchlist/movies', accountId, sessionId, page: 1 },
    { skip: shouldSkip },
  );

  // re-fetch if account/session become available
  useEffect(() => {
    if (!shouldSkip) {
      refetchFavorites();
      refetchWatchlisted();
    }
  }, [shouldSkip, refetchFavorites, refetchWatchlisted]);

  const logout = () => {
    // You can be more surgical later, but for pure TMDb logout this is OK
    localStorage.removeItem('request_token');
    localStorage.removeItem('session_id');
    localStorage.removeItem('tmdb_account_id');
    window.location.href = '/';
  };

  const hasNoLists =
    !favoriteMovies?.results?.length && !watchlistMovies?.results?.length;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>

      {hasNoLists ? (
        <Typography variant="h5">
          Add favourite or watchlist movies to see them here!
        </Typography>
      ) : (
        <Box>
          {favoriteMovies?.results?.length > 0 && (
            <RatedCards title="Favorite Movies" movies={favoriteMovies} />
          )}

          {watchlistMovies?.results?.length > 0 && (
            <RatedCards title="Watchlist" movies={watchlistMovies} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default Profile;
