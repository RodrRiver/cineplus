import type { SeatType } from '../types/cinema';

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

export function getSeatLayout(format: 'Estándar' | 'VIP' | 'IMAX'): {
  rows: number;
  cols: number;
  layout: SeatType[][];
} {
  switch (format) {
    case 'Estándar': {
      const rows = 10;
      const cols = 14;
      const layout: SeatType[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: SeatType[] = [];
        for (let c = 0; c < cols; c++) {
          if (c === 3 || c === 10) {
            row.push('none');
          } else if (r === 0 && (c === 0 || c === 1)) {
            row.push('disabled');
          } else {
            row.push('standard');
          }
        }
        layout.push(row);
      }
      return { rows, cols, layout };
    }
    case 'VIP': {
      const rows = 6;
      const cols = 10;
      const layout: SeatType[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: SeatType[] = [];
        for (let c = 0; c < cols; c++) {
          if (c === 5) {
            row.push('none');
          } else {
            row.push('vip');
          }
        }
        layout.push(row);
      }
      return { rows, cols, layout };
    }
    case 'IMAX': {
      const rows = 12;
      const cols = 16;
      const layout: SeatType[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: SeatType[] = [];
        for (let c = 0; c < cols; c++) {
          if (c === 4 || c === 12) {
            row.push('none');
          } else {
            row.push('standard');
          }
        }
        layout.push(row);
      }
      return { rows, cols, layout };
    }
  }
}

export function generateTakenSeats(showtimeId: string, layout: SeatType[][]): Set<string> {
  const seed = hashString(showtimeId);
  const rng = seedRandom(seed);
  const taken = new Set<string>();

  const validSeats: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
      if (layout[r][c] !== 'none') {
        validSeats.push({ row: r, col: c });
      }
    }
  }

  const targetPercent = 0.2 + rng() * 0.3;
  const targetCount = Math.floor(validSeats.length * targetPercent);

  while (taken.size < targetCount) {
    const startIdx = Math.floor(rng() * validSeats.length);
    const startSeat = validSeats[startIdx];
    const clusterSize = 1 + Math.floor(rng() * 4);

    for (let i = 0; i < clusterSize; i++) {
      const col = startSeat.col + i;
      if (col >= layout[startSeat.row].length) break;
      if (layout[startSeat.row][col] === 'none') break;
      const rowLetter = String.fromCharCode(65 + startSeat.row);
      taken.add(`${rowLetter}${col + 1}`);
      if (taken.size >= targetCount) break;
    }
  }

  return taken;
}
