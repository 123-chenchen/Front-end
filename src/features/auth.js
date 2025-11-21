import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,

  // Recomovie login
  recomovieToken: null,
  provider: null, // "tmdb" or "recomovie"
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.user = payload;
      state.isAuthenticated = !!payload;

      // TMDb login → provider = tmdb
      if (!payload?.provider) {
        state.provider = 'tmdb';
      }
    },

    // Recomovie login
    setRecomovieUser(state, { payload }) {
      state.isAuthenticated = true;
      state.user = payload.user;         // { username, role }
      state.recomovieToken = payload.token;
      state.provider = 'recomovie';

      // Save persistently
      localStorage.setItem("recomovie_user", JSON.stringify(payload.user));
      localStorage.setItem("recomovie_token", payload.token);
    },

    // Recomovie login on refresh
    loadRecomovieSession(state) {
      const token = localStorage.getItem("recomovie_token");
      const user = localStorage.getItem("recomovie_user");

      if (token && user) {
        state.isAuthenticated = true;
        state.recomovieToken = token;
        state.user = JSON.parse(user);
        state.provider = "recomovie";
      }
    },

    // Logout for Recomovie (TMDb logout still handled elsewhere)
    logoutRecomovie(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.recomovieToken = null;
      state.provider = null;

      localStorage.removeItem("recomovie_user");
      localStorage.removeItem("recomovie_token");
    },
  },
});

export const {
  setUser,
  setRecomovieUser,
  loadRecomovieSession,
  logoutRecomovie,
} = slice.actions;

export default slice.reducer;

