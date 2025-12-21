import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

import { MovieList, FeaturedMovie } from '../index';
import { useGetMoviesQuery } from '../../services/moviesApi';

function Movies() {
  const [page, setPage] = useState(1);
  const [moviesMap, setMoviesMap] = useState(new Map());
  const [featuredMovie, setFeaturedMovie] = useState(null);

  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory
  );

  const { data, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });

  useEffect(() => {
    setPage(1);
    setMoviesMap(new Map());
    setFeaturedMovie(null);
  }, [genreIdOrCategoryName, searchQuery]);

  useEffect(() => {
    if (!data?.results?.length) return;

    setMoviesMap((prev) => {
      const map = new Map(prev);
      data.results.forEach((movie) => {
        map.set(movie.id, movie);
      });
      return map;
    });
  }, [data]);

  useEffect(() => {
    if (moviesMap.size < 300 && data?.page < data?.total_pages && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [moviesMap.size, data, isFetching]);

  useEffect(() => {
    if (!featuredMovie && moviesMap.size > 0) {
      const [first, ...rest] = Array.from(moviesMap.values());
      setFeaturedMovie(first);

      const map = new Map();
      rest.forEach((m) => map.set(m.id, m));
      setMoviesMap(map);
    }
  }, [moviesMap, featuredMovie]);

  if (isFetching && !featuredMovie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
      <MovieList movies={{ results: Array.from(moviesMap.values()) }} />
    </Box>
  );
}

export default Movies;