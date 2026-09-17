import { useState, type FormEvent } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import Button from '../ui/Button';
import { useBookingStore } from '../../stores/bookingStore';
import { useTicketStore } from '../../stores/ticketStore';
import { SNACKS } from '../../data/snacks';

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const generateConfirmation = useBookingStore((s) => s.generateConfirmation);
  const total = useBookingStore((s) => s.total);
  const movie = useBookingStore((s) => s.movie);
  const location = useBookingStore((s) => s.location);
  const showtime = useBookingStore((s) => s.showtime);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const snacks = useBookingStore((s) => s.snacks);
  const addTicket = useTicketStore((s) => s.addTicket);

  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const cardDigits = cardNumber.replace(/\D/g, '');
  const expiryDigits = expiry.replace(/\D/g, '');
  const isValid =
    name.trim().length > 0 &&
    cardDigits.length === 16 &&
    expiryDigits.length === 4 &&
    cvv.length === 3;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (cardDigits.length !== 16) newErrors.card = 'Ingresa los 16 dígitos de la tarjeta';
    if (expiryDigits.length !== 4) newErrors.expiry = 'Formato MM/YY';
    if (cvv.length !== 3) newErrors.cvv = 'CVV de 3 dígitos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setTimeout(() => {
      generateConfirmation();
      const code = useBookingStore.getState().confirmationCode!;
      const snackEntries = Object.entries(snacks)
        .map(([id, qty]) => {
          const item = SNACKS.find((s) => s.id === id);
          return item ? { name: item.name, qty } : null;
        })
        .filter(Boolean) as Array<{ name: string; qty: number }>;

      addTicket({
        confirmationCode: code,
        movieTitle: movie?.title || '',
        posterPath: movie?.poster_path || null,
        locationName: location?.name || '',
        date: showtime?.date || '',
        time: showtime?.time || '',
        format: showtime?.format || '',
        screen: showtime?.screen || 0,
        seats: selectedSeats.map((s) => `${s.row}-${s.number}`),
        snacks: snackEntries,
        total: total(),
        purchasedAt: new Date().toISOString(),
      });

      setProcessing(false);
      onNext();
    }, 1500);
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-surface-600 border rounded-lg text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 ${
      errors[field]
        ? 'border-error focus:ring-2 focus:ring-error/30'
        : 'border-surface-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30'
    }`;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
        Información de pago
      </h2>
      <p className="text-text-secondary mb-6">
        Ingresa los datos de tu tarjeta para completar la compra
      </p>

      <form onSubmit={handleSubmit} className="bg-surface-700 rounded-xl p-6 border border-surface-600">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-600">
          <Lock className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">Conexión segura</span>
          <div className="ml-auto flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-text-muted" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Nombre del titular
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como aparece en la tarjeta"
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Número de tarjeta
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className={inputClass('card')}
            />
            {errors.card && (
              <p className="mt-1 text-xs text-error">{errors.card}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Fecha de vencimiento
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={inputClass('expiry')}
              />
              {errors.expiry && (
                <p className="mt-1 text-xs text-error">{errors.expiry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="000"
                maxLength={3}
                className={inputClass('cvv')}
              />
              {errors.cvv && (
                <p className="mt-1 text-xs text-error">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-surface-600">
          <div className="flex justify-between items-center mb-4">
            <span className="text-text-secondary">Total a pagar</span>
            <span className="font-heading text-xl font-bold text-gold-400">
              ${total().toFixed(2)}
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!isValid || processing}
            className="w-full"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </span>
            ) : (
              `Confirmar Pago — $${total().toFixed(2)}`
            )}
          </Button>
        </div>

        <p className="mt-4 text-xs text-text-muted italic text-center">
          Esto es una simulación. No se realizará ningún cargo.
        </p>
      </form>

      <div className="flex justify-start mt-6">
        <Button variant="ghost" onClick={onBack} disabled={processing}>
          Atrás
        </Button>
      </div>
    </div>
  );
}
