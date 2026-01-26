import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '../services/TMDB';
import { moviesApi } from '../services/moviesApi';
import genreOrCategoryReducer from '../features/currentGenreOrCategory';
import userReducer from '../features/auth';

export default configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    currentGenreOrCategory: genreOrCategoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(tmdbApi.middleware)
      .concat(moviesApi.middleware),
});
