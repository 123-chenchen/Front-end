import { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

import { MovieList, FeaturedMovie } from '../index';
import { useGetMoviesQuery } from '../../services/moviesApi';

const TARGET = 52;

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
    pageSize: 20
  });

  // reset when filter/search changes
  useEffect(() => {
    setPage(1);
    setMoviesMap(new Map());
    setFeaturedMovie(null);
  }, [genreIdOrCategoryName, searchQuery]);

  // ✅ REPLACE your "forEach add to map" effect with this capped version
  useEffect(() => {
    if (!data?.results?.length) return;

    setMoviesMap((prev) => {
      const map = new Map(prev);

      for (const movie of data.results) {
        if (map.size >= TARGET) break;     // hard cap
        map.set(movie.id, movie);          // still de-dupes by id
      }

      return map;
    });
  }, [data]);

  // fetch more pages only until we have TARGET unique movies
  useEffect(() => {
    if (moviesMap.size < TARGET && data?.page < data?.total_pages && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [moviesMap.size, data, isFetching]);

  // pick featured movie once, then keep rest in the list
  useEffect(() => {
    if (!featuredMovie && moviesMap.size > 0) {
      const [first, ...rest] = Array.from(moviesMap.values());
      setFeaturedMovie(first);

      const map = new Map();
      rest.forEach((m) => map.set(m.id, m));
      setMoviesMap(map);
    }
  }, [moviesMap, featuredMovie]);

  // small perf: avoid recreating arrays/objects unnecessarily
  const moviesArray = useMemo(() => Array.from(moviesMap.values()), [moviesMap]);

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
      {/* MovieList already supports array input in your code */}
      <MovieList movies={moviesArray} />
    </Box>
  );
}

export default Movies;