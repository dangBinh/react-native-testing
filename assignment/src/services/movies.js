import { api } from './api';

const API_KEY = 'c32e509c6c649868f2bfae7b7e414c1c';

export const movieApi = api.injectEndpoints({
  endpoints: build => ({
    searchMovie: build.query({
      query: params => `/search/movie?${params}&api_key=${API_KEY}`,
    }),
    fetchMovieById: build.query({
      query: id => `/movie/${id}?api_key=${API_KEY}`,
    }),
    fetchMovieImages: build.query({
      query: id => `/movie/${id}/images?api_key=${API_KEY}`,
    }),
    fetchRelatedMovies: build.query({
      query: id => `/movie/${id}/similar?api_key=${API_KEY}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSearchMovieQuery,
  useFetchMovieByIdQuery,
  useFetchMovieImagesQuery,
  useFetchRelatedMoviesQuery,
} = movieApi;
