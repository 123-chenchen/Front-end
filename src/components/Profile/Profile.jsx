import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import RatedCards from '../RatedCards/RatedCards';
import { useGetListQuery } from '../../services/TMDB';

// TMDb login profile
function Profile() {
  // 1️⃣ Take TMDb account id from the URL: /profile/:id
  const { id } = useParams();               // e.g. "22403555"
  const accountId = id;                     // keep as string, backend will accept it

  // 2️⃣ You still have your local user info if you need it
  const { user } = useSelector((state) => state.user);

  // 3️⃣ Session id from localStorage (TMDb session)
  const sessionId = localStorage.getItem('session_id');

  const shouldSkip = !accountId || !sessionId;

  // 4️⃣ Favorite movies for this TMDb account
  const {
    data: favoriteMovies,
    refetch: refetchFavorites,
  } = useGetListQuery(
    { listName: 'favorite/movies', accountId, sessionId, page: 1 },
    { skip: shouldSkip },
  );

  // 5️⃣ Watchlist movies for this TMDb account
  const {
    data: watchlistMovies,
    refetch: refetchWatchlisted,
  } = useGetListQuery(
    { listName: 'watchlist/movies', accountId, sessionId, page: 1 },
    { skip: shouldSkip },
  );

  // 6️⃣ Refetch when account/session become available
  useEffect(() => {
    if (!shouldSkip) {
      refetchFavorites();
      refetchWatchlisted();
    }
<<<<<<< HEAD
  }, [shouldSkip, refetchFavorites, refetchWatchlisted]);
=======
  }, [user?.id, sessionId, refetchFavorites, refetchWatchlisted]);
>>>>>>> origin/dev

  // Logout -> clear localStorage
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Logout + Empty status of Favorites and Watchlists
  return (
<<<<<<< HEAD
    <Box sx={{ p: 3, mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">
          TMDb Profile ID: {accountId}
        </Typography>
        {user && (
          <Typography variant="subtitle1">
            Logged in as: {user.userName || user.fullName || user.email}
          </Typography>
        )}
        <Button
          variant="outlined"
          color="error"
          startIcon={<ExitToApp />}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>

      {/* Example of showing favorites & watchlist if you want */}
      {/* You can adjust based on how RatedCards expects props */}
      {favoriteMovies?.results?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Favorite Movies
          </Typography>
          <RatedCards movies={favoriteMovies.results} title="Favorites" />
        </Box>
      )}

      {watchlistMovies?.results?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Watchlist
          </Typography>
          <RatedCards movies={watchlistMovies.results} title="Watchlist" />
        </Box>
      )}
=======
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
>>>>>>> origin/dev
    </Box>
  );
}

export default Profile;
