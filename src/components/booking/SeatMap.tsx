import { useMemo } from 'react';
import { Accessibility } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import SeatLegend from './SeatLegend';
import { getSeatLayout, generateTakenSeats } from '../../data/seats';
import { useBookingStore } from '../../stores/bookingStore';
import type { Seat, SeatType } from '../../types/cinema';

interface SeatMapProps {
  format: 'Estándar' | 'VIP' | 'IMAX';
  showtimeId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function SeatMap({ format, showtimeId, onNext, onBack }: SeatMapProps) {
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const toggleSeat = useBookingStore((s) => s.toggleSeat);

  const { layout, cols } = useMemo(() => getSeatLayout(format), [format]);
  const takenSeats = useMemo(() => generateTakenSeats(showtimeId, layout), [showtimeId, layout]);

  const selectedIds = useMemo(
    () => new Set(selectedSeats.map((s) => s.id)),
    [selectedSeats]
  );

  function handleSeatClick(seatObj: Seat) {
    if (seatObj.status === 'taken') return;

    if (!selectedIds.has(seatObj.id) && selectedSeats.length >= 6) {
      toast.error('Máximo 6 boletos', {
        style: {
          background: '#1A1A1A',
          color: '#F5F5F5',
          border: '1px solid #333',
        },
      });
      return;
    }

    toggleSeat(seatObj);
  }

  function getSeatClasses(type: SeatType, status: 'available' | 'selected' | 'taken'): string {
    const base = 'w-7 h-7 md:w-8 md:h-8 rounded-md transition-all duration-150 flex items-center justify-center text-[10px] font-medium cursor-pointer';

    if (status === 'taken') {
      return `${base} bg-surface-800 opacity-30 cursor-not-allowed`;
    }

    if (status === 'selected') {
      return `${base} bg-gold-400 text-surface-900 scale-110 shadow-lg shadow-gold-400/30`;
    }

    switch (type) {
      case 'vip':
        return `${base} bg-vip-purple/30 hover:bg-vip-purple/70 border border-vip-purple/20`;
      case 'disabled':
        return `${base} bg-imax-blue/30 hover:bg-imax-blue/50 border border-imax-blue/20`;
      default:
        return `${base} bg-surface-600 hover:bg-gold-400/70`;
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
        Selecciona tus asientos
      </h2>
      <p className="text-text-secondary mb-8">
        {selectedSeats.length > 0
          ? `${selectedSeats.length} asiento${selectedSeats.length > 1 ? 's' : ''} seleccionado${selectedSeats.length > 1 ? 's' : ''}`
          : 'Puedes seleccionar hasta 6 asientos'}
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="relative mb-10">
          <div
            className="h-2 mx-8 rounded-b-[50%] bg-gradient-to-r from-gold-400/30 via-gold-400 to-gold-400/30 shadow-[0_0_30px_rgba(255,193,7,0.3)]"
          />
          <p className="text-center text-xs text-text-muted mt-2 tracking-[0.3em] uppercase font-heading">
            Pantalla
          </p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div
            className="inline-grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `24px repeat(${cols}, 1fr)`,
            }}
          >
            {layout.map((row, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);

              return (
                <div key={rowLetter} className="contents">
                  <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xs text-text-muted font-medium">
                    {rowLetter}
                  </div>

                  {row.map((seatType, colIndex) => {
                    if (seatType === 'none') {
                      return (
                        <div
                          key={`${rowLetter}-${colIndex}`}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      );
                    }

                    const seatId = `${rowLetter}${colIndex + 1}`;
                    const isTaken = takenSeats.has(seatId);
                    const isSelected = selectedIds.has(seatId);
                    const status = isTaken ? 'taken' : isSelected ? 'selected' : 'available';

                    const seatObj: Seat = {
                      id: seatId,
                      row: rowLetter,
                      number: colIndex + 1,
                      type: seatType,
                      status,
                    };

                    return (
                      <button
                        key={seatId}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(seatObj)}
                        className={getSeatClasses(seatType, status)}
                        title={`${rowLetter}-${colIndex + 1}`}
                      >
                        {seatType === 'disabled' && !isSelected ? (
                          <Accessibility className="w-3.5 h-3.5" />
                        ) : (
                          <span>{colIndex + 1}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <SeatLegend />
      </div>

      <div className="flex items-center justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button
          onClick={() => {
            if (selectedSeats.length > 0) onNext();
          }}
          disabled={selectedSeats.length === 0}
        >
          Continuar ({selectedSeats.length} {selectedSeats.length === 1 ? 'asiento' : 'asientos'})
        </Button>
      </div>
    </div>
  );
}
