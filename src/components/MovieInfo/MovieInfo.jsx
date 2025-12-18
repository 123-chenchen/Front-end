import { Alert, Box, Button, Grid, Modal, Typography, Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import genreIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB';
import { MovieList } from '../index';
import styles from './styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieIcon from '@mui/icons-material/Movie';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
function MovieInfo() {
  const theme = useTheme();
  const sx = styles(theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();

  const { data, error, isFetching } = useGetMovieQuery(id);
  const sessionId = localStorage.getItem('session_id');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity,
    });

    // Auto hide sau 2.5s
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 2500);
  };
  const { data: favoriteMovies } = useGetListQuery(
    { listName: 'favorite/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId }
  );

  const { data: watchlistMovies } = useGetListQuery(
    { listName: 'watchlist/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId }
  );

  const { data: recommendations } = useGetRecommendationsQuery({
    movie_id: id,
    list: 'recommendations',
  });

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);


  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    if (!user || !sessionId) {
      showAlert('Please sign in to use this feature.', 'warning');
      return;
    }

    try {
      await axios.post(
        `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
          process.env.REACT_APP_TMDB_KEY
        }&session_id=${sessionId}`,
        {
          media_type: 'movie',
          media_id: id,
          favorite: !isMovieFavorited,
        }
      );

      if (isMovieFavorited) {
        showAlert('Removed from your favorites.', 'info');
      } else {
        showAlert('Added to your favorites.', 'success');
      }

      setIsMovieFavorited((prev) => !prev);
    } catch (error) {
      showAlert('Something went wrong. Please try again.', 'error');
    }
  };

  const addToWatchList = async () => {
    if (!user || !sessionId) {
      showAlert('Please sign in to use this feature.', 'warning');
      return;
    }

    try {
      await axios.post(
        `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
          process.env.REACT_APP_TMDB_KEY
        }&session_id=${sessionId}`,
        {
          media_type: 'movie',
          media_id: id,
          watchlist: !isMovieWatchlisted,
        }
      );

      if (isMovieWatchlisted) {
        showAlert('Removed from your watchlist.', 'info');
      } else {
        showAlert('Added to your watchlist.', 'success');
      }

      setIsMovieWatchlisted((prev) => !prev);
    } catch (error) {
      showAlert('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
      <Box sx={sx.layout}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          style={sx.image}
          alt={data?.title}
        />

        <Box flex="1">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            {data?.title}
          </Typography>

          <Typography variant="h5" align="center" gutterBottom fontStyle="italic">
            "{data?.tagline}"
          </Typography>

          <Grid container alignItems="baseline" my={1.5}>
            <Grid size={4}>
              <Button
                variant="outlined"
                color={
                  theme.palette.mode === 'dark'
                    ? theme.palette.error.main
                    : theme.palette.primary.main
                }
                sx={sx.imdb}
                target="_blank"
                href={`https://www.imdb.com/title/${data?.imdb_id}`}
              >
                <Typography variant="subcribe1" fontWeightLight={500}>
                  IMDB{' '}
                  {data?.vote_average ? (
                    <>
                      {data.vote_average.toFixed(1)} / 10{' '}
                      <Typography component="span" variant="caption" ml="0.75">
                        ({data.vote_count?.toLocaleString() ?? 0})
                      </Typography>
                    </>
                  ) : (
                    'N/A'
                  )}
                </Typography>
              </Button>
            </Grid>

            <Grid size={8}>
              <Typography variant="h5" align="right" gutterBottom>
                {data?.runtime} min •{' '}
                {new Date(data?.release_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
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
                <Typography color="textPrimary" variant="subtitle1" gutterBottom>
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
                  <Grid component={Link} to={`/actors/${character.id}`} sx={sx.links}>
                    <Box sx={sx.castContainer}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character.name}
                        style={sx.castImage}
                      />
                      <Box sx={sx.castText}>
                        <Typography sx={sx.nameCast}>{character.name}</Typography>
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
                position: 'fixed',
                top: '64px', 
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: (theme) => theme.zIndex.appBar + 1,
                width: 'fit-content',
                maxWidth: '90%',
              }}
            >
              {alert.message}
            </Alert>
          )}
          {/* Buttons */}
          <Grid container justifyContent="space-between">
            <Button variant="contained" sx={sx.button} target="_blank" href={data?.homepage}>
              WEBSITE
            </Button>
            <Button variant="contained" sx={sx.button} onClick={() => setOpen(true)}>
              TRAILER
            </Button>
            <Button variant="contained" sx={sx.button} onClick={addToFavorites}>
              {isMovieFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Button>
            <Button variant="contained" sx={sx.button} onClick={addToWatchList}>
              {isMovieWatchlisted ? <MovieIcon /> : <MovieCreationOutlinedIcon />}
            </Button>
          </Grid>
        </Box>
      </Box>

      {/* Recommendations */}
      <Box sx={{ display: 'flex', gap: 1.5, my: 4 }}>
        <Box sx={sx.line} />
        <Typography variant="h4">You might also like...</Typography>
      </Box>
      {recommendations ? (
        <MovieList movies={recommendations} />
      ) : (
        <Typography>Sorry, nothing was found.</Typography>
      )}

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
