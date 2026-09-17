import type { CinemaLocation } from '../types/cinema';

export const LOCATIONS: CinemaLocation[] = [
  {
    id: 'metrocentro',
    name: 'CinePlus Metrocentro',
    address: 'Centro Comercial Metrocentro, 3er Nivel',
    city: 'San Salvador',
    screens: 8,
    hasVIP: true,
    hasIMAX: true,
  },
  {
    id: 'multiplaza',
    name: 'CinePlus Multiplaza',
    address: 'Centro Comercial Multiplaza, 2do Nivel',
    city: 'Antiguo Cuscatlán',
    screens: 6,
    hasVIP: true,
    hasIMAX: false,
  },
  {
    id: 'santa-ana',
    name: 'CinePlus Santa Ana',
    address: 'Centro Comercial MetroCenter Santa Ana',
    city: 'Santa Ana',
    screens: 5,
    hasVIP: false,
    hasIMAX: false,
  },
  {
    id: 'galerias',
    name: 'CinePlus Galerías',
    address: 'Galerías Escalón, 4to Nivel',
    city: 'San Salvador',
    screens: 4,
    hasVIP: true,
    hasIMAX: false,
  },
];
