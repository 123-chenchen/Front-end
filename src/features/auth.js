import { createSlice } from '@reduxjs/toolkit';

// Bootstrap auth from localStorage to avoid redirect flicker on refresh
const recomovieTokenFromStorage = localStorage.getItem('recomovie_token');
const recomovieUserFromStorage = localStorage.getItem('recomovie_user');
const tmdbSessionFromStorage = localStorage.getItem('session_id');

const initialState = {
  isAuthenticated:
    !!recomovieTokenFromStorage || !!recomovieUserFromStorage || !!tmdbSessionFromStorage,
  user: recomovieUserFromStorage ? JSON.parse(recomovieUserFromStorage) : null,

  // Recomovie login
  recomovieToken: recomovieTokenFromStorage || null,
  provider: recomovieTokenFromStorage || recomovieUserFromStorage
    ? 'recomovie'
    : tmdbSessionFromStorage
    ? 'tmdb'
    : null,
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

    // Bootstrap any existing session from storage (TMDb or Recomovie)
    loadInitialSession(state) {
      const recomovieToken = localStorage.getItem('recomovie_token');
      const recomovieUser = localStorage.getItem('recomovie_user');
      const tmdbSession = localStorage.getItem('session_id');

      if (recomovieToken || recomovieUser) {
        state.isAuthenticated = true;
        state.recomovieToken = recomovieToken || null;
        state.user = recomovieUser ? JSON.parse(recomovieUser) : state.user;
        state.provider = 'recomovie';
        return;
      }

      if (tmdbSession) {
        state.isAuthenticated = true;
        state.provider = 'tmdb';
      }
    },
  },
});

export const {
  setUser,
  setRecomovieUser,
  loadRecomovieSession,
  logoutRecomovie,
  loadInitialSession,
} = slice.actions;

export default slice.reducer;

