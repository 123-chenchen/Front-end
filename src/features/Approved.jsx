import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSessionId, moviesApi } from '../utils';
import { setUser } from './auth';

export default function Approved() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeTmdbSession = async () => {
      try {
        // ✅ use ONE key everywhere
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) sessionId = await createSessionId();

        if (!sessionId) {
          navigate('/login', { replace: true });
          return;
        }

        const { data } = await moviesApi.get(`/account?session_id=${sessionId}`);
        dispatch(setUser(data));

        // optional but useful for refresh fallback
        if (data?.id) localStorage.setItem('tmdb_account_id', String(data.id));

        const from = sessionStorage.getItem('auth_from') || '/';
        const safeFrom = from.startsWith('/login') ? '/' : from;
        sessionStorage.removeItem('auth_from');
        navigate(safeFrom, { replace: true });
      } catch (err) {
        console.error('TMDb approval handling failed:', err);
        navigate('/login', { replace: true });
      }
    };

    finalizeTmdbSession();
  }, [dispatch, navigate]);
}
