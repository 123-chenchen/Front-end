import { Routes, Route } from 'react-router-dom';
import { Movies, ActorInfo, MovieInfo, Profile, ProtectedRoute, MainLayout } from './index';
import LoginPage from '../pages/LoginPage';
import Approved from '../pages/Approved';

function App() {
  return (
    <Routes>
      {/* Public route without Navbar */}
      <Route path="/login" element={<LoginPage />} />
      {/* TMDb approval callback: finalize session then redirect */}
      <Route path="/approved" element={<Approved />} />

      {/* Protected routes with MainLayout (Navbar + content) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <MainLayout>
              <Movies />
            </MainLayout>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <MainLayout>
              <MovieInfo />
            </MainLayout>
          }
        />
        <Route
          path="/actors/:id"
          element={
            <MainLayout>
              <ActorInfo />
            </MainLayout>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/recomovie-profile/:id"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
