import { MapPin, Monitor } from 'lucide-react';
import Badge from '../ui/Badge';
import { LOCATIONS } from '../../data/locations';
import { useBookingStore } from '../../stores/bookingStore';

interface LocationPickerProps {
  onNext: () => void;
}

export default function LocationPicker({ onNext }: LocationPickerProps) {
  const location = useBookingStore((s) => s.location);
  const setLocation = useBookingStore((s) => s.setLocation);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
        Selecciona tu cine
      </h2>
      <p className="text-text-secondary mb-6">
        Elige la ubicación más conveniente para ti
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map((loc) => {
          const isSelected = location?.id === loc.id;

          return (
            <button
              key={loc.id}
              onClick={() => {
                setLocation(loc);
                onNext();
              }}
              className={`text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer group ${
                isSelected
                  ? 'bg-surface-700 border-gold-400 ring-2 ring-gold-400/30 shadow-lg shadow-gold-400/10'
                  : 'bg-surface-700 border-surface-600 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-gold-400 transition-colors">
                  {loc.name}
                </h3>
                <div className="flex gap-1.5">
                  {loc.hasVIP && <Badge variant="purple">VIP</Badge>}
                  {loc.hasIMAX && <Badge variant="blue">IMAX</Badge>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <MapPin className="w-4 h-4 text-gold-400/70 shrink-0" />
                <span className="text-sm">{loc.address}</span>
              </div>

              <p className="text-sm text-text-muted mb-3">{loc.city}</p>

              <div className="flex items-center gap-2 text-text-secondary">
                <Monitor className="w-4 h-4 text-gold-400/70" />
                <span className="text-sm">{loc.screens} salas</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
