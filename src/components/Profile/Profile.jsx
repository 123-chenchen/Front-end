import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import RatedCards from "../RatedCards/RatedCards";
import { useGetListQuery } from "../../services/moviesApi";
import api from "../../utils/api";

function safeJsonParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function Profile() {
  const { id } = useParams();

  const recomovieUser = useMemo(
    () => safeJsonParse(localStorage.getItem("recomovie_user")),
    [],
  );

  const isRecomovie = !!recomovieUser;

  // For TMDb profile route, go to /tmdb-profile/:id
  const tmdbAccountId = !isRecomovie
    ? Number(id || localStorage.getItem("tmdb_account_id"))
    : null;

  // -----------------------------
  // TMDb lists (PUBLIC): GET /api/TMDbAccounts/{id}/list
  // -----------------------------
  const skipTmdb = isRecomovie || !tmdbAccountId;

  const {
    data: tmdbFavoriteMoviesData,
    isFetching: isFetchingTmdbFavorites,
    isError: isTmdbFavoritesError,
    refetch: refetchTmdbFavorites,
  } = useGetListQuery(
    { listName: "favorite/movies", accountId: tmdbAccountId, page: 1 },
    { skip: skipTmdb, refetchOnMountOrArgChange: true },
  );

  const {
    data: tmdbWatchlistMoviesData,
    isFetching: isFetchingTmdbWatchlist,
    isError: isTmdbWatchlistError,
    refetch: refetchTmdbWatchlist,
  } = useGetListQuery(
    { listName: "watchlist/movies", accountId: tmdbAccountId, page: 1 },
    { skip: skipTmdb, refetchOnMountOrArgChange: true },
  );

  // keep old variable names so UI doesn't break
  const isFetchingTmdbList = isFetchingTmdbFavorites || isFetchingTmdbWatchlist;
  const isTmdbListError = isTmdbFavoritesError || isTmdbWatchlistError;

  // old code used refetchTmdbList?.()
  const refetchTmdbList = () => {
    refetchTmdbFavorites?.();
    refetchTmdbWatchlist?.();
  };

  // shape UI expects: { results: [...] }
  const tmdbFavoriteMovies = tmdbFavoriteMoviesData ?? { results: [] };
  const tmdbWatchlistMovies = tmdbWatchlistMoviesData ?? { results: [] };

  // If tmdbAccountId changes, force refresh (same behavior as old code)
  useEffect(() => {
    if (skipTmdb) return;
    refetchTmdbList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipTmdb, tmdbAccountId]);

  // -----------------------------
  // Recomovie lists: /me/movies/...
  // -----------------------------
  const [recomovieFavoriteMovies, setRecomovieFavoriteMovies] = useState({
    results: [],
  });
  const [recomovieWatchlistMovies, setRecomovieWatchlistMovies] = useState({
    results: [],
  });
  const [isFetchingRecomovie, setIsFetchingRecomovie] = useState(false);

  useEffect(() => {
    if (!isRecomovie) return;

    const loadLists = async () => {
      try {
        setIsFetchingRecomovie(true);
        const [favRes, watchRes] = await Promise.all([
          api.get("/me/movies/favorites"),
          api.get("/me/movies/watchlist"),
        ]);

        setRecomovieFavoriteMovies({ results: favRes.data || [] });
        setRecomovieWatchlistMovies({ results: watchRes.data || [] });
      } catch (err) {
        console.error(
          "Failed to load personal lists:",
          err.response?.data ?? err.message,
        );
        setRecomovieFavoriteMovies({ results: [] });
        setRecomovieWatchlistMovies({ results: [] });
      } finally {
        setIsFetchingRecomovie(false);
      }
    };

    loadLists();
  }, [isRecomovie]);

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = () => {
    if (isRecomovie) {
      localStorage.removeItem("recomovie_token");
      localStorage.removeItem("recomovie_user");
      window.location.href = "/";
      return;
    }

    localStorage.removeItem("request_token");
    localStorage.removeItem("session_id");
    localStorage.removeItem("tmdb_account_id");
    window.location.href = "/";
  };

  // -----------------------------
  // Pick active lists for UI
  // -----------------------------
  const favoriteMovies = isRecomovie
    ? recomovieFavoriteMovies
    : tmdbFavoriteMovies;
  const watchlistMovies = isRecomovie
    ? recomovieWatchlistMovies
    : tmdbWatchlistMovies;

  // Not logged in states
  if (isRecomovie && !recomovieUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Not logged in</Typography>
      </Box>
    );
  }

  if (!isRecomovie && !tmdbAccountId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Not logged in</Typography>
      </Box>
    );
  }

  const isLoading = isRecomovie ? isFetchingRecomovie : isFetchingTmdbList;
  const hasNoLists =
    !favoriteMovies?.results?.length && !watchlistMovies?.results?.length;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
      </Box>

      {!isRecomovie && isTmdbListError && (
        <Typography variant="body1">
          Failed to load TMDb lists from backend.
        </Typography>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : hasNoLists ? (
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
