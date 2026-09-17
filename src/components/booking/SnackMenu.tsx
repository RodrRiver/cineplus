import { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { SNACKS } from '../../data/snacks';
import { useBookingStore } from '../../stores/bookingStore';

interface SnackMenuProps {
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  { key: 'popcorn' as const, label: 'Palomitas' },
  { key: 'drinks' as const, label: 'Bebidas' },
  { key: 'candy' as const, label: 'Dulces' },
  { key: 'combos' as const, label: 'Combos' },
];

export default function SnackMenu({ onNext, onBack }: SnackMenuProps) {
  const snacks = useBookingStore((s) => s.snacks);
  const addSnack = useBookingStore((s) => s.addSnack);
  const removeSnack = useBookingStore((s) => s.removeSnack);

  const [activeCategory, setActiveCategory] = useState<string>('popcorn');

  const filteredSnacks = useMemo(
    () => SNACKS.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  const totalItems = useMemo(
    () => Object.values(snacks).reduce((sum, qty) => sum + qty, 0),
    [snacks]
  );

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
        Snacks y bebidas
      </h2>
      <p className="text-text-secondary mb-6">
        Complementa tu experiencia con algo delicioso
      </p>

      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-surface-700">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 px-4 py-3 text-sm font-medium transition-all duration-200 relative cursor-pointer ${
              activeCategory === cat.key
                ? 'text-gold-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.label}
            {activeCategory === cat.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredSnacks.map((snack) => {
          const qty = snacks[snack.id] || 0;

          return (
            <div
              key={snack.id}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                qty > 0
                  ? 'bg-surface-700 border-gold-400/30 shadow-lg shadow-gold-400/5'
                  : 'bg-surface-700 border-surface-600'
              }`}
            >
              <div className="text-4xl mb-3">{snack.image}</div>
              <h3 className="font-heading font-semibold text-text-primary mb-1">
                {snack.name}
              </h3>
              <p className="text-sm text-text-muted mb-3">{snack.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gold-400">
                  ${snack.price.toFixed(2)}
                </span>

                <div className="flex items-center gap-2">
                  {qty > 0 && (
                    <button
                      onClick={() => removeSnack(snack.id)}
                      className="w-8 h-8 rounded-lg bg-surface-600 hover:bg-surface-500 text-text-primary flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}

                  {qty > 0 && (
                    <span className="w-6 text-center font-semibold text-text-primary">
                      {qty}
                    </span>
                  )}

                  <button
                    onClick={() => addSnack(snack.id)}
                    className="w-8 h-8 rounded-lg bg-gold-400 hover:bg-gold-500 text-surface-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onNext}>
            Saltar
          </Button>
          <Button onClick={onNext}>
            Continuar{totalItems > 0 ? ` (${totalItems} items)` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
