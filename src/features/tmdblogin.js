const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Apply TMDb user data to auth state + persist useful bits
export function applyTmdbUser(state, payload) {
  // If payload is null/undefined -> logged out state for TMDb
  state.user = payload ?? null;
  state.isAuthenticated = !!payload;

  if (payload) {
    state.provider = 'tmdb';

    // Optional: clear recomovie token if state has it
    if ('recomovieToken' in state) state.recomovieToken = null;

    if (payload?.id != null) {
      localStorage.setItem('tmdb_account_id', String(payload.id));
    }

    // Optional: cache TMDb user to reduce flicker on refresh
    localStorage.setItem('tmdb_user', JSON.stringify(payload));
  } else {
    // Only reset provider if intend setUser(null) to be a real logout
    // (TMDb logout is often handled elsewhere, so keep this conservative)
    state.provider = state.provider === 'tmdb' ? null : state.provider;
  }
}

// Initialize TMDb session from localStorage (refresh bootstrap)
export function bootstrapTmdbSession(state) {
  const tmdbSession = localStorage.getItem('session_id');
  if (!tmdbSession) return false;

  state.isAuthenticated = true;
  state.provider = 'tmdb';

  // Optional: clear recomovie token if your state has it
  if ('recomovieToken' in state) state.recomovieToken = null;

  // Optional: prefill user so Navbar can show "My Movies" immediately
  // (Navbar currently requires `user` to render the TMDb profile button)
  if (!state.user) {
    const cachedUser = safeJsonParse(localStorage.getItem('tmdb_user'));
    const cachedId = localStorage.getItem('tmdb_account_id');

    if (cachedUser) {
      state.user = cachedUser;
    } else if (cachedId) {
      // Minimal user placeholder (enough for Navbar to link to profile)
      state.user = { id: isNaN(Number(cachedId)) ? cachedId : Number(cachedId) };
    }
  }

  return true;
}
