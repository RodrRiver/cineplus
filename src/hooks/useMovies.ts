import { useState, useEffect } from 'react';
import type { TMDBMovie } from '../types/tmdb';
import { getNowPlaying, getUpcoming, getPopular } from '../api/tmdb';

export function useMovies(type: 'now_playing' | 'upcoming' | 'popular', page = 1) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetcher =
      type === 'now_playing' ? getNowPlaying : type === 'upcoming' ? getUpcoming : getPopular;

    fetcher(page)
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar películas');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [type, page]);

  return { movies, loading, error, totalPages };
}
