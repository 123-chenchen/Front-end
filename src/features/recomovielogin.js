import api from '../utils/api';
import { setRecomovieUser } from './auth';

// Apply Recomovie user + token to auth state and persist
export function applyRecomovieUser(state, payload) {
  state.isAuthenticated = true;
  state.user = payload.user;
  state.recomovieToken = payload.token;
  state.provider = 'recomovie';

  // Persist
  localStorage.setItem('recomovie_user', JSON.stringify(payload.user));
  localStorage.setItem('recomovie_token', payload.token);
}

// Load Recomovie session from localStorage on refresh
export function loadRecomovieSessionFromStorage(state) {
  const token = localStorage.getItem('recomovie_token');
  const userRaw = localStorage.getItem('recomovie_user');

  if (token && userRaw) {
    try {
      state.isAuthenticated = true;
      state.recomovieToken = token;
      state.user = JSON.parse(userRaw);
      state.provider = 'recomovie';
    } catch {
      // Corrupt storage -> clear
      localStorage.removeItem('recomovie_user');
      localStorage.removeItem('recomovie_token');
    }
  }
}

// Remove Recomovie session and clear state
export function clearRecomovieSession(state) {
  state.isAuthenticated = false;
  state.user = null;
  state.recomovieToken = null;
  state.provider = null;

  localStorage.removeItem('recomovie_user');
  localStorage.removeItem('recomovie_token');
}

// Bootstrap Recomovie session presence without full user (for initial load)
export function bootstrapRecomovieSession(state) {
  const token = localStorage.getItem('recomovie_token');
  const userRaw = localStorage.getItem('recomovie_user');

  if (token || userRaw) {
    state.isAuthenticated = true;
    state.recomovieToken = token || null;

    if (userRaw) {
      try {
        state.user = JSON.parse(userRaw);
      } catch {
        state.user = null;
        localStorage.removeItem('recomovie_user');
      }
    }

    state.provider = 'recomovie';
    return true;
  }
  return false;
}

// Perform Recomovie login (network + state + storage)
export async function loginWithRecomovie(dispatch, { username, password }) {
  if (!username || !password) throw new Error('Missing credentials');

  const res = await api.post('/Account/Login', { username, password });

  // Expected backend response examples: { accessToken, id, username, role }
  const data = res?.data ?? {};

  const token = data.accessToken ?? data.token ?? null;

  const userPayload = {
    id: data.id ?? null,
    username: data.username ?? username,
    role: data.role ?? data.user?.role ?? null,
  };

  if (token) localStorage.setItem('recomovie_token', token);
  localStorage.setItem('recomovie_user', JSON.stringify(userPayload));

  // Notify listeners
  window.dispatchEvent(new Event('storage-update'));

  // Update Redux
  dispatch(
    setRecomovieUser({
      user: userPayload,
      token,
    }),
  );

  return { user: userPayload, token };
}