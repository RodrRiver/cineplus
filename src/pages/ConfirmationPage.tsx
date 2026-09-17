import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Container from '../components/ui/Container';
import TicketConfirmation from '../components/booking/TicketConfirmation';
import { useBookingStore } from '../stores/bookingStore';

export default function ConfirmationPage() {
  const confirmationCode = useBookingStore((s) => s.confirmationCode);
  const navigate = useNavigate();

  useEffect(() => {
    if (!confirmationCode) {
      navigate('/', { replace: true });
    }
  }, [confirmationCode, navigate]);

  if (!confirmationCode) return null;

  return (
    <Container className="pt-24 pb-12">
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
    </Container>
  );
}
