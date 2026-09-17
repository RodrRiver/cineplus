import { useState, useEffect, useMemo } from 'react';
import Container from '../components/ui/Container';
import MovieGrid from '../components/movies/MovieGrid';
import MovieFilters from '../components/movies/MovieFilters';
import { useMovies } from '../hooks/useMovies';
import { useGenres } from '../hooks/useGenres';
import { searchMovies } from '../api/tmdb';
import type { TMDBMovie } from '../types/tmdb';

export default function ComingSoonPage() {
  const { movies: upcomingRaw, loading: loadingMovies } = useMovies('upcoming');

  const today = new Date().toISOString().split('T')[0];
  const upcoming = useMemo(
    () => upcomingRaw.filter((m) => m.release_date > today),
    [upcomingRaw, today]
  );
  const { genres } = useGenres();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      searchMovies(searchQuery)
        .then((data) => setSearchResults(data.results))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const baseMovies = searchQuery.trim() ? searchResults : upcoming;

  const filteredMovies = useMemo(() => {
    if (selectedGenre === null) return baseMovies;
    return baseMovies.filter((m) => m.genre_ids.includes(selectedGenre));
  }, [baseMovies, selectedGenre]);

  const loading = searchQuery.trim() ? searching : loadingMovies;

  return (
    <div className="min-h-screen bg-surface-900">
      <Container className="pt-24 pb-12">
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-2">
          Próximamente
        </h1>
        <p className="text-text-secondary mb-6">
          Las películas que pronto llegarán a nuestras salas
        </p>

        <MovieFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          genres={genres}
        />

        <div className="mt-6">
          <MovieGrid movies={filteredMovies} loading={loading} />
          {!loading && filteredMovies.length === 0 && (
            <p className="text-center text-text-muted py-12">
              No se encontraron películas
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
