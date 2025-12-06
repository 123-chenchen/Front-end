import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

if (!tmdbApiKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing REACT_APP_TMDB_KEY — add your TMDB API key to .env.local and restart the dev server.'
  );
}

// Remote Swagger
const backendBaseUrl = 'http://45.77.248.87:8081/api';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',

  // 👉 default base URL is now YOUR .NET backend, not TMDb
  baseQuery: fetchBaseQuery({ baseUrl: backendBaseUrl }),

  endpoints: (builder) => ({

    // ============================
    // Get Genres  -> /api/Genres
    // ============================
    getGenres: builder.query({
      // your GenresController returns: { genres: [ { id, name }, ... ] }
      query: () => '/Genres',
    }),

    // ==========================================
    // Get Movies by [Type]  -> /api/movies
    // ==========================================
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        const safePage = page || 1;

        // Search
        if (searchQuery) {
          const encoded = encodeURIComponent(searchQuery);
          return `/movies?search=${encoded}&page=${safePage}`;
        }

        // Category (popular, top_rated, upcoming)
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string') {
          return `/movies?category=${genreIdOrCategoryName}&page=${safePage}`;
        }

        // Genre by numeric id
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number') {
          return `/movies?genreId=${genreIdOrCategoryName}&page=${safePage}`;
        }

        // Default: popular list
        return `/movies?category=popular&page=${safePage}`;
      },
    }),

    // ==========================================
    // Get Movie  ->  /api/movies/{id}
    // ==========================================
    getMovie: builder.query({
      query: (id) => `/movies/${id}`,
    }),

    // ==========================================
    // BELOW HERE: still talking directly to TMDb
    // (we'll migrate later if needed)
    // ==========================================

    // Get Recommendations (TMDb)
    getRecommendations: builder.query({
      query: ({ movie_id, list }) =>
        `https://api.themoviedb.org/3/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`,
    }),

    // Get Actor (TMDb)
    getActor: builder.query({
      query: (id) =>
        `https://api.themoviedb.org/3/person/${id}?api_key=${tmdbApiKey}`,
    }),

    // Get Movies by Actor (TMDb)
    getMoviesByActorId: builder.query({
      query: ({ id, page }) =>
        `https://api.themoviedb.org/3/discover/movie?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`,
    }),

    // Get User Specific Lists (TMDb)
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) =>
        `https://api.themoviedb.org/3/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`,
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
} = tmdbApi;
