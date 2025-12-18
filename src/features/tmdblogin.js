// TMDB login state helpers

// Apply TMDB user data to auth state
export function applyTmdbUser(state, payload) {
  state.user = payload;
  state.isAuthenticated = !!payload;

  // TMDb login → provider = tmdb unless provided
  if (!payload?.provider) {
    state.provider = 'tmdb';
  }
}

// Initialize TMDB session from localStorage
export function bootstrapTmdbSession(state) {
  const tmdbSession = localStorage.getItem('session_id');
  if (tmdbSession) {
    state.isAuthenticated = true;
    state.provider = 'tmdb';
  }
}
