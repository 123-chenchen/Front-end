// src/components/Profile/RecomovieProfile.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";

import RatedCards from "../RatedCards/RatedCards";
import api from "../../utils/api";

function RecomovieProfile() {
  const storedUser = JSON.parse(localStorage.getItem("recomovie_user"));

  const [favoriteMovies, setFavoriteMovies] = useState(null);   // { results: [...] }
  const [watchlistMovies, setWatchlistMovies] = useState(null); // { results: [...] }

  const logout = () => {
    localStorage.removeItem("recomovie_token");
    localStorage.removeItem("recomovie_user");
    window.location.href = "/";
  };

  useEffect(() => {
    if (!storedUser) return;
    
    const loadLists = async () => {
      try {
        const [favRes, watchRes] = await Promise.all([
          api.get("/me/movies/favorites"),
          api.get("/me/movies/watchlist"),
        ]);

        // Shape data to match TMDb structure: { results: [...] }
        setFavoriteMovies({ results: favRes.data || [] });
        setWatchlistMovies({ results: watchRes.data || [] });
      } catch (err) {
        console.error(
          "Failed to load personal lists:",
          err.response?.data ?? err.message
        );
        setFavoriteMovies({ results: [] });
        setWatchlistMovies({ results: [] });
      }
    };

    loadLists();
  }, [storedUser]);

  if (!storedUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Not logged in</Typography>
      </Box>
    );
  }

  const hasNoLists =
    !favoriteMovies?.results?.length && !watchlistMovies?.results?.length;

  // 🔻 SAME UI STYLE AS YOUR TMDb Profile
  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>

      {hasNoLists ? (
        <Typography variant="h5">
          Add favourite or watchlist movies to see them here!
        </Typography>
      ) : (
        <Box>
          {favoriteMovies?.results?.length > 0 && (
            <RatedCards title="Favorite Movies" movies={favoriteMovies} />
          )}

          {watchlistMovies?.results?.length > 0 && (
            <RatedCards title="Watchlist" movies={watchlistMovies} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default RecomovieProfile;
