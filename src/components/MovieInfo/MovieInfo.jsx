import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Movie as MovieIcon,
  MovieCreationOutlined as MovieCreationOutlinedIcon,
} from "@mui/icons-material";

import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles";
import genreIcons from "../../assets/genres";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";

import {
  useGetMovieQuery,
  useRecommendTmdbMutation,
  useGetListQuery,
} from "../../services/moviesApi";

import api from "../../utils/api";
import MovieList from "../MovieList/MovieList";

function extractIds(listLike) {
  if (!listLike) return [];

  if (Array.isArray(listLike)) {
    return listLike
      .map((x) => {
        if (typeof x === "number") return x;
        if (typeof x === "string" && !Number.isNaN(Number(x))) return Number(x);
        return x?.movieId ?? x?.id;
      })
      .filter((n) => typeof n === "number" && !Number.isNaN(n));
  }

  if (Array.isArray(listLike.results)) return extractIds(listLike.results);

  return [];
}

function MovieInfo() {
  const theme = useTheme();
  const sx = styles(theme);
  const dispatch = useDispatch();

  const { user, provider } = useSelector((state) => state.user);
  const { id } = useParams();
  const movieId = Number(id);

  const isTmdb = provider === "tmdb";
  const isRecomovie = provider === "recomovie";

  // Important: fallback to localStorage so refresh still works
  const tmdbAccountId = isTmdb
    ? Number(
        user?.id ??
          user?.tmdbAccountId ??
          user?.TMDbAccountId ??
          user?.accountId ??
          localStorage.getItem("tmdb_account_id"),
      )
    : null;

  const { data, error, isFetching } = useGetMovieQuery(id);

  const [
    recommendTmdb,
    { data: recommendations, isLoading: recLoading, error: recError },
  ] = useRecommendTmdbMutation();

  const [recoMovies, setRecoMovies] = useState([]);

  const posterPath = data?.poster_path ?? data?.posterPath ?? "";
  const imdbId = data?.imdb_id ?? data?.imdbId ?? "";
  const releaseDate = data?.release_date ?? data?.releaseDate ?? null;
  const originalLanguage =
    data?.original_language ?? data?.originalLanguage ?? "";
  const runtime = data?.runtime ?? data?.runTime ?? null;

  // get tmdb id safely (works with different key names)
  const seedTmdbId = useMemo(() => {
    const raw =
      data?.tmdb_id ?? data?.tmdbId ?? data?.tmdbID ?? data?.TmdbId ?? null;

    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [data]);

  const isLoggedIn =
    !!localStorage.getItem("recomovie_token") ||
    !!localStorage.getItem("session_id");

  useEffect(() => {
    if (!seedTmdbId || !isLoggedIn) {
      setRecoMovies([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await recommendTmdb({
          seed_tmdb_id: seedTmdbId,
          k: 20,
          exclude_tmdb_ids: [seedTmdbId],
          w_content: 0.6,
          w_cf: 0.4,
        }).unwrap();

        if (!cancelled) setRecoMovies(res?.results ?? []);
      } catch (e) {
        console.error("Recommend failed:", e);
        if (!cancelled) setRecoMovies([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [seedTmdbId, recommendTmdb, isLoggedIn]);

  // UI state
  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
    setTimeout(() => setAlert((prev) => ({ ...prev, open: false })), 2500);
  };

  const skipTmdbLists = !isTmdb || !tmdbAccountId;

  const {
    data: favList,
    isError: favListError,
    refetch: refetchFavList,
  } = useGetListQuery(
    {
      listName: "favorite/movies",
      accountId: tmdbAccountId,
      page: 1,
      pageSize: 200,
    },
    { skip: skipTmdbLists },
  );

  const {
    data: watchList,
    isError: watchListError,
    refetch: refetchWatchList,
  } = useGetListQuery(
    {
      listName: "watchlist/movies",
      accountId: tmdbAccountId,
      page: 1,
      pageSize: 200,
    },
    { skip: skipTmdbLists },
  );
  const favoriteIds = useMemo(
    () => extractIds(favList?.results ?? []),
    [favList],
  );
  const watchIds = useMemo(
    () => extractIds(watchList?.results ?? []),
    [watchList],
  );

  // ---- initial flags: TMDb provider ----
  useEffect(() => {
    if (skipTmdbLists || !movieId) return;
    if (favListError || watchListError) return;

    setIsMovieFavorited(favoriteIds.includes(movieId));
    setIsMovieWatchlisted(watchIds.includes(movieId));
  }, [
    skipTmdbLists,
    movieId,
    favListError,
    watchListError,
    favoriteIds,
    watchIds,
  ]);

  // ---- initial flags: Recomovie provider ----
  useEffect(() => {
    if (!isRecomovie || !movieId) return;

    const loadPersonalFlags = async () => {
      try {
        const [favRes, watchRes] = await Promise.all([
          api.get("/me/movies/favorites"),
          api.get("/me/movies/watchlist"),
        ]);

        setIsMovieFavorited(
          favRes.data?.some((m) => (m.id ?? m.movieId) === movieId) ?? false,
        );
        setIsMovieWatchlisted(
          watchRes.data?.some((m) => (m.id ?? m.movieId) === movieId) ?? false,
        );
      } catch (err) {
        console.error(
          "Failed to load personal flags:",
          err.response?.data ?? err.message,
        );
      }
    };

    loadPersonalFlags();
  }, [isRecomovie, movieId]);

  // ---- Favorite toggle ----
  const addToFavorites = async () => {
    if (!movieId) return;

    if (!user || !provider) {
      showAlert("Please sign in to use this feature.", "warning");
      return;
    }

    // Personal Recomovie account
    if (isRecomovie) {
      try {
        if (isMovieFavorited) {
          await api.delete(`/me/movies/favorites/${movieId}`);
          showAlert("Removed from your favorites.", "info");
        } else {
          await api.post(`/me/movies/favorites/${movieId}`);
          showAlert("Added to your favorites.", "success");
        }
        setIsMovieFavorited((prev) => !prev);
      } catch (err) {
        console.error(
          "Recomovie favorite toggle failed:",
          err.response?.data ?? err.message,
        );
        showAlert("Something went wrong. Please try again.", "error");
      }
      return;
    }

    // TMDb account (backend DB)
    if (!isTmdb || !tmdbAccountId) {
      showAlert("TMDb account not found. Please sign in again.", "warning");
      return;
    }

    try {
      const next = !isMovieFavorited;

      await api.post(`/TMDbAccounts/${tmdbAccountId}/favorite`, {
        movieId,
        favorite: next,
      });

      // optimistic UI
      setIsMovieFavorited(next);

      // refresh lists so it stays consistent everywhere
      refetchFavList?.();

      showAlert(
        next ? "Added to your favorites." : "Removed from your favorites.",
        next ? "success" : "info",
      );
    } catch (err) {
      console.error(
        "TMDb favorite toggle failed:",
        err.response?.data ?? err.message,
      );
      showAlert("Backend favorite toggle failed.", "error");
    }
  };

  // ---- Watchlist toggle ----
  const addToWatchList = async () => {
    if (!movieId) return;

    if (!user || !provider) {
      showAlert("Please sign in to use this feature.", "warning");
      return;
    }

    // Personal Recomovie account
    if (isRecomovie) {
      try {
        if (isMovieWatchlisted) {
          await api.delete(`/me/movies/watchlist/${movieId}`);
          showAlert("Removed from your watchlist.", "info");
        } else {
          await api.post(`/me/movies/watchlist/${movieId}`);
          showAlert("Added to your watchlist.", "success");
        }
        setIsMovieWatchlisted((prev) => !prev);
      } catch (err) {
        console.error(
          "Recomovie watchlist toggle failed:",
          err.response?.data ?? err.message,
        );
        showAlert("Something went wrong. Please try again.", "error");
      }
      return;
    }

    // TMDb account (backend DB)
    if (!isTmdb || !tmdbAccountId) {
      showAlert("TMDb account not found. Please sign in again.", "warning");
      return;
    }

    try {
      const next = !isMovieWatchlisted;

      await api.post(`/TMDbAccounts/${tmdbAccountId}/watchlist`, {
        movieId,
        watchlist: next,
      });

      setIsMovieWatchlisted(next);
      refetchWatchList?.();

      showAlert(
        next ? "Added to your watchlist." : "Removed from your watchlist.",
        next ? "success" : "info",
      );
    } catch (err) {
      console.error(
        "TMDb watchlist toggle failed:",
        err.response?.data ?? err.message,
      );
      showAlert("Backend watchlist toggle failed.", "error");
    }
  };

  // ---- loading & error ----
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Link to="/">Something went wrong - Go back.</Link>
      </Box>
    );
  }

  const websiteUrl =
    (data?.homepage && String(data.homepage).trim()) ||
    (seedTmdbId ? `https://www.themoviedb.org/movie/${seedTmdbId}` : null);

  return (
    <>
      <Box sx={sx.layout}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          style={sx.image}
          alt={data?.title}
        />

        <Box flex="1">
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            {data?.title}
          </Typography>

          <Grid container alignItems="baseline" my={1.5}>
            <Grid size={4}>
              <Button
                variant="outlined"
                color={
                  theme.palette.mode === "dark"
                    ? theme.palette.error.main
                    : theme.palette.primary.main
                }
                sx={sx.imdb}
                target="_blank"
                href={`https://www.imdb.com/title/${data?.imdb_id}`}
              >
                <Typography variant="subcribe1" fontWeightLight={500}>
                  IMDB{" "}
                  {data?.vote_average ? (
                    <>
                      {data.vote_average.toFixed(1)} / 10{" "}
                      <Typography component="span" variant="caption" ml="0.75">
                        ({data.vote_count?.toLocaleString() ?? 0})
                      </Typography>
                    </>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Button>
            </Grid>

            <Grid size={8}>
              <Typography variant="h5" align="right" gutterBottom>
                {data?.runtime} min •{" "}
                {new Date(data?.release_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                • {data?.original_language?.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>

          {/* Genres */}
          <Grid container sx={sx.genresContainer}>
            {data?.genres?.map((genre) => (
              <Link
                style={sx.links}
                key={genre.name}
                to="/"
                onClick={() => dispatch(selectGenreOrCategory(genre.id))}
              >
                <img
                  src={genreIcons[genre.name.toLowerCase()]}
                  style={sx.genreImage}
                  alt={genre.name}
                />
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  gutterBottom
                >
                  {genre?.name}
                </Typography>
              </Link>
            ))}
          </Grid>

          <Typography variant="h5" fontWeight={500} gutterBottom>
            Overview
          </Typography>
          <Typography variant="body2" gutterBottom>
            {data?.overview}
          </Typography>

          {/* Top Cast */}
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Top Cast
            </Typography>

            <Grid container my={2}>
              {data?.credits?.cast
                ?.filter((c) => c.profile_path)
                .slice(0, 6)
                .map((character) => (
                  <Grid
                    component={Link}
                    to={`/actors/${character.id}`}
                    sx={sx.links}
                  >
                    <Box sx={sx.castContainer}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character.name}
                        style={sx.castImage}
                      />
                      <Box sx={sx.castText}>
                        <Typography sx={sx.nameCast}>
                          {character.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
          {alert.open && (
            <Alert
              variant="filled"
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
              sx={{
                position: "fixed",
                top: "64px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: (theme) => theme.zIndex.appBar + 1,
                width: "fit-content",
                maxWidth: "90%",
              }}
            >
              {alert.message}
            </Alert>
          )}
          {/* Buttons */}
          <Grid container justifyContent="space-between">
            <Button
              variant="contained"
              sx={sx.button}
              target="_blank"
              href={websiteUrl}
            >
              WEBSITE
            </Button>
            <Button
              variant="contained"
              sx={sx.button}
              onClick={() => setOpen(true)}
            >
              TRAILER
            </Button>
            <Button variant="contained" sx={sx.button} onClick={addToFavorites}>
              {isMovieFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Button>
            <Button variant="contained" sx={sx.button} onClick={addToWatchList}>
              {isMovieWatchlisted ? (
                <MovieIcon />
              ) : (
                <MovieCreationOutlinedIcon />
              )}
            </Button>
          </Grid>
        </Box>
      </Box>

      {/* Recommendations */}
      <Box sx={{ display: "flex", gap: 1.5, my: 4 }}>
        <Box sx={sx.line} />
        <Typography variant="h4">You might also like...</Typography>
      </Box>

      {/* NOT LOGGED IN */}
      {!isLoggedIn && (
        <Typography display="flex" justifyContent="center">
          {" "}
          You need to log in to see the recommendation.
        </Typography>
      )}

      {/* LOGGED IN ONLY */}
      {isLoggedIn && recLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {isLoggedIn && !recLoading && recError && (
        <Alert severity="warning">Failed to load recommendations.</Alert>
      )}

      {isLoggedIn &&
        !recLoading &&
        !recError &&
        (recoMovies.length ? (
          <MovieList movies={recoMovies} />
        ) : (
          <Typography>Sorry, nothing was found.</Typography>
        ))}

      {/* Trailer Modal */}
      {data?.videos?.results?.length > 0 && (
        <Modal closeAfterTransition open={open} onClose={() => setOpen(false)}>
          <div style={sx.modal}>
            <iframe
              autoPlay
              style={sx.video}
              title="Trailer"
              src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
              allow="autoplay"
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default MovieInfo;
