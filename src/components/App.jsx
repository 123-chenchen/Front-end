import { CssBaseline, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import styles from './styles';
import { Movies, ActorInfo, MovieInfo, Navbar, Profile } from './index';
import LoginPage from '../pages/LoginPage';

function App() {
  const theme = useTheme();
  const sx = styles(theme);

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLogin ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLogin]);

  return (
    <Box sx={sx.root}>
      <CssBaseline />

      <Navbar onLoginClick={() => setShowLogin(true)} />

      <Box component="main" sx={sx.content}>
        <Box sx={sx.toolbar} />

        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieInfo />} />
          <Route path="/actors/:id" element={<ActorInfo />} />
          <Route path="/profile/:id" element={<Profile />} />
      
        </Routes>
      </Box>

      {/* ===== LOGIN OVERLAY ===== */}
      {showLogin && (
        <>
          <Box
            onClick={() => setShowLogin(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0,0,0,0.55)',
            }}
          />

          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LoginPage onClose={() => setShowLogin(false)} />
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
