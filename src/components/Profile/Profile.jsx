import { Box, Button, Typography, Avatar } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import List from './List';
import { useGetListQuery } from '../../services/TMDB';

function Profile() {
  // ===== TMDB STATE =====
  const { user: tmdbUser } = useSelector((state) => state.user);
  const sessionId = localStorage.getItem('session_id');

  // ===== RECOMOVIE STATE =====
  const recomovieUser = JSON.parse(localStorage.getItem('recomovie_user'));

  const isTMDB = Boolean(tmdbUser?.id && sessionId);
  const isRecomovie = Boolean(recomovieUser);

  // ===== TMDB QUERIES =====
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery(
    {
      listName: 'favorite/movies',
      accountId: tmdbUser?.id,
      sessionId,
      page: 1,
    },
    { skip: !isTMDB }
  );

  const { data: watchlistMovies, refetch: refetchWatchlist } = useGetListQuery(
    {
      listName: 'watchlist/movies',
      accountId: tmdbUser?.id,
      sessionId,
      page: 1,
    },
    { skip: !isTMDB }
  );

  useEffect(() => {
    if (isTMDB) {
      refetchFavorites();
      refetchWatchlist();
    }
  }, [isTMDB, refetchFavorites, refetchWatchlist]);

  // ===== LOGOUT (CHUNG) =====
  /*const logout = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('request_token');
    localStorage.removeItem('recomovie_token');
    localStorage.removeItem('recomovie_user');
    window.location.href = '/';
  };*/
  // ===== LOGOUT TMDB =====
  const logoutTMDB = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('request_token');
    window.location.href = '/';
  };

  // ===== LOGOUT RECOMOVIE =====
  const logoutRecomovie = () => {
    localStorage.removeItem('recomovie_token');
    localStorage.removeItem('recomovie_user');
    window.location.href = '/';
  };

  // ===== CHƯA LOGIN =====
  if (!isTMDB && !isRecomovie) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Not logged in</Typography>
      </Box>
    );
  }

  // ===== USER INFO (CHUNG UI) =====
  const displayName = isTMDB ? tmdbUser.username : recomovieUser.username;

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {isTMDB && (
          <Button
            color="inherit"
            onClick={() => {
              logoutTMDB();
              logoutRecomovie();
            }}
          >
            Logout &nbsp; <ExitToApp />
          </Button>
        )}
      </Box>

      {/* ===== TMDB CONTENT ===== */}
      {isTMDB && (
        <>
          {favoriteMovies?.results?.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom>
                Favorite Movies
              </Typography>
              <List movies={favoriteMovies} />
            </>
          )}

          {watchlistMovies?.results?.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Watchlist
              </Typography>
              <List movies={watchlistMovies} />
            </>
          )}
        </>
      )}

      {/* ===== RECOMOVIE CONTENT ===== */}
      {isRecomovie && (
        <>
          <Typography variant="h5" gutterBottom>
            Favorite Movies
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7, mb: 4 }}>
            (Feature coming soon — Database is in progress…)
          </Typography>

          <Typography variant="h5" gutterBottom>
            Watchlist
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            (Feature coming soon — Database is in progress…)
          </Typography>
        </>
      )}
    </Box>
  );
}

export default Profile;
