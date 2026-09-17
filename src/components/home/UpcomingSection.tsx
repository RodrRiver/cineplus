import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMovies } from '../../hooks/useMovies';
import MovieCard from '../movies/MovieCard';
import Skeleton from '../ui/Skeleton';

export default function UpcomingSection() {
  const { movies: raw, loading: loadingUpcoming } = useMovies('upcoming');
  const { movies: nowPlaying, loading: loadingNow } = useMovies('now_playing');
  const loading = loadingUpcoming || loadingNow;
  const movies = useMemo(() => {
    const nowPlayingIds = new Set(nowPlaying.map((m) => m.id));
    return raw.filter((m) => !nowPlayingIds.has(m.id));
  }, [raw, nowPlaying]);

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
            <MovieCard key={movie.id} movie={movie} showRating={false} />
          ))}
        </div>
      )}
    </section>
  );
}
