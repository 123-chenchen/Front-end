// src/utils/index.js
const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

// 1️⃣ Step 1: get TMDb request token and redirect user to TMDb
export const fetchToken = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/authentication/token/new?api_key=${tmdbApiKey}`
    );
    const data = await res.json();

    if (!data.success) {
      console.error('TMDb token error:', data);
      return;
    }

    const requestToken = data.request_token;
    localStorage.setItem('request_token', requestToken);

    const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}` +
      `?redirect_to=${encodeURIComponent(window.location.origin)}`;

    // send user to TMDb login/approve page
    window.location.href = redirectUrl;
  } catch (err) {
    console.error('fetchToken error:', err);
  }
};

// 2️⃣ Step 2: after redirect back, exchange token for session_id
export const createSessionId = async () => {
  const token = localStorage.getItem('request_token');
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/authentication/session/new?api_key=${tmdbApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ request_token: token }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      console.error('TMDb session error:', data);
      return null;
    }

    const sessionId = data.session_id;
    localStorage.setItem('session_id', sessionId);
    return sessionId;
  } catch (err) {
    console.error('createSessionId error:', err);
    return null;
  }
};
