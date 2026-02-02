import { Grid, Box, Fade } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Movie } from "../index";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";

function MovieList({ movies, excludeFirst = false }) {
  const theme = useTheme();
  const sx = styles(theme);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const list = useMemo(() => {
    if (!movies) return [];
    if (Array.isArray(movies)) return movies;
    if (Array.isArray(movies.results)) return movies.results;
    return [];
  }, [movies]);

  if (!list.length) return null;

  const startIndex = excludeFirst ? 1 : 0;

  return (
    <Grid container sx={sx.grid}>
      {list.slice(startIndex).map((movie, i) => (
        <Fade
          key={movie?.id ?? i}
          in={mounted}
          appear
          mountOnEnter
          timeout={300 + i * 120}
        >
          <Box sx={sx.box}>
            <Movie movie={movie} i={i} />
          </Box>
        </Fade>
      ))}
    </Grid>
  );
}

export default MovieList;
