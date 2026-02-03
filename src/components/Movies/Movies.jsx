import { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress, IconButton, Fade } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useSelector } from "react-redux";
import style from "./styles";
import { MovieList, FeaturedMovie } from "../index";
import { useGetMoviesQuery } from "../../services/moviesApi";
import { useTheme } from "@mui/material/styles";

const TARGET = 54;
const FEATURED_COUNT = 5;
const SLIDE_INTERVAL = 4000;

function Movies() {
  const [page, setPage] = useState(1);
  const [moviesMap, setMoviesMap] = useState(new Map());

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const sx = style(theme);
  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory,
  );

  const { data, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
    pageSize: 20,
  });

  /* ================= RESET ================= */
  useEffect(() => {
    setPage(1);
    setMoviesMap(new Map());
    setFeaturedMovies([]);
    setFeaturedIndex(0);
  }, [genreIdOrCategoryName, searchQuery]);

  /* ================= COLLECT MOVIES ================= */
  useEffect(() => {
    if (!data?.results?.length) return;

    setMoviesMap((prev) => {
      const map = new Map(prev);

      for (const movie of data.results) {
        if (map.size >= TARGET) break;
        map.set(movie.id, movie);
      }

      return map;
    });
  }, [data]);

  /* ================= AUTO PAGINATION ================= */
  useEffect(() => {
    if (
      moviesMap.size < TARGET &&
      data?.page < data?.total_pages &&
      !isFetching
    ) {
      setPage((p) => p + 1);
    }
  }, [moviesMap.size, data, isFetching]);

  /* ================= PICK FEATURED ================= */
  useEffect(() => {
    if (featuredMovies.length === 0 && moviesMap.size >= FEATURED_COUNT) {
      const all = Array.from(moviesMap.values());

      const featured = all.slice(0, FEATURED_COUNT);
      const rest = all.slice(FEATURED_COUNT);

      setFeaturedMovies(featured);

      const map = new Map();
      rest.forEach((m) => map.set(m.id, m));
      setMoviesMap(map);
    }
  }, [moviesMap, featuredMovies.length]);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (featuredMovies.length === 0 || isHovered) return;

    const id = setInterval(() => {
      setFeaturedIndex((i) => (i === featuredMovies.length - 1 ? 0 : i + 1));
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, [featuredMovies, isHovered]);

  const moviesArray = useMemo(
    () => Array.from(moviesMap.values()),
    [moviesMap],
  );

  /* ================= RENDER ================= */
  return (
    <Box>
      {/* Loading */}
      {isFetching && featuredMovies.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Featured */}
      {featuredMovies.length > 0 && (
        <Box
          sx={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Fade
            key={featuredMovies[featuredIndex]?.id} // 👈 RẤT QUAN TRỌNG
            in={true}
            appear
            mountOnEnter
            timeout={500}
          >
            <Box>
              <FeaturedMovie movie={featuredMovies[featuredIndex]} />
            </Box>
          </Fade>

          {/* Prev */}
          <IconButton
            onClick={() =>
              setFeaturedIndex((i) =>
                i === 0 ? featuredMovies.length - 1 : i - 1,
              )
            }
            sx={{ ...sx.arrow, left: 16 }}
          >
            <ArrowBackIos />
          </IconButton>

          {/* Next */}
          <IconButton
            onClick={() =>
              setFeaturedIndex((i) =>
                i === featuredMovies.length - 1 ? 0 : i + 1,
              )
            }
            sx={{ ...sx.arrow, right: 16 }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Dots */}
          <Box sx={{ ...sx.dotsContainer }}>
            {featuredMovies.map((_, i) => (
              <Box
                key={i}
                onClick={() => setFeaturedIndex(i)}
                sx={{
                  ...sx.dot,
                  backgroundColor:
                    i === featuredIndex
                      ? theme.palette.common.white
                      : theme.palette.grey[500],
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Movie list */}
      <MovieList movies={moviesArray} />
    </Box>
  );
}

export default Movies;
