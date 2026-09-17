import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CinemaLocation, Showtime, Seat } from '../types/cinema';
import { SNACKS } from '../data/snacks';

interface BookingMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface BookingState {
  currentStep: number;
  movie: BookingMovie | null;
  location: CinemaLocation | null;
  showtime: Showtime | null;
  selectedSeats: Seat[];
  snacks: Record<string, number>;
  confirmationCode: string | null;
  setMovie: (movie: BookingMovie) => void;
  setLocation: (location: CinemaLocation) => void;
  setShowtime: (showtime: Showtime) => void;
  toggleSeat: (seat: Seat) => void;
  addSnack: (snackId: string) => void;
  removeSnack: (snackId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  generateConfirmation: () => void;
  ticketSubtotal: () => number;
  snackSubtotal: () => number;
  total: () => number;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      movie: null,
      location: null,
      showtime: null,
      selectedSeats: [],
      snacks: {},
      confirmationCode: null,

      setMovie: (movie) => set({ movie }),

      setLocation: (location) => set({ location }),

      setShowtime: (showtime) => set({ showtime }),

      toggleSeat: (seat) => {
        const { selectedSeats } = get();
        const exists = selectedSeats.find((s) => s.id === seat.id);
        if (exists) {
          set({ selectedSeats: selectedSeats.filter((s) => s.id !== seat.id) });
        } else if (selectedSeats.length < 6) {
          set({ selectedSeats: [...selectedSeats, seat] });
        }
      },

      addSnack: (snackId) => {
        const { snacks } = get();
        set({ snacks: { ...snacks, [snackId]: (snacks[snackId] || 0) + 1 } });
      },

      removeSnack: (snackId) => {
        const { snacks } = get();
        const current = snacks[snackId] || 0;
        if (current <= 1) {
          const updated = { ...snacks };
          delete updated[snackId];
          set({ snacks: updated });
        } else {
          set({ snacks: { ...snacks, [snackId]: current - 1 } });
        }
      },

      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),

      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      reset: () =>
        set({
          currentStep: 1,
          movie: null,
          location: null,
          showtime: null,
          selectedSeats: [],
          snacks: {},
          confirmationCode: null,
        }),

      generateConfirmation: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CP-';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        set({ confirmationCode: code });
      },

      ticketSubtotal: () => {
        const { selectedSeats, showtime } = get();
        return selectedSeats.length * (showtime?.price || 0);
      },

      snackSubtotal: () => {
        const { snacks } = get();
        return Object.entries(snacks).reduce((sum, [snackId, qty]) => {
          const item = SNACKS.find((s) => s.id === snackId);
          return sum + (item?.price || 0) * qty;
        }, 0);
      },

      total: () => {
        return get().ticketSubtotal() + get().snackSubtotal();
      },
    }),
    {
      name: 'cineplus-booking',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
