import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { MovieList } from '../index';
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
      
    {favoriteMovies?.results?.length > 0 && (
  <>
    <Typography variant="h5" gutterBottom>
      Favorite Movies
    </Typography>
    <MovieList movies={favoriteMovies} />
  </>
)}
{watchlistMovies?.results?.length > 0 && (
  <>
    <Typography variant="h5" gutterBottom>
      Watchlist
    </Typography>
    <MovieList movies={watchlistMovies} />
  </>
)}

    </Box>
  );
}

export default Profile;