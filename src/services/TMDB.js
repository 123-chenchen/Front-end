import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

if (!tmdbApiKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing REACT_APP_TMDB_KEY — add your TMDB API key to .env.local and restart the dev server.'
  );
}

// .NET backend base URL
const backendBaseUrl = 'http://45.77.248.87:8081/api';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: backendBaseUrl }),
  endpoints: (builder) => ({
    // ---------- Genres ----------
    getGenres: builder.query({
      query: () => '/Genres',
    }),

    // ---------- Movies list (popular / top_rated / upcoming / genre / search) ----------
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        const safePage = page || 1;

        if (searchQuery) {
          const encoded = encodeURIComponent(searchQuery);
          return `/movies?search=${encoded}&page=${safePage}`;
        }

        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string') {
          return `/movies?category=${genreIdOrCategoryName}&page=${safePage}`;
        }

        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number') {
          return `/movies?genreId=${genreIdOrCategoryName}&page=${safePage}`;
        }

        return `/movies?category=popular&page=${safePage}`;
      },
    }),

    // ---------- Single movie details ----------
    getMovie: builder.query({
      query: (id) => `/movies/${id}`,
    }),

    // ---------- Recommendations (still direct TMDb for now) ----------
    getRecommendations: builder.query({
      query: ({ movie_id, list }) =>
        `https://api.themoviedb.org/3/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`,
    }),

    // ---------- Actor details via backend ----------
    getActor: builder.query({
      query: (id) => `/TMDbActor/${id}`,
    }),

    // ---------- Movies by actor via backend ----------
    getMoviesByActorId: builder.query({
      query: ({ id, page }) => {
        const safePage = page || 1;
        return `/TMDbActor/${id}/movies?page=${safePage}`;
      },
    }),

    // ---------- User specific lists via backend ----------
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => {
        const safePage = page || 1;

        const params = new URLSearchParams({
          listName,
          page: safePage.toString(),
        });

        if (sessionId) {
          params.append('sessionId', sessionId);
        }

        // -> /api/TMDbAccounts/{accountId}/list?listName=...&sessionId=...&page=...
        return `https://api.themoviedb.org/3/account/${accountId}/${safeListName}` +
           `?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${safePage}`;
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
} = tmdbApi;
