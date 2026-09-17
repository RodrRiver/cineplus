import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import Container from '../components/ui/Container';
import LocationPicker from '../components/booking/LocationPicker';
import ShowtimeGrid from '../components/booking/ShowtimeGrid';
import SeatMap from '../components/booking/SeatMap';
import SnackMenu from '../components/booking/SnackMenu';
import PaymentForm from '../components/booking/PaymentForm';
import TicketConfirmation from '../components/booking/TicketConfirmation';
import BookingSummary from '../components/booking/BookingSummary';
import { useBookingStore } from '../stores/bookingStore';
import { useMovieDetail } from '../hooks/useMovieDetail';

const STEPS = [
  { num: 1, label: 'Ubicación' },
  { num: 2, label: 'Horario' },
  { num: 3, label: 'Asientos' },
  { num: 4, label: 'Snacks' },
  { num: 5, label: 'Pago' },
  { num: 6, label: 'Confirmación' },
];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { movie: movieDetail, loading, error } = useMovieDetail(movieId);

  const currentStep = useBookingStore((s) => s.currentStep);
  const movie = useBookingStore((s) => s.movie);
  const showtime = useBookingStore((s) => s.showtime);
  const setMovie = useBookingStore((s) => s.setMovie);
  const nextStep = useBookingStore((s) => s.nextStep);
  const prevStep = useBookingStore((s) => s.prevStep);
  const reset = useBookingStore((s) => s.reset);

  useEffect(() => {
    if (movieDetail) {
      const stored = useBookingStore.getState();
      if (stored.movie?.id !== movieDetail.id || stored.confirmationCode) {
        reset();
      }
      setMovie({
        id: movieDetail.id,
        title: movieDetail.title,
        poster_path: movieDetail.poster_path,
        backdrop_path: movieDetail.backdrop_path,
      });
    }
  }, [movieDetail, setMovie, reset]);

  if (loading) {
    return (
      <Container className="pt-24 pb-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  if (error || !movieId) {
    return (
      <Container className="pt-24 pb-12">
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">No se pudo cargar la película</p>
          <button
            onClick={() => navigate('/')}
            className="text-gold-400 hover:underline cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-24 pb-20 lg:pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((step, index) => (
            <div key={step.num} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step.num < currentStep
                      ? 'bg-gold-400 text-surface-900'
                      : step.num === currentStep
                        ? 'bg-gold-400 text-surface-900 ring-4 ring-gold-400/30 scale-110'
                        : 'bg-surface-600 text-text-muted'
                  }`}
                >
                  {step.num < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    step.num <= currentStep ? 'text-gold-400' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block w-12 md:w-20 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                    step.num < currentStep ? 'bg-gold-400' : 'bg-surface-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {currentStep === 1 && (
            <LocationPicker
              onNext={() => nextStep()}
            />
          )}

          {currentStep === 2 && movie && (
            <ShowtimeGrid
              movieId={movie.id}
              onNext={() => nextStep()}
              onBack={() => prevStep()}
            />
          )}

          {currentStep === 3 && showtime && (
            <SeatMap
              format={showtime.format}
              showtimeId={showtime.id}
              onNext={() => nextStep()}
              onBack={() => prevStep()}
            />
          )}

          {currentStep === 4 && (
            <SnackMenu
              onNext={() => nextStep()}
              onBack={() => prevStep()}
            />
          )}

          {currentStep === 5 && (
            <PaymentForm
              onNext={() => nextStep()}
              onBack={() => prevStep()}
            />
          )}

          {currentStep === 6 && (
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-400/20 mb-4">
                  <Sparkles className="w-8 h-8 text-gold-400" />
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  ¡Compra exitosa!
                </h1>
                <p className="text-text-secondary">
                  Tu boleto ha sido generado. ¡Disfruta la película!
                </p>
              </div>
              <TicketConfirmation />
            </div>
          )}
        </div>

        {currentStep < 6 && (
          <div className="hidden lg:block w-80 shrink-0">
            <BookingSummary />
          </div>
        )}
      </div>

      {currentStep < 6 && (
        <div className="lg:hidden">
          <BookingSummary />
        </div>
      )}
    </Container>
  );
}
