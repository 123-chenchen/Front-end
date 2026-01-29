import { useEffect, useMemo, useState } from "react";
import { TextField, InputAdornment, Box, Paper, List, ListItemButton, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import styles from "./styles";
import { searchMovie } from "../../features/currentGenreOrCategory";
import { useSearchAllQuery } from "../../services/moviesApi";

// small debounce hook
function useDebouncedValue(value, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

function Search() {
  const theme = useTheme();
  const sx = styles(theme);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const debounced = useDebouncedValue(query, 250);

  const shouldSearch = debounced.trim().length >= 2;

  const { data, isFetching, isError } = useSearchAllQuery(
    { q: debounced.trim(), limit: 8 },
    { skip: !shouldSearch }
  );

  const movies = useMemo(() => data?.movies ?? [], [data]);
  const people = useMemo(() => data?.people ?? [], [data]);

  const hasAny = movies.length > 0 || people.length > 0;

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      const q = query.trim();
      if (!q) return;

      // keep your existing flow for full results grid
      dispatch(searchMovie(q));
      setOpen(false);
    }
  };

  const handlePickMovie = (id) => {
    setOpen(false);
    setQuery("");
    navigate(`/movie/${id}`);
  };

  const handlePickActor = (id) => {
    setOpen(false);
    setQuery("");
    navigate(`/actors/${id}`);
  };

  return (
    <Box sx={{ position: "relative", ...sx.searchContainer }}>
      <TextField
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleEnter}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // delay so click works
          setTimeout(() => setOpen(false), 150);
        }}
        variant="standard"
        placeholder="Search movies or actors..."
        InputProps={{
          sx: sx.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Suggestion dropdown */}
      {open && shouldSearch && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 2000,
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {isFetching ? "Searching..." : isError ? "Search error" : hasAny ? "Suggestions" : "No results"}
            </Typography>
          </Box>

          {!isFetching && !isError && hasAny && (
            <List dense disablePadding>
              {movies.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>
                      Movies
                    </Typography>
                  </Box>

                  {movies.map((m) => (
                    <ListItemButton key={`m-${m.id}`} onMouseDown={() => handlePickMovie(m.id)}>
                      <Typography variant="body2" noWrap>
                        {m.title}
                      </Typography>
                    </ListItemButton>
                  ))}
                </>
              )}

              {people.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>
                      Actors
                    </Typography>
                  </Box>

                  {people.map((p) => (
                    <ListItemButton key={`p-${p.id}`} onMouseDown={() => handlePickActor(p.id)}>
                      <Typography variant="body2" noWrap>
                        {p.name}
                      </Typography>
                    </ListItemButton>
                  ))}
                </>
              )}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Search;