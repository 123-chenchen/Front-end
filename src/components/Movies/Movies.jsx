import React, { useState } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import MovieList from '../MovieList/MovieList';
import Pagination from '../Pagination/Pagination';
import FeaturedMovie from '../FeaturedMovie/FeaturedMovie';
import { useGetMoviesQuery } from '../../services/TMDB';
import styles from './styles';   // 👈 import styles

function Movies() {
  const [page, setPage] = useState(1);
  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory,
  );
  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });

  const theme = useTheme();
  const sx = styles(theme); // 👈 tạo object sx

  const lg = useMediaQuery((themeMUI) => themeMUI.breakpoints.only('lg'));
  const numberOfMovies = lg ? 17 : 19;

  if (isFetching) {
    return (
      <Box sx={sx.loadingContainer}>
        <CircularProgress size="2rem" />
      </Box>
    );
  }

  if (!data.results.length) {
    return (
      <Box sx={sx.noResultsContainer}>
        <Typography variant="h4">
          No movies that match that name.
          <br />
          Please searh for something else.
        </Typography>
      </Box>
    );
  }

  if (error) return 'An error has occured.';

  return (
    <Box sx={sx.root}>
      <FeaturedMovie movie={data.results[0]} />
      <MovieList movies={data} numberOfMovies={numberOfMovies} excludeFirst />
      <Pagination currentPage={page} setPage={setPage} totalPages={data.total_pages} />
    </Box>
  );
}

export default Movies;
