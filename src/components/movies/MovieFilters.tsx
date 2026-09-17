import { Search, X } from 'lucide-react';
import type { TMDBGenre } from '../../types/tmdb';
import Badge from '../ui/Badge';

interface MovieFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenre: number | null;
  onGenreChange: (id: number | null) => void;
  genres: TMDBGenre[];
}

export default function MovieFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
}: MovieFiltersProps) {
  return (
    <div className="sticky top-16 z-30 bg-surface-900 py-4 space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Buscar películas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-surface-700 text-text-primary placeholder-text-muted rounded-full py-2.5 pl-11 pr-10 outline-none focus:ring-2 focus:ring-gold-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => onGenreChange(null)}>
          <Badge
            variant={selectedGenre === null ? 'gold' : 'default'}
            className="cursor-pointer whitespace-nowrap"
          >
            Todos
          </Badge>
        </button>
        {genres.map((genre) => (
          <button key={genre.id} onClick={() => onGenreChange(genre.id)}>
            <Badge
              variant={selectedGenre === genre.id ? 'gold' : 'default'}
              className="cursor-pointer whitespace-nowrap"
            >
              {genre.name}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
