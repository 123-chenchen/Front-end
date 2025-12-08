import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import MovieList from '../MovieList/MovieList';
import FeaturedMovie from '../FeaturedMovie/FeaturedMovie';
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

  const lg = useMediaQuery((themeMUI) => themeMUI.breakpoints.only('lg'));

  // ⭐ Xử lý dữ liệu mỗi khi gọi API xong
  useEffect(() => {
    if (!data?.results?.length) return;

    if (page === 1) {
      // Trang đầu: tách 1 phim làm featured, còn lại cho list
      const [first, ...rest] = data.results;
      setFeaturedMovie(first);
      setMovies(rest);
    } else {
      // Các trang sau: chỉ nối thêm vào list
      setMovies((prev) => [...prev, ...data.results]);
    }
  }, [data, page]);

  if (error) return 'An error has occurred.';

  // ⭐ Loading lần đầu (chưa có featured)
  if (isFetching && page === 1 && !featuredMovie) {
    return (
      <Box sx={sx.loadingContainer}>
        <CircularProgress size="2rem" />
      </Box>
    );
  }

  // ⭐ Nếu tìm không ra phim
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
    <Box sx={sx.root}>
      {/* ẢNH TO: luôn tồn tại, không phụ thuộc page */}
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      {/* List phim, dùng infinite scroll */}
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
        <MovieList
          movies={{ results: movies }}
          excludeFirst={false} // đã tách featured rồi
        />
      </InfiniteScroll>
    </Box>
  );
}

export default Movies;
