import { Box, CssBaseline } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import Approved from '../features/Approved';
import Login from './Account/Login';
import Register from './Account/Register';
import { ActorInfo, MovieInfo, Movies, Profile } from './index';
import Navbar from './Navbar/Navbar';
import styles from './styles';

function Layout({ children }) {
  const theme = useTheme();
  const sx = styles(theme);

  return (
    <Box sx={sx.root}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={sx.content}>
        <Box sx={sx.toolbar} />
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Movies />
          </Layout>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <Layout>
            <MovieInfo />
          </Layout>
        }
      />
      <Route
        path="/actors/:id"
        element={
          <Layout>
            <ActorInfo />
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/approved" element={<Approved />} />

      <Route
        path="/tmdb-profile/:id"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/recomovie-profile/:id"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
