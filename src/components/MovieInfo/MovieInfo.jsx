import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import styles from './styles';
import MovieList from '../MovieList/MovieList';
import { MovieSEO } from '../../utils/SEO';
import {
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetListQuery,
} from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import genreIcons from '../../assets/genres';

function MovieInfo() {
  const theme = useTheme();
  const sx = styles(theme);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();

  const { data, error, isFetching } = useGetMovieQuery(id);
  const sessionId = localStorage.getItem('session_id');

  const { data: favoriteMovies } = useGetListQuery(
    { listName: 'favorite/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  const { data: watchlistMovies } = useGetListQuery(
    { listName: 'watchlist/movies', accountId: user?.id, sessionId, page: 1 },
    { skip: !user?.id || !sessionId },
  );

  const { data: recommendations } = useGetRecommendationsQuery({
    movie_id: id,
    list: 'recommendations',
  });

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((movie) => movie?.id === data?.id),
    );
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(
      !!watchlistMovies?.results?.find((movie) => movie?.id === data?.id),
    );
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: !isMovieFavorited,
      },
    );
    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchList = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: !isMovieWatchlisted,
      },
    );
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size="8rem" />
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

  return (
    <>
      {data?.title && (
        <MovieSEO
          title={data.title}
          description={data?.overview || 'Movie details'}
          image={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          movieId={id}
        />
      )}
      {/* HÀNG 1: POSTER + THÔNG TIN PHIM */}
      <Grid
        container
        spacing={4}
        sx={{
          mt: 4,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' }, // mobile: dọc, desktop: ngang
        }}
      >
        {/* Cột trái: poster (rộng cố định) */}
        <Grid
          item
          xs={12}
          sx={{
            flex: { md: '0 0 320px' }, // ~320px cột trái
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
            style={sx.poster}
            alt={data?.title}
          />
        </Grid>

        {/* Cột phải: thông tin phim (ăn hết phần còn lại) */}
        <Grid
          item
          xs={12}
          sx={{
            flex: { md: '1 1 auto' },
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" gutterBottom>
              {data?.title} ({(data?.release_date || '').split('-')[0]})
            </Typography>

            <Typography variant="h5" gutterBottom>
              {data?.tagline}
            </Typography>

            {/* Rating + runtime */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating readOnly value={(data?.vote_average ?? 0) / 2} />
                <Typography variant="subtitle1" sx={{ ml: 1.25 }}>
                  {data?.vote_average ?? 'N/A'} / 10
                </Typography>
              </Box>

              <Typography variant="h6">{data?.runtime} min</Typography>
            </Box>

            {/* Genres */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 2,
                mt: 2,
              }}
            >
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
                    height={30}
                    alt={genre.name}
                  />
                  <Typography color="textPrimary" variant="subtitle1">
                    {genre?.name}
                  </Typography>
                </Link>
              ))}
            </Box>

            {/* Overview */}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              Overview
            </Typography>
            <Typography sx={{ mb: 4 }}>{data?.overview}</Typography>

            {/* Buttons */}
            <Grid item container sx={{ mt: 2 }}>
              <div style={sx.buttonContainer}>
                <Grid item xs={12} sm={6} sx={sx.buttonContainer}>
                  <ButtonGroup size="small" variant="outlined">
                    <Button
                      target="_blank"
                      rel="noopener noreferrer"
                      href={data?.homepage}
                      endIcon={<Language />}
                    >
                      Website
                    </Button>
                    <Button
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.imdb.com/title/${data?.imdb_id}`}
                      endIcon={<MovieIcon />}
                    >
                      IMDB
                    </Button>
                    <Button
                      onClick={() => setOpen(true)}
                      href="#"
                      endIcon={<Theaters />}
                    >
                      Trailer
                    </Button>
                  </ButtonGroup>
                </Grid>

                <Grid item xs={12} sm={6} sx={sx.buttonContainer}>
                  <ButtonGroup size="small" variant="outlined">
                    <Button
                      onClick={addToFavorites}
                      endIcon={
                        isMovieFavorited ? (
                          <FavoriteBorderOutlined />
                        ) : (
                          <Favorite />
                        )
                      }
                    >
                      {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                    </Button>
                    <Button
                      onClick={addToWatchList}
                      endIcon={
                        isMovieWatchlisted ? <Remove /> : <PlusOne />
                      }
                    >
                      Watchlist
                    </Button>
                    <Button
                      endIcon={<ArrowBack />}
                      sx={{ borderColor: 'primary.main' }}
                    >
                      <Typography
                        variant="subtitle2"
                        component={Link}
                        to="/"
                        color="inherit"
                        sx={{ textDecoration: 'none' }}
                      >
                        Back
                      </Typography>
                    </Button>
                  </ButtonGroup>
                </Grid>
              </div>
            </Grid>
          </Box>
        </Grid>


        {/* HÀNG 2: Top Cast full width */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Top Cast
          </Typography>
          <Grid container spacing={2}>
            {data?.credits?.cast
              ?.filter((c) => c.profile_path)
              .slice(0, 6)
              .map((character, i) => (
                <Grid
                  key={i}
                  item
                  xs={4}
                  md={2}
                  component={Link}
                  to={`/actors/${character.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    style={sx.castImage}
                    src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                    alt={character.name}
                  />
                  <Typography
                    color="textPrimary"
                    align="center"
                    noWrap
                  >
                    {character?.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    align="center"
                    noWrap
                  >
                    {character?.character
                      ? character.character.split('/')[0]
                      : ''}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Recommendations */}
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry, nothing was found.</Box>
        )}
      </Box>

      {/* Trailer Modal */}
      {data?.videos?.results?.length > 0 && (
        <Modal
          closeAfterTransition
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={sx.modal}>
            <iframe
              autoPlay
              style={sx.video}
              frameBorder="0"
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
