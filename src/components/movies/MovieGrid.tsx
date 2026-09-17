import type { TMDBMovie } from '../../types/tmdb';
import MovieCard from './MovieCard';
import Skeleton from '../ui/Skeleton';

interface MovieGridProps {
  movies: TMDBMovie[];
  loading?: boolean;
  showRating?: boolean;
}

export default function MovieGrid({ movies, loading, showRating = true }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded" />
            <Skeleton className="mt-1 h-3 w-1/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} showRating={showRating} />
      ))}
    </div>
  );
}
