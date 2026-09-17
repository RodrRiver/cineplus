import { useState, useMemo } from 'react';
import { Clock, Globe } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { generateShowtimes } from '../../data/showtimes';
import { useBookingStore } from '../../stores/bookingStore';

interface ShowtimeGridProps {
  movieId: number;
  onNext: () => void;
  onBack: () => void;
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getNext7Days(): { label: string; date: string; isToday: boolean }[] {
  const days: { label: string; date: string; isToday: boolean }[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayName = DAY_NAMES[d.getDay()];
    const dayNum = d.getDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    days.push({
      label: `${dayName} ${dayNum}`,
      date: `${yyyy}-${mm}-${dd}`,
      isToday: i === 0,
    });
  }

  return days;
}

export default function ShowtimeGrid({ movieId, onNext, onBack }: ShowtimeGridProps) {
  const location = useBookingStore((s) => s.location);
  const showtime = useBookingStore((s) => s.showtime);
  const setShowtime = useBookingStore((s) => s.setShowtime);

  const days = useMemo(() => getNext7Days(), []);
  const [selectedDate, setSelectedDate] = useState(days[0].date);

  const showtimes = useMemo(() => {
    if (!location) return [];
    return generateShowtimes(movieId, location.id, selectedDate);
  }, [movieId, location, selectedDate]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof showtimes> = {};
    for (const st of showtimes) {
      if (!groups[st.format]) groups[st.format] = [];
      groups[st.format].push(st);
    }
    return groups;
  }, [showtimes]);

  const formatOrder: Array<'Estándar' | 'VIP' | 'IMAX'> = ['Estándar', 'VIP', 'IMAX'];
  const formatBadgeVariant = {
    Estándar: 'default' as const,
    VIP: 'purple' as const,
    IMAX: 'blue' as const,
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
        Selecciona horario
      </h2>
      <p className="text-text-secondary mb-6">
        Elige la fecha y función de tu preferencia
      </p>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(day.date)}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              selectedDate === day.date
                ? 'bg-gold-400 text-surface-900 shadow-lg shadow-gold-400/20'
                : 'bg-surface-700 text-text-secondary hover:bg-surface-600 hover:text-text-primary'
            }`}
          >
            {day.isToday ? `Hoy ${day.label.split(' ')[1]}` : day.label}
          </button>
        ))}
      </div>

      {showtimes.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No hay funciones disponibles para esta fecha
        </div>
      ) : (
        <div className="space-y-6">
          {formatOrder.map((format) => {
            const items = grouped[format];
            if (!items || items.length === 0) return null;

            return (
              <div key={format}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={formatBadgeVariant[format]}>{format}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((st) => {
                    const isSelected = showtime?.id === st.id;

                    return (
                      <button
                        key={st.id}
                        onClick={() => {
                          setShowtime(st);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                          isSelected
                            ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400/30'
                            : 'border-surface-600 bg-surface-700/50 hover:border-gold-400/50 hover:bg-surface-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold-400" />
                          <span className="font-heading text-lg font-bold text-text-primary">
                            {st.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{st.language}</span>
                        </div>

                        <span className="ml-auto font-semibold text-gold-400">
                          ${st.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button
          onClick={() => {
            if (showtime) onNext();
          }}
          disabled={!showtime}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
