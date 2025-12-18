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
        // Create or reuse session id, then fetch account and store user
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = await createSessionId();
        }

        if (sessionId) {
          const { data } = await moviesApi.get(`/account?session_id=${sessionId}`);
          dispatch(setUser(data));
        }

        const from = sessionStorage.getItem('auth_from') || '/';
        const safeFrom = from.startsWith('/login') ? '/' : from;
        sessionStorage.removeItem('auth_from');
        navigate(safeFrom, { replace: true });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('TMDb approval handling failed:', err);
        navigate('/login', { replace: true });
      }
    };

    finalizeTmdbSession();
  }, [dispatch, navigate]);
}
