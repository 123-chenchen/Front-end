import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBase =
  process.env.REACT_APP_BACKEND_BASE_URL || "http://45.77.248.87:8081/api";

const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { endpoint, getState }) => {
      const state = getState();
      const provider = state?.user?.provider;

      const recomovieToken = localStorage.getItem("recomovie_token");
      const tmdbSession = localStorage.getItem("session_id");

      // ✅ only attach JWT if provider is recomovie
      if (provider === "recomovie" && recomovieToken && ["recommendTmdb", "getList"].includes(endpoint)) {
        headers.set("Authorization", `Bearer ${recomovieToken}`);
      }

      // ✅ attach TMDb session for TMDb users (or anytime it exists)
      if (endpoint === "recommendTmdb" && tmdbSession) {
        headers.set("X-TMDb-Session", tmdbSession);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /api/genres  -> returns { genres: [{id,name}] }
    getGenres: builder.query({
      query: () => 'genres',
    }),

    // GET /api/movies?category=&genreId=&search=&page=
    // props: { genreIdOrCategoryName, page, searchQuery }
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page = 1, searchQuery, pageSize = 20 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));

        if (searchQuery) {
          params.set('search', searchQuery);
        } else if (typeof genreIdOrCategoryName === 'string' && genreIdOrCategoryName) {
          // "popular" | "top_rated" | "upcoming"
          params.set('category', genreIdOrCategoryName);
        } else if (typeof genreIdOrCategoryName === 'number') {
          params.set('genreId', String(genreIdOrCategoryName));
        }

        const qs = params.toString();
        return `movies${qs ? `?${qs}` : ''}`;
      },
    }),

    // GET /api/movies/{id}
    getMovie: builder.query({
      query: (id) => `movies/${id}`,
    }),

    searchAll: builder.query({
      query: ({ q, limit = 10 }) => {
        const params = new URLSearchParams();
        params.set("q", q);
        params.set("limit", String(limit));
        return `search?${params.toString()}`;
      },
    }),

    // POST /api/recommendations/tmdb
    // Calls ASP.NET backend, which calls model API, maps to dbo.Movies, returns movie cards
    recommendTmdb: builder.mutation({
      query: (body) => ({
        url: 'recommendations/tmdb',
        method: 'POST',
        body,
      }),
    }),

    // GET /api/actors/{id}
    getActor: builder.query({
      query: (id) => `actors/${id}`,
    }),

    // GET /api/actors/{id}/movies?page=
    getMoviesByActorId: builder.query({
      query: ({ id, page = 1 }) => `actors/${id}/movies?page=${page}`,
    }),

    // GET /api/TMDbAccounts/{id}/list?listName=&page=
    getList: builder.query({
      query: ({ listName, accountId, page = 1, pageSize = 100 }) => {
        const params = new URLSearchParams();
        params.set('listName', listName);
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));

        return `/TMDbAccounts/${accountId}/list?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useRecommendTmdbMutation,
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
  useSearchAllQuery,
} = moviesApi;

// alias so components importing the other name won’t crash
export const useGetTmdbAccountListQuery = useGetListQuery;