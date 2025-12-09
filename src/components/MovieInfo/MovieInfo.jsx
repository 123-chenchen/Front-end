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
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import styles from './styles';
import MovieList from '../MovieList/MovieList';
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
      {/* HÀNG 1: POSTER + THÔNG TIN PHIM */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          mt: 2.5,
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 320px' },
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            margin: { xs: '0 auto', md: '0' }, // Center on small screens
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
            style={sx.poster}
            alt={data?.title}
          />
        </Box>

        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '1 1 auto' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }, // Center on small screens
            margin: { xs: '0 auto', md: '0' }, // Center on small screens
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'center' } }}>
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

             <Typography variant="body1">
    {data?.runtime} min •{" "}
    {new Date(data?.release_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}{" "}
    • {data?.original_language?.toUpperCase()}
  </Typography>
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
            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', mt: 3 }}> 
              Overview
            </Typography>
            <Typography sx={{ mb: 4 }}>{data?.overview}</Typography>

            {/* Buttons */}
            <Box  sx={{
    mt: 4,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 3, // khoảng cách đều giữa các nút
    flexWrap: "wrap", // mobile tự xuống hàng
  }}>

  {/* HÀNG 1 - 3 NÚT */}
  <Grid 
    container 
    spacing={2} 
    sx={{ mb: 2, justifyContent: { xs: "center", md: "flex-start" } }}
  >
    {/* WEBSITE */}
    <Grid item>
      <Button
        variant="outlined"
        sx={{ borderRadius: "12px", px: 3 }}
        target="_blank"
        href={data?.homepage}
      >
        WEBSITE
      </Button>
    </Grid>

    {/* IMDb */}
    <Grid item>
      <Button
        variant="outlined"
        sx={{ borderRadius: "12px", px: 3 }}
        target="_blank"
        href={`https://www.imdb.com/title/${data?.imdb_id}`}
      >
        IMDb
      </Button>
    </Grid>

    {/* TRAILER */}
    <Grid item>
      <Button
        variant="outlined"
        sx={{ borderRadius: "12px", px: 3 }}
        onClick={() => setOpen(true)}
      >
        TRAILER
      </Button>
    </Grid>
  </Grid>

  {/* HÀNG 2 - 2 NÚT */}
  <Grid 
    container 
    spacing={2} 
    sx={{
      justifyContent: { xs: "center", md: "flex-start" }
    }}
  >
    {/* FAVORITE */}
    <Grid item>
      <Button
        variant="outlined"
        sx={{ borderRadius: "12px", px: 3 }}
        onClick={addToFavorites}
      >
        {isMovieFavorited ? "UNFAVORITE" : "FAVORITE"}
      </Button>
    </Grid>

    {/* WATCHLIST */}
    <Grid item>
      <Button
        variant="outlined"
        sx={{ borderRadius: "12px", px: 3 }}
        onClick={addToWatchList}
      >
        WATCHLIST {isMovieWatchlisted ? "-" : "+1"}
      </Button>
    </Grid>
  </Grid>

</Box>

          </Box>
        </Box>
      </Box>
 {/* HÀNG 2: Top Cast full width */}
        <Box sx={{ width: '100%', mt: 2.5 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Top Cast
          </Typography>
          <Grid container spacing={1}>
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
        <Box
          sx={{
              width: "120px",        // chiều rộng cố định
      height: "260px",       // chiều cao cố định
      display: "flex",
      flexDirection: "column",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
            alt={character.name}
            style={{
              width: "80%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px",
              flexShrink: 0,
            }}
          />

          <Typography
            color="textPrimary"
            variant="subtitle1"
            sx={{ 
              mt: 1, 
              fontWeight: 'bold',
              wordWrap: 'break-word',
              overflow: 'hidden',
              width: '100%',
              px: 1,
            }}
          >
            {character?.name}
          </Typography>

          <Typography
            color="textSecondary"
            variant="body2"
            sx={{
              wordWrap: 'break-word',
              overflow: 'hidden',
              width: '100%',
              px: 1,
            }}
          >
            {character?.character ? character.character.split('/')[0] : ''}
          </Typography>
        </Box>
      </Grid>
    ))}
</Grid>
      </Box>


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
