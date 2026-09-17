import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

export default function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen text-center py-20">
      <Film className="text-gold-400/30 mb-6" size={80} />
      <h1 className="font-heading text-6xl font-bold text-text-primary mb-4">
        404
      </h1>
      <p className="text-xl text-text-secondary mb-2">
        P&aacute;gina no encontrada
      </p>
      <p className="text-text-muted mb-8">
        La p&aacute;gina que buscas no existe o fue movida.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg">
        Volver al inicio
      </Button>
    </Container>
  );
}
