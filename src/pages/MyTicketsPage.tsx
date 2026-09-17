import { Ticket, Trash2, Calendar, Clock, MapPin, Armchair } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Container from '../components/ui/Container';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useTicketStore } from '../stores/ticketStore';
import { posterUrl } from '../api/tmdb';
import { Link } from 'react-router-dom';

export default function MyTicketsPage() {
  const tickets = useTicketStore((s) => s.tickets);
  const removeTicket = useTicketStore((s) => s.removeTicket);

  const formatBadge = {
    Estándar: 'default' as const,
    VIP: 'purple' as const,
    IMAX: 'blue' as const,
  };

  return (
    <div className="min-h-screen bg-surface-900">
      <Container className="pt-24 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <Ticket className="text-gold-400" size={28} />
          <h1 className="font-heading text-4xl font-bold text-text-primary">
            Mis Boletos
          </h1>
        </div>
        <p className="text-text-secondary mb-8">
          Tu historial de compras
        </p>

        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="text-surface-600 mx-auto mb-4" size={64} />
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-2">
              No tienes boletos aún
            </h2>
            <p className="text-text-muted mb-6">
              Explora nuestra cartelera y compra tu primer boleto
            </p>
            <Button as={Link} to="/movies" variant="primary">
              Ver Cartelera
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.confirmationCode}
                className="bg-surface-700 rounded-xl border border-surface-600 overflow-hidden hover:border-gold-400/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={posterUrl(ticket.posterPath, 'w185')}
                    alt={ticket.movieTitle}
                    className="w-full sm:w-32 h-48 sm:h-auto object-cover shrink-0"
                  />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-text-primary">
                          {ticket.movieTitle}
                        </h3>
                        <Badge
                          variant={formatBadge[ticket.format as keyof typeof formatBadge] || 'default'}
                          className="mt-1"
                        >
                          {ticket.format}
                        </Badge>
                      </div>
                      <div className="hidden sm:block">
                        <QRCodeSVG
                          value={ticket.confirmationCode}
                          size={64}
                          bgColor="transparent"
                          fgColor="#A0A0A0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin size={14} className="shrink-0 text-text-muted" />
                        <span>{ticket.locationName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Calendar size={14} className="shrink-0 text-text-muted" />
                        <span>{ticket.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Clock size={14} className="shrink-0 text-text-muted" />
                        <span>{ticket.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Armchair size={14} className="shrink-0 text-text-muted" />
                        <span>{ticket.seats.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-600">
                      <div>
                        <span className="text-text-muted text-xs uppercase tracking-wider">Código: </span>
                        <span className="font-mono text-sm font-semibold text-gold-400">
                          {ticket.confirmationCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-bold text-text-primary">
                          ${ticket.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeTicket(ticket.confirmationCode)}
                          className="text-text-muted hover:text-error transition-colors p-1"
                          title="Eliminar boleto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
