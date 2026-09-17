import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMovies } from '../../hooks/useMovies';
import MovieCard from '../movies/MovieCard';
import Skeleton from '../ui/Skeleton';

export default function NowPlayingCarousel() {
  const { movies, loading } = useMovies('now_playing');

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
          En Cartelera
        </h2>
        <Link
          to="/movies"
          className="flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors text-sm font-medium"
        >
          Ver todo
          <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="poster" className="w-full h-auto aspect-[2/3]" />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
