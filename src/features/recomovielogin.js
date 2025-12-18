// Recomovie login state helpers

import { setRecomovieUser } from './auth';

// Apply Recomovie user + token to auth state and persist
export function applyRecomovieUser(state, payload) {
  state.isAuthenticated = true;
  state.user = payload.user; // { username, role, ... }
  state.recomovieToken = payload.token;
  state.provider = 'recomovie';

  // Persist
  localStorage.setItem('recomovie_user', JSON.stringify(payload.user));
  localStorage.setItem('recomovie_token', payload.token);
}

// Load Recomovie session from localStorage on refresh
export function loadRecomovieSessionFromStorage(state) {
  const token = localStorage.getItem('recomovie_token');
  const user = localStorage.getItem('recomovie_user');

  if (token && user) {
    state.isAuthenticated = true;
    state.recomovieToken = token;
    state.user = JSON.parse(user);
    state.provider = 'recomovie';
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
  const recomovieToken = localStorage.getItem('recomovie_token');
  const recomovieUser = localStorage.getItem('recomovie_user');

  if (recomovieToken || recomovieUser) {
    state.isAuthenticated = true;
    state.recomovieToken = recomovieToken || null;
    state.user = recomovieUser ? JSON.parse(recomovieUser) : state.user;
    state.provider = 'recomovie';
    return true;
  }
  return false;
}

// Perform Recomovie login (network + state + storage)
export async function loginWithRecomovie(dispatch, { username, password }) {
  if (!username || !password) {
    throw new Error('Missing credentials');
  }

  const response = await fetch('http://45.77.248.87:8081/api/Account/Login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Invalid username or password');
  }

  let data = {};
  if (response.status !== 204) {
    data = await response.json();
  }

  if (data.accessToken) {
    localStorage.setItem('recomovie_token', data.accessToken);
  }

  const userPayload = {
    id: data.id ?? null,
    username: data.username ?? username,
  };

  localStorage.setItem('recomovie_user', JSON.stringify(userPayload));

  // Notify listeners (e.g., Navbar)
  window.dispatchEvent(new Event('storage-update'));

  dispatch(
    setRecomovieUser({
      user: userPayload,
      token: data.accessToken ?? null,
    })
  );

  return { user: userPayload, token: data.accessToken ?? null };
}
