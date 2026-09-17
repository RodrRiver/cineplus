import { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useBookingStore } from '../../stores/bookingStore';
import { SNACKS } from '../../data/snacks';
import { posterUrl } from '../../api/tmdb';

function useImageDataUrl(src: string | null): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => setDataUrl(null);
    img.src = src;
  }, [src]);

  return dataUrl;
}

export default function TicketConfirmation() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const movie = useBookingStore((s) => s.movie);
  const location = useBookingStore((s) => s.location);
  const showtime = useBookingStore((s) => s.showtime);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const snacks = useBookingStore((s) => s.snacks);
  const confirmationCode = useBookingStore((s) => s.confirmationCode);
  const total = useBookingStore((s) => s.total);
  const reset = useBookingStore((s) => s.reset);
  const navigate = useNavigate();

  const posterDataUrl = useImageDataUrl(
    movie?.poster_path ? posterUrl(movie.poster_path, 'w154') : null
  );

  const snackEntries = Object.entries(snacks)
    .map(([id, qty]) => {
      const item = SNACKS.find((s) => s.id === id);
      return item ? { name: item.name, qty } : null;
    })
    .filter(Boolean) as Array<{ name: string; qty: number }>;

  const formatBadge = {
    Estándar: 'default' as const,
    VIP: 'purple' as const,
    IMAX: 'blue' as const,
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="relative" ref={ticketRef}>
        <div
          className="absolute top-0 left-0 right-0 h-4 z-10"
          style={{
            background: 'radial-gradient(circle 8px at 16px 0, transparent 8px, #1A1A1A 8px)',
            backgroundSize: '32px 16px',
          }}
        />

        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 pt-6 pb-6" style={{ background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)' }}>
          <div className="px-6 pt-4 text-center">
            <h3 className="font-heading text-2xl font-bold tracking-wide text-gold-400">
              CinePlus
            </h3>
            <div
              className="w-16 h-0.5 mx-auto mt-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #C0C6CF, transparent)' }}
            />
          </div>

          {movie && (
            <div className="px-6 mt-5 flex gap-4">
              <img
                src={posterDataUrl || posterUrl(movie.poster_path, 'w154')}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg shadow-md shrink-0"
                crossOrigin="anonymous"
              />
              <div className="flex flex-col justify-center">
                <h4 className="font-heading text-lg font-bold text-text-primary leading-tight">
                  {movie.title}
                </h4>
                {showtime && (
                  <Badge variant={formatBadge[showtime.format]} className="mt-2 self-start">
                    {showtime.format}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="px-6 mt-5 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            {location && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                  Cine
                </p>
                <p className="text-text-primary font-semibold mt-0.5">
                  {location.name}
                </p>
              </div>
            )}

            {showtime && (
              <>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                    Fecha
                  </p>
                  <p className="text-text-primary font-semibold mt-0.5">
                    {showtime.date}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                    Hora
                  </p>
                  <p className="text-text-primary font-semibold mt-0.5">
                    {showtime.time}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                    Sala
                  </p>
                  <p className="text-text-primary font-semibold mt-0.5">
                    Sala {showtime.screen}
                  </p>
                </div>
              </>
            )}

            {selectedSeats.length > 0 && (
              <div className="col-span-2">
                <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                  Asientos
                </p>
                <p className="text-text-primary font-semibold mt-0.5">
                  {selectedSeats
                    .sort((a, b) => a.id.localeCompare(b.id))
                    .map((s) => `${s.row}-${s.number}`)
                    .join(', ')}
                </p>
              </div>
            )}
          </div>

          {snackEntries.length > 0 && (
            <div className="px-6 mt-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-1">
                Snacks
              </p>
              {snackEntries.map((entry) => (
                <p key={entry.name} className="text-text-primary text-sm">
                  {entry.qty}x {entry.name}
                </p>
              ))}
            </div>
          )}

          <div className="mx-6 my-5 border-t border-dashed border-surface-500" />

          <div className="px-6 flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                Total pagado
              </p>
              <p className="text-gold-400 text-xl font-bold font-heading mt-0.5">
                ${total().toFixed(2)}
              </p>
            </div>

            {confirmationCode && (
              <div className="bg-surface-600 p-2 rounded-lg">
                <QRCodeSVG
                  value={confirmationCode}
                  size={80}
                  level="M"
                  bgColor="#242424"
                  fgColor="#C0C6CF"
                />
              </div>
            )}
          </div>

          {confirmationCode && (
            <div className="px-6 mt-4 text-center">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
                Código de confirmación
              </p>
              <p className="text-gold-400 text-2xl font-bold font-mono tracking-[0.2em] mt-1">
                {confirmationCode}
              </p>
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-4 z-10"
          style={{
            background: 'radial-gradient(circle 8px at 16px 16px, transparent 8px, #1A1A1A 8px)',
            backgroundSize: '32px 16px',
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <Button
          variant="secondary"
          onClick={async () => {
            if (!ticketRef.current) return;
            try {
              const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#0A0A0A',
                scale: 2,
                useCORS: true,
                allowTaint: true,
              });
              const link = document.createElement('a');
              link.download = `CinePlus-${confirmationCode || 'ticket'}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              toast.success('Boleto descargado', {
                style: {
                  background: '#1A1A1A',
                  color: '#F5F5F5',
                  border: '1px solid #333',
                },
              });
            } catch {
              toast.error('Error al descargar', {
                style: {
                  background: '#1A1A1A',
                  color: '#F5F5F5',
                  border: '1px solid #333',
                },
              });
            }
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Boleto
        </Button>
        <Button
          onClick={() => {
            reset();
            navigate('/');
          }}
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
