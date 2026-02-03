import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  Paper,
  List,
  ListItemButton,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { searchMovie } from "../../features/currentGenreOrCategory";
import { useSearchAllQuery } from "../../services/moviesApi";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

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
    { skip: !shouldSearch },
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
        fullWidth
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
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 2000,
          }}
        >
          {!isFetching && !isError && hasAny && (
            <List dense disablePadding sx={sx.scrollbar}>
              {movies.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="overline" opacity={0.8}>
                      Movies
                    </Typography>
                  </Box>

                  {movies.map((m) => (
                    <ListItemButton
                      key={`m-${m.id}`}
                      onMouseDown={() => handlePickMovie(m.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={
                            m.poster_path
                              ? `${IMAGE_BASE_URL}${m.poster_path}`
                              : undefined
                          }
                          sx={sx.image}
                        />
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {m.title}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </>
              )}

              {people.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="overline" opacity={0.8}>
                      Actors
                    </Typography>
                  </Box>

                  {people.map((p) => (
                    <ListItemButton
                      key={`p-${p.id}`}
                      onMouseDown={() => handlePickActor(p.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={
                            p.profile_path
                              ? `${IMAGE_BASE_URL}${p.profile_path}`
                              : "/no-avatar.png"
                          }
                          alt={p.name}
                          sx={sx.image}
                        />
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {p.name}
                          </Typography>
                        }
                      />
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
