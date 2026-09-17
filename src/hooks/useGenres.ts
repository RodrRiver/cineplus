import { useState, useEffect } from 'react';
import type { TMDBGenre } from '../types/tmdb';
import { getGenres } from '../api/tmdb';

export function useGenres() {
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenres()
      .then((data) => {
        setGenres(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { genres, loading };
}
