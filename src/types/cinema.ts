export interface CinemaLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  screens: number;
  hasVIP: boolean;
  hasIMAX: boolean;
}

export interface Showtime {
  id: string;
  movieId: number;
  locationId: string;
  time: string;
  date: string;
  screen: number;
  format: 'Estándar' | 'VIP' | 'IMAX';
  price: number;
  language: 'Español' | 'Subtitulada';
}

export type SeatType = 'standard' | 'vip' | 'disabled' | 'none';
export type SeatStatus = 'available' | 'selected' | 'taken';

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
}

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popcorn' | 'drinks' | 'candy' | 'combos';
}
