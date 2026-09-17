import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMovies } from '../../hooks/useMovies';
import MovieCard from '../movies/MovieCard';
import Skeleton from '../ui/Skeleton';

export default function UpcomingSection() {
  const { movies: raw, loading } = useMovies('upcoming');
  const today = new Date().toISOString().split('T')[0];
  const movies = useMemo(() => raw.filter((m) => m.release_date > today), [raw, today]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
          Proximamente
        </h2>
        <Link
          to="/coming-soon"
          className="flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors text-sm font-medium"
        >
          Ver todo
          <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="poster" className="w-full h-auto aspect-[2/3]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
