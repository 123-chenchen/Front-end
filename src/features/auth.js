import { createSlice } from '@reduxjs/toolkit';

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Bootstrap once (prevents refresh flicker + keeps provider consistent)
const recomovieTokenFromStorage = localStorage.getItem('recomovie_token');
const recomovieUserFromStorage = safeJsonParse(localStorage.getItem('recomovie_user'));
const tmdbSessionFromStorage = localStorage.getItem('session_id');

const initialState = (() => {
  // Prefer Recomovie if present
  if (recomovieUserFromStorage || recomovieTokenFromStorage) {
    return {
      isAuthenticated: true,
      user: recomovieUserFromStorage,
      recomovieToken: recomovieTokenFromStorage || null,
      provider: 'recomovie',
    };
  }

  // Else TMDb if session exists (user will be filled by Navbar after it fetches /account)
  if (tmdbSessionFromStorage) {
    return {
      isAuthenticated: true,
      user: null,
      recomovieToken: null,
      provider: 'tmdb',
    };
  }

  return {
    isAuthenticated: false,
    user: null,
    recomovieToken: null,
    provider: null,
  };
})();

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // TMDb user (Navbar sets this after fetching /account)
    setUser(state, { payload }) {
      state.user = payload || null;
      state.isAuthenticated = !!payload;

      // If this action is used for TMDb login (current flow), provider should be tmdb
      state.provider = payload ? 'tmdb' : null;

      // If switching to TMDb, clear recomovie token in redux (optional, but keeps state clean)
      if (payload) {
        state.recomovieToken = null;
      }
    },

    // Recomovie login
    setRecomovieUser(state, { payload }) {
      // expected payload: { user: {...}, token: "..." }
      state.isAuthenticated = true;
      state.user = payload?.user ?? null;
      state.recomovieToken = payload?.token ?? null;
      state.provider = 'recomovie';

      // Persist
      if (payload?.user) {
        localStorage.setItem('recomovie_user', JSON.stringify(payload.user));
      }
      if (payload?.token) {
        localStorage.setItem('recomovie_token', payload.token);
      }
    },

    // Recomovie login on refresh (kept for compatibility if call it somewhere)
    loadRecomovieSession(state) {
      const token = localStorage.getItem('recomovie_token');
      const user = safeJsonParse(localStorage.getItem('recomovie_user'));

      if (token || user) {
        state.isAuthenticated = true;
        state.recomovieToken = token || null;
        state.user = user || null;
        state.provider = 'recomovie';
      }
    },

    // Optional: bootstrap whichever session exists (Recomovie first, else TMDb)
    loadInitialSession(state) {
      const token = localStorage.getItem('recomovie_token');
      const user = safeJsonParse(localStorage.getItem('recomovie_user'));
      const tmdbSession = localStorage.getItem('session_id');

      if (token || user) {
        state.isAuthenticated = true;
        state.recomovieToken = token || null;
        state.user = user || null;
        state.provider = 'recomovie';
        return;
      }

      if (tmdbSession) {
        state.isAuthenticated = true;
        state.user = null;
        state.recomovieToken = null;
        state.provider = 'tmdb';
        return;
      }

      state.isAuthenticated = false;
      state.user = null;
      state.recomovieToken = null;
      state.provider = null;
    },

    // Logout for Recomovie (TMDb logout still handled elsewhere in code)
    logoutRecomovie(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.recomovieToken = null;
      state.provider = null;

      localStorage.removeItem('recomovie_user');
      localStorage.removeItem('recomovie_token');
    },
  },
});

export const {
  setUser,
  setRecomovieUser,
  loadRecomovieSession,
  loadInitialSession,
  logoutRecomovie,
} = slice.actions;

export default slice.reducer;