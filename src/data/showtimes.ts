import type { Showtime } from '../types/cinema';
import { LOCATIONS } from './locations';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function seedRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const TIME_SLOTS = ['13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00', '23:30'];

export function generateShowtimes(movieId: number, locationId: string, date: string): Showtime[] {
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location) return [];

  const seed = hashString(`${movieId}-${locationId}-${date}`);
  const rng = seedRandom(seed);

  const count = 3 + Math.floor(rng() * 3);

  const availableSlots = [...TIME_SLOTS];
  const selectedSlots: string[] = [];
  for (let i = 0; i < count && availableSlots.length > 0; i++) {
    const idx = Math.floor(rng() * availableSlots.length);
    selectedSlots.push(availableSlots[idx]);
    availableSlots.splice(idx, 1);
  }
  selectedSlots.sort();

  const formats: Array<'Estándar' | 'VIP' | 'IMAX'> = ['Estándar'];
  if (location.hasVIP) formats.push('VIP');
  if (location.hasIMAX) formats.push('IMAX');

  const showtimes: Showtime[] = selectedSlots.map((time, i) => {
    const format = formats[Math.floor(rng() * formats.length)];
    const language: 'Español' | 'Subtitulada' = rng() < 0.6 ? 'Español' : 'Subtitulada';

    let price: number;
    switch (format) {
      case 'VIP':
        price = 12.0;
        break;
      case 'IMAX':
        price = 9.5;
        break;
      default:
        price = 6.5;
    }

    const screen = 1 + Math.floor(rng() * location.screens);

    return {
      id: `${movieId}-${locationId}-${date}-${i}`,
      movieId,
      locationId,
      time,
      date,
      screen,
      format,
      price,
      language,
    };
  });

  return showtimes;
}
