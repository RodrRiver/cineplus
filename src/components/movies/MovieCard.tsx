import { Link } from 'react-router-dom';
import { posterUrl } from '../../api/tmdb';
import type { TMDBMovie } from '../../types/tmdb';

interface MovieCardProps {
  movie: TMDBMovie;
  className?: string;
}

export default function MovieCard({ movie, className = '' }: MovieCardProps) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`group block ${className}`}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] group-hover:ring-2 group-hover:ring-gold-400/60">
        <img
          src={posterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-gold-400 text-surface-900 text-xs font-bold px-2 py-1 rounded-full">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <h3 className="mt-2 text-text-primary font-medium text-sm line-clamp-1">
        {movie.title}
      </h3>
      <p className="text-text-muted text-xs">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : '---'}
      </p>
    </Link>
  );
}
