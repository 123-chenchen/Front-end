import { useState, useEffect } from 'react';
import { Modal, Typography, Button, Grid, Box, CircularProgress, Rating} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import styles from './styles';
import { MovieList } from '../index';
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
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
      <Box display="flex" justifyContent="center"><CircularProgress/></Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" display="flex" justifyContent="center">Something went wrong - Go back.</Typography>
    );
  }

  return (
    <>
      <Box sx={sx.layout}> 
        <img
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          style={sx.image}
          alt={data?.title}
        />

        <Box flex="1" >
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>{data?.title}</Typography>
          
          <Typography variant="h5" align="center" gutterBottom fontStyle="italic">"{data?.tagline}"</Typography>
          
          <Grid container alignItems="baseline" my={1.5} >
            <Grid size={{ xs: 6, md: 4 }} >
              <Button variant="outlined"
                sx={{ borderRadius: "12px", color: 'Primary'}}
                target="_blank"
                href={`https://www.imdb.com/title/${data?.imdb_id}`}
              >       
                <Typography variant="subcribe1" fontWeightLight={300}>
                  IMDB {" "}
                  {data?.vote_average ? (
                    <>
                      {data.vote_average.toFixed(1)} / 10 {" "}
                      <Typography component="span" variant="caption" ml= '0.75' bgcolor= 'Primary'>
                        ({data.vote_count?.toLocaleString() ?? 0})
                      </Typography>
                    </>
                  ) : ('N/A')}
                </Typography>
              </Button>
            </Grid>
            <Grid size={{ xs: 6, md: 8 }}>
              <Typography variant="h5" align="right" gutterBottom>
                  {data?.runtime} min • {" "} {new Date(data?.release_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} {" "} • {data?.original_language?.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>  

          {/* Genres */}
          <Grid container sx={sx.genresContainer}>
            {data?.genres?.map((genre) => (
                <Link style={sx.links} key={genre.name} to="/" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
                  <img
                    src={genreIcons[genre.name.toLowerCase()]}
                    style={sx.genreImage}
                    alt={genre.name}
                  />
                  <Typography color="textPrimary" variant="subtitle1" gutterBottom>{ genre?.name }</Typography>
                </Link>
              ))}
            </Grid>

          <Typography variant="h4" fontWeight={500} gutterBottom>Overview</Typography>
          <Typography variant="body2" gutterBottom>{data?.overview}</Typography>            
          
          {/* Buttons */}
          <Grid container justifyContent="space-between" > 
            <Button variant="contained" sx={sx.button} target="_blank" href={data?.homepage}>WEBSITE</Button>
            <Button variant="contained" sx={sx.button} onClick={() => setOpen(true)}>TRAILER</Button>
            <Button variant="contained" sx={sx.button} onClick={addToFavorites}>{isMovieFavorited ? "UNFAVORITE" : "FAVORITE"}</Button>
            <Button variant="contained" sx={sx.button} onClick={addToWatchList}>WATCHLIST {isMovieWatchlisted ? "-" : "+1"}</Button>
          </Grid>

        </Box>
      </Box>
 
      {/* Top Cast */}
      <Box my= {6}>
        <Box sx={{ display: 'flex', gap: 1.5, my: 4}}>
          <Box sx={sx.line} />
          <Typography variant="h4">Top Cast</Typography>
        </Box>
          
        <Grid container>
          {data?.credits?.cast ?.filter((c) => c.profile_path).slice(0, 6).map((character) => (
            <Grid
              component={Link}
              to={`/actors/${character.id}`}
              sx={ sx.links }
            >
              <Box sx={sx.castContainer}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                  alt={character.name}
                  style={sx.castImage}
                />
                <Box sx={sx.castText}>
                  <Typography sx={sx.nameCast}>{character.name}</Typography>
                  <Typography sx={sx.stagename}>{character.character?.split('/')[0] ?? ''}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recommendations */}
      <Box sx={{ display: 'flex', gap: 1.5, my: 4}}>
        <Box sx={sx.line} />
          <Typography variant="h4">You might also like</Typography>
        </Box>
          {recommendations ? (<MovieList movies={recommendations}/>) : (<Typography>Sorry, nothing was found.</Typography>)}

        
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
