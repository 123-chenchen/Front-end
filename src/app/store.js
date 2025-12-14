// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { moviesApi } from '../services/moviesApi';
import genreOrCategoryReducer from '../features/currentGenreOrCategory';
import userReducer from '../features/auth';

export default configureStore({
  reducer: {
    [moviesApi.reducerPath]: moviesApi.reducer,
    currentGenreOrCategory: genreOrCategoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      moviesApi.middleware
    ),
});
