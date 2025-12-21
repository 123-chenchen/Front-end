import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBase =
  process.env.REACT_APP_BACKEND_BASE_URL || 'https://localhost:7013/api';

const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('recomovie_token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
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
      query: ({ genreIdOrCategoryName, page = 1, searchQuery }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));

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

    // on progress...
    getRecommendations: builder.query({
      query: ({ movie_id, list }) => `movies/${movie_id}/${list}`,
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
  useGetRecommendationsQuery,
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = moviesApi;

// alias so components importing the other name won’t crash
export const useGetTmdbAccountListQuery = useGetListQuery;