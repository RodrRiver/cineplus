import { Link } from 'react-router-dom';
import { Film, Globe, Mail, MessageCircle } from 'lucide-react';

const quickLinks = [
  { to: '/movies', label: 'Cartelera' },
  { to: '/coming-soon', label: 'Próximamente' },
  { to: '/', label: 'Sucursales' },
];

const socialLinks = [
  { icon: Globe, label: 'Sitio web', href: '#' },
  { icon: MessageCircle, label: 'Redes sociales', href: '#' },
  { icon: Mail, label: 'Correo', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-surface-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Film className="text-gold-400" size={24} />
              <span className="font-heading text-xl font-bold text-gold-400">
                CinePlus
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              La mejor experiencia cinematográfica. Disfruta de las
              últimas películas en la más alta calidad.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">
              Síguenos
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-text-secondary hover:bg-gold-400/20 hover:text-gold-400 transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-surface-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2026 CinePlus. Todos los derechos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Datos de películas proporcionados por TMDB
          </p>
        </div>
      </div>
    </footer>
  );
}
