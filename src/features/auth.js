import { createSlice } from '@reduxjs/toolkit';

import {
  applyRecomovieUser,
  bootstrapRecomovieSession,
  clearRecomovieSession,
  loadRecomovieSessionFromStorage,
} from './recomovielogin';
import { applyTmdbUser, bootstrapTmdbSession } from './tmdblogin';

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
  provider:
    recomovieTokenFromStorage || recomovieUserFromStorage
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
      applyTmdbUser(state, payload);
    },

    // Recomovie login
    setRecomovieUser(state, { payload }) {
      applyRecomovieUser(state, payload);
    },

    // Recomovie login on refresh
    loadRecomovieSession(state) {
      loadRecomovieSessionFromStorage(state);
    },

    // Logout for Recomovie (TMDb logout still handled elsewhere)
    logoutRecomovie(state) {
      clearRecomovieSession(state);
    },

    // Bootstrap any existing session from storage (TMDb or Recomovie)
    loadInitialSession(state) {
      const hasRecomovie = bootstrapRecomovieSession(state);
      if (!hasRecomovie) {
        bootstrapTmdbSession(state);
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
