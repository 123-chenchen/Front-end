// src/components/Profile/Profile.jsx
import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import RatedCards from '../RatedCards/RatedCards';
import { useGetListQuery } from '../../services/moviesApi';

// TMDb login profile (lists now come from your DB)
function Profile() {
  // /profile/:id -> TMDbAccountId
  const { id } = useParams();
  const accountId = id;

  // sessionId is no longer required by the backend for lists,
  // but we still pass it through because the hook expects it.
  const sessionId = localStorage.getItem('session_id');

  // Only skip when there is no account id
  const shouldSkip = !accountId;

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

  // re-fetch once accountId is available
  useEffect(() => {
    if (!shouldSkip) {
      refetchFavorites();
      refetchWatchlisted();
    }
  }, [shouldSkip, refetchFavorites, refetchWatchlisted]);

  const logout = () => {
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
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
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
