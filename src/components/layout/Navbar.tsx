import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Film, Ticket } from 'lucide-react';
import { useTicketStore } from '../../stores/ticketStore';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/movies', label: 'Cartelera' },
  { to: '/coming-soon', label: 'Próximamente' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticketCount = useTicketStore((s) => s.tickets.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-800/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Film className="text-gold-400 group-hover:text-gold-300 transition-colors" size={28} />
          <span className="font-heading text-2xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors">
            CinePlus
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors py-1 ${
                  isActive
                    ? 'text-gold-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-400 after:rounded-full'
                    : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/my-tickets"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 text-sm font-medium transition-colors py-1 ${
                isActive
                  ? 'text-gold-400'
                  : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <Ticket size={16} />
            Mis Boletos
            {ticketCount > 0 && (
              <span className="bg-gold-400 text-surface-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {ticketCount}
              </span>
            )}
          </NavLink>
        </div>

        <button
          type="button"
          className="md:hidden text-text-primary p-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-surface-800 shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-surface-600">
            <span className="font-heading text-lg font-bold text-gold-400">
              CinePlus
            </span>
            <button
              type="button"
              className="text-text-primary p-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-400/10 text-gold-400'
                      : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/my-tickets"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-gold-400/10 text-gold-400'
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`
              }
            >
              <Ticket size={18} />
              Mis Boletos
              {ticketCount > 0 && (
                <span className="bg-gold-400 text-surface-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {ticketCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
