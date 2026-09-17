import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies';
import { backdropUrl } from '../../api/tmdb';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Skeleton from '../ui/Skeleton';
import type { TMDBMovie } from '../../types/tmdb';

function HeroSlide({ movie }: { movie: TMDBMovie }) {
  const bg = backdropUrl(movie.backdrop_path, 'original');

  return (
    <div
      className="relative h-[85vh] min-h-[600px] w-full bg-cover bg-center"
      style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />

      <Container className="relative h-full flex items-end pb-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary leading-tight">
            {movie.title}
          </h1>
          <p className="text-lg text-text-secondary line-clamp-2">
            {movie.overview}
          </p>
          <StarRating rating={movie.vote_average} size="md" />
          <div className="flex gap-4 pt-2">
            <Button as={Link} to={`/movie/${movie.id}`} variant="secondary" size="lg">
              Ver Detalles
            </Button>
            <Button as={Link} to={`/movie/${movie.id}/book`} variant="primary" size="lg">
              Comprar Boletos
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function HeroSection() {
  const { movies, loading } = useMovies('now_playing');
  const heroMovies = movies.slice(0, 5);

  if (loading) {
    return (
      <div className="h-[85vh] min-h-[600px] bg-surface-900 flex items-end">
        <Container className="pb-20 space-y-4 w-full">
          <Skeleton className="h-16 w-2/3 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-6 w-1/3 rounded" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-14 w-40 rounded-xl" />
            <Skeleton className="h-14 w-44 rounded-xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (heroMovies.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="hero-swiper"
    >
      {heroMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <HeroSlide movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
