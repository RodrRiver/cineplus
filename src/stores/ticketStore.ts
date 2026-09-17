import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedTicket {
  confirmationCode: string;
  movieTitle: string;
  posterPath: string | null;
  locationName: string;
  date: string;
  time: string;
  format: string;
  screen: number;
  seats: string[];
  snacks: Array<{ name: string; qty: number }>;
  total: number;
  purchasedAt: string;
}

interface TicketState {
  tickets: SavedTicket[];
  addTicket: (ticket: SavedTicket) => void;
  removeTicket: (confirmationCode: string) => void;
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: [],

      addTicket: (ticket) => {
        const { tickets } = get();
        if (tickets.some((t) => t.confirmationCode === ticket.confirmationCode)) return;
        set({ tickets: [ticket, ...tickets] });
      },

      removeTicket: (confirmationCode) => {
        set({ tickets: get().tickets.filter((t) => t.confirmationCode !== confirmationCode) });
      },
    }),
    {
      name: 'cineplus-tickets',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
