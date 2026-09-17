import { useState } from 'react';
import { ChevronUp, ChevronDown, Ticket, MapPin, Clock, Armchair, Popcorn } from 'lucide-react';
import { useBookingStore } from '../../stores/bookingStore';
import { SNACKS } from '../../data/snacks';
import { posterUrl } from '../../api/tmdb';

export default function BookingSummary() {
  const movie = useBookingStore((s) => s.movie);
  const location = useBookingStore((s) => s.location);
  const showtime = useBookingStore((s) => s.showtime);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const snacks = useBookingStore((s) => s.snacks);
  const ticketSubtotal = useBookingStore((s) => s.ticketSubtotal);
  const snackSubtotal = useBookingStore((s) => s.snackSubtotal);
  const total = useBookingStore((s) => s.total);

  const [mobileOpen, setMobileOpen] = useState(false);

  const snackEntries = Object.entries(snacks)
    .map(([id, qty]) => {
      const item = SNACKS.find((s) => s.id === id);
      return item ? { name: item.name, qty, price: item.price * qty } : null;
    })
    .filter(Boolean) as Array<{ name: string; qty: number; price: number }>;

  const hasContent = movie || location || showtime || selectedSeats.length > 0;

  if (!hasContent) return null;

  const summaryContent = (
    <div className="space-y-4">
      {movie && (
        <div className="flex gap-3">
          <img
            src={posterUrl(movie.poster_path, 'w92')}
            alt={movie.title}
            className="w-14 h-20 object-cover rounded-lg shrink-0"
          />
          <div>
            <h4 className="font-heading font-semibold text-text-primary text-sm leading-tight">
              {movie.title}
            </h4>
          </div>
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="w-4 h-4 text-gold-400/70 shrink-0" />
          <span>{location.name}</span>
        </div>
      )}

      {showtime && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4 text-gold-400/70 shrink-0" />
          <span>
            {showtime.date} &middot; {showtime.time} &middot; {showtime.format}
          </span>
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-text-secondary">
          <Armchair className="w-4 h-4 text-gold-400/70 shrink-0 mt-0.5" />
          <span>
            {selectedSeats
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((s) => `${s.row}-${s.number}`)
              .join(', ')}
          </span>
        </div>
      )}

      {snackEntries.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-text-secondary">
          <Popcorn className="w-4 h-4 text-gold-400/70 shrink-0 mt-0.5" />
          <div>
            {snackEntries.map((entry) => (
              <div key={entry.name}>
                {entry.qty}x {entry.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {(selectedSeats.length > 0 || snackEntries.length > 0) && (
        <>
          <div className="border-t border-surface-600 pt-4 space-y-2">
            {selectedSeats.length > 0 && (
              <div className="flex justify-between text-sm text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Boletos</span>
                </div>
                <span>${ticketSubtotal().toFixed(2)}</span>
              </div>
            )}
            {snackEntries.length > 0 && (
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Snacks</span>
                <span>${snackSubtotal().toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-surface-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-text-primary">Total</span>
              <span className="font-heading text-xl font-bold text-gold-400">
                ${total().toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-28">
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">
            Resumen
          </h3>
          {summaryContent}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-surface-800 border-t border-surface-600 shadow-2xl">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
          >
            <span className="font-heading font-semibold text-text-primary text-sm">
              Resumen
            </span>
            <div className="flex items-center gap-3">
              {total() > 0 && (
                <span className="font-heading font-bold text-gold-400">
                  ${total().toFixed(2)}
                </span>
              )}
              {mobileOpen ? (
                <ChevronDown className="w-5 h-5 text-text-secondary" />
              ) : (
                <ChevronUp className="w-5 h-5 text-text-secondary" />
              )}
            </div>
          </button>

          {mobileOpen && (
            <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
              {summaryContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
