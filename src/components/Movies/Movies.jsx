import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import { MovieList,FeaturedMovie} from '../index';
import { useGetMoviesQuery } from '../../services/TMDB';
import styles from './styles';

function Movies() {
  const [page, setPage] = useState(1);
  const [featuredMovie, setFeaturedMovie] = useState(null); // ⭐ ảnh to
  const [movies, setMovies] = useState([]);                 // ⭐ list dưới

  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory,
  );

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });

  const theme = useTheme();
  const sx = styles(theme);

  useEffect(() => {
    if (!data?.results?.length) return;

    if (page === 1) {
      const [first, ...rest] = data.results;
      setFeaturedMovie(first);
      setMovies(rest);
    } else {
      setMovies((prev) => [...prev, ...data.results]);
    }
  }, [data, page]);


  if (isFetching && page === 1 && !featuredMovie) {
    return (
      <Box sx={sx.loadingContainer}>
        <CircularProgress size="2rem" />
      </Box>
    );
  }

  if (!isFetching && !featuredMovie && !movies.length) {
    return (
      <Box sx={sx.noResultsContainer}>
        <Typography variant="h4">
          No movies that match that name.
          <br />
          Please search for something else.
        </Typography>
      </Box>
    );
  }

  return (
    <Box >
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      <InfiniteScroll
        dataLength={movies.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={page < (data?.total_pages || 1)}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <CircularProgress />
          </Box>
        }
        style={{ overflow: 'hidden' }}
      >
        <MovieList  movies={{ results: movies }}/>
      </InfiniteScroll>
    </Box>
  );
}

export default Movies;
