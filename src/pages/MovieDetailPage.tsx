import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Clock, MapPin, CalendarClock } from 'lucide-react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useMovies } from '../hooks/useMovies';
import { posterUrl, backdropUrl, profileUrl } from '../api/tmdb';
import { LOCATIONS } from '../data/locations';
import { generateShowtimes } from '../data/showtimes';
import Container from '../components/ui/Container';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import Skeleton from '../components/ui/Skeleton';
import TrailerModal from '../components/movies/TrailerModal';

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = Number(id);
  const { movie, loading, error } = useMovieDetail(movieId);
  const { movies: nowPlaying } = useMovies('now_playing');

  const isNowPlaying = useMemo(
    () => nowPlaying.some((m) => m.id === movieId),
    [nowPlaying, movieId]
  );

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);

  const trailerKey = useMemo(() => {
    if (!movie) return null;
    const yt = movie.videos.results.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );
    return yt?.key ?? null;
  }, [movie]);

  const showtimes = useMemo(
    () => generateShowtimes(movieId, selectedLocation, todayString()),
    [movieId, selectedLocation]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Skeleton className="h-[50vh] min-h-[400px] w-full rounded-none" />
        <Container className="relative -mt-32 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="hidden md:block w-64 h-96 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-4 pt-36 md:pt-0">
              <Skeleton className="h-10 w-3/4 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-4">
            Película no encontrada
          </h1>
          <p className="text-text-secondary mb-6">
            {error || 'No pudimos encontrar la película que buscas'}
          </p>
          <Button as={Link} to="/movies">
            Volver a cartelera
          </Button>
        </div>
      </div>
    );
  }

  const backdrop = backdropUrl(movie.backdrop_path);
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {backdrop ? (
          <img
            src={backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
      </div>

      <Container className="relative -mt-32 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <img
              src={posterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-3">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {year && (
                <span className="flex items-center gap-1 text-text-secondary text-sm">
                  <Calendar size={14} />
                  {year}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1 text-text-secondary text-sm">
                  <Clock size={14} />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.genres.map((g) => (
                <Badge key={g.id}>{g.name}</Badge>
              ))}
            </div>

            {isNowPlaying && (
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={movie.vote_average} />
                <span className="text-text-muted text-sm">
                  ({movie.vote_count.toLocaleString()} votos)
                </span>
              </div>
            )}

            {movie.tagline && (
              <p className="italic text-gold-400 mb-4">{movie.tagline}</p>
            )}

            <p className="text-text-secondary leading-relaxed mb-6">
              {movie.overview || 'Sin sinopsis disponible.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {trailerKey && (
                <Button onClick={() => setTrailerOpen(true)}>
                  <Play size={18} className="mr-2" />
                  Ver Trailer
                </Button>
              )}
              {isNowPlaying ? (
                <Button
                  as={Link}
                  to={`/movie/${movie.id}/book`}
                  variant="secondary"
                >
                  Comprar Boletos
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-600 text-text-muted">
                  <CalendarClock size={18} />
                  <span className="font-medium">Próximamente en cartelera</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-6">
            Reparto
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {movie.credits.cast.slice(0, 10).map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center flex-shrink-0 w-20"
              >
                <img
                  src={profileUrl(member.profile_path)}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <p className="text-text-primary text-xs text-center font-medium line-clamp-2">
                  {member.name}
                </p>
                <p className="text-text-muted text-xs text-center line-clamp-1">
                  {member.character}
                </p>
              </div>
            ))}
          </div>
        </section>

        {isNowPlaying && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-semibold text-text-primary mb-6">
              Horarios
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                    selectedLocation === loc.id
                      ? 'bg-gold-400 text-surface-900 font-semibold'
                      : 'bg-surface-700 text-text-secondary hover:bg-surface-600'
                  }`}
                >
                  <MapPin size={14} />
                  {loc.name}
                </button>
              ))}
            </div>

            {showtimes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {showtimes.map((st) => (
                  <Link
                    key={st.id}
                    to={`/movie/${movie.id}/book`}
                    className="flex items-center justify-between bg-surface-800 border border-surface-600 rounded-xl p-4 hover:border-gold-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-text-primary font-heading text-lg font-semibold group-hover:text-gold-400 transition-colors">
                        {st.time}
                      </span>
                      <Badge
                        variant={
                          st.format === 'VIP'
                            ? 'purple'
                            : st.format === 'IMAX'
                            ? 'blue'
                            : 'default'
                        }
                      >
                        {st.format}
                      </Badge>
                      <span className="text-text-muted text-xs">
                        {st.language}
                      </span>
                    </div>
                    <span className="text-gold-400 font-semibold">
                      ${st.price.toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-center py-8">
                No hay horarios disponibles para esta ubicación
              </p>
            )}
          </section>
        )}
      </Container>

      <TrailerModal
        videoKey={trailerKey}
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
}
