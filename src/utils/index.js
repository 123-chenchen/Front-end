import axios from 'axios';

// Ensure a developer-friendly message if the API key is missing at runtime.
if (!process.env.REACT_APP_TMDB_KEY) {
  // eslint-disable-next-line no-console
  console.error('Missing REACT_APP_TMDB_KEY — add your TMDB API key to .env.local and restart the dev server.');
}

export const moviesApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
  },
});

export const fetchToken = async () => {
  try {
    const { data } = await moviesApi.get('/authentication/token/new');

    const token = data.request_token;

    if (data.success) {
      localStorage.setItem('request_token', token);
      window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/approved`;
    }
  } catch (error) {
    // Log TMDB's response body when available to diagnose 401s and similar errors.
    // eslint-disable-next-line no-console
    console.error('fetchToken error:', error.response?.data ?? error.message);
  }
};

export const createSessionId = async () => {
  const token = localStorage.getItem('request_token');

  if (!token) return null;

  try {
    const { data } = await moviesApi.post('authentication/session/new', {
      request_token: token,
    });

    if (data && data.success) {
      const { session_id } = data;
      localStorage.setItem('session_id', session_id);
      return session_id;
    }

    // Log response if success flag is false so the developer can see why the session creation failed.
    // eslint-disable-next-line no-console
    console.error('createSessionId failed:', data);
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('createSessionId error:', error.response?.data ?? error.message);
    return null;
  }
};
