// src/services/moviesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7013/api',
    prepareHeaders: (headers) => {
      // RecoMovie JWT from /api/Account/Login
      const token = localStorage.getItem('recomovie_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ---------------- Genres: GET /api/genres ----------------
    getGenres: builder.query({
      query: () => '/genres',
    }),

    // ---------------- Movies list: GET /api/movies ----------------
    // JSM props: { genreIdOrCategoryName, page, searchQuery }
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page = 1, searchQuery }) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());

        if (searchQuery) {
          // Highest priority
          params.set('search', searchQuery);
        } else if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'string'
        ) {
          // Category: "popular", "top_rated", "upcoming"
          params.set('category', genreIdOrCategoryName);
        } else if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'number'
        ) {
          // Numeric genre id
          params.set('genreId', genreIdOrCategoryName.toString());
        }

        const qs = params.toString();
        return `/movies${qs ? `?${qs}` : ''}`;
      },
    }),

    // ---------------- Movie details: GET /api/movies/{id} ----------------
    getMovie: builder.query({
      query: (id) => `/movies/${id}`,
    }),

    // ---------------- Future recommendations (not implemented yet) -------
    getRecommendations: builder.query({
      query: ({ movie_id, list }) => `/movies/${movie_id}/${list}`,
    }),

    // ---------------- Actor details: GET /api/actors/{id} ----------------
    getActor: builder.query({
      query: (id) => `/actors/${id}`,
    }),

    // ---------------- Actor movies: GET /api/actors/{id}/movies ----------
    getMoviesByActorId: builder.query({
      query: ({ id, page = 1 }) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        return `/actors/${id}/movies?${params.toString()}`;
      },
    }),

    // TMDb account lists: GET /api/TMDbAccounts/{id}/list
    // TMDb account lists: GET https://localhost:7013/api/TMDbAccounts/{id}/list
    getList: builder.query({
      query: ({ listName, accountId, page = 1 }) => {
        const params = new URLSearchParams();
        if (listName) params.set('listName', listName);
        params.set('page', page.toString());

        return {
          // absolute URL -> ignores TMDb baseUrl and hits your ASP.NET API
          url: `https://localhost:7013/api/TMDbAccounts/${accountId}/list?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = moviesApi;
