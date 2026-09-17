import type { TMDBMovieList, TMDBMovieDetail, TMDBGenre } from '../types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = 'es-ES';

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANG);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function getNowPlaying(page = 1): Promise<TMDBMovieList> {
  return fetchTMDB('/movie/now_playing', { page: String(page) });
}

export async function getUpcoming(page = 1): Promise<TMDBMovieList> {
  return fetchTMDB('/movie/upcoming', { page: String(page) });
}

export async function getPopular(page = 1): Promise<TMDBMovieList> {
  return fetchTMDB('/movie/popular', { page: String(page) });
}

export async function getMovieDetail(id: number): Promise<TMDBMovieDetail> {
  return fetchTMDB(`/movie/${id}`, { append_to_response: 'videos,credits' });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBMovieList> {
  return fetchTMDB('/search/movie', { query, page: String(page) });
}

let genreCache: TMDBGenre[] | null = null;
export async function getGenres(): Promise<TMDBGenre[]> {
  if (genreCache) return genreCache;
  const data = await fetchTMDB<{ genres: TMDBGenre[] }>('/genre/movie/list');
  genreCache = data.genres;
  return genreCache;
}

export function posterUrl(path: string | null, size = 'w500'): string {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-poster.svg';
}

export function backdropUrl(path: string | null, size = 'w1280'): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function profileUrl(path: string | null, size = 'w185'): string {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-avatar.svg';
}
