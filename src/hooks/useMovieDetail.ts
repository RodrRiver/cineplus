import { useState, useEffect } from 'react';
import type { TMDBMovieDetail } from '../types/tmdb';
import { getMovieDetail } from '../api/tmdb';

export function useMovieDetail(id: number) {
  const [movie, setMovie] = useState<TMDBMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMovieDetail(id)
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar la película');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { movie, loading, error };
}
