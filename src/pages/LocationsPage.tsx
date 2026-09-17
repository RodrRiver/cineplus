import { MapPin, Monitor, Crown, Clapperboard } from 'lucide-react';
import Container from '../components/ui/Container';
import Badge from '../components/ui/Badge';
import { LOCATIONS } from '../data/locations';

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      <Container className="pt-24 pb-12">
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-2">
          Nuestras Sucursales
        </h1>
        <p className="text-text-secondary mb-8">
          Encuentra tu CinePlus más cercano
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-surface-700 rounded-2xl p-6 border border-surface-600 hover:border-gold-400/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-primary group-hover:text-gold-400 transition-colors">
                    {loc.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1.5 text-text-secondary text-sm">
                    <MapPin size={14} className="shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <p className="text-text-muted text-sm mt-0.5 ml-5">
                    {loc.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                  <Monitor size={14} />
                  <span>{loc.screens} salas</span>
                </div>
                {loc.hasVIP && (
                  <Badge variant="purple">
                    <Crown size={12} className="mr-1" />
                    VIP
                  </Badge>
                )}
                {loc.hasIMAX && (
                  <Badge variant="blue">
                    <Clapperboard size={12} className="mr-1" />
                    IMAX
                  </Badge>
                )}
              </div>

              <div className="pt-4 border-t border-surface-600">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-text-muted text-xs uppercase tracking-wider">Horario</p>
                    <p className="text-text-secondary mt-0.5">10:00 AM - 11:30 PM</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs uppercase tracking-wider">Teléfono</p>
                    <p className="text-text-secondary mt-0.5">2200-{loc.screens}000</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
