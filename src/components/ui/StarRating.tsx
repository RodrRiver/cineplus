import { Star } from 'lucide-react';

type StarSize = 'sm' | 'md';

interface StarRatingProps {
  rating: number;
  size?: StarSize;
}

const sizeMap: Record<StarSize, number> = {
  sm: 14,
  md: 18,
};

export default function StarRating({ rating, size = 'md' }: StarRatingProps) {
  const stars = Math.round((rating / 10) * 5 * 2) / 2;
  const iconSize = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = stars >= i + 1;
        const half = !filled && stars >= i + 0.5;

        return (
          <span key={i} className="relative">
            <Star
              size={iconSize}
              className="text-surface-500"
              strokeWidth={1.5}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star
                  size={iconSize}
                  className="text-gold-400 fill-gold-400"
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        );
      })}
      <span className={`ml-1 text-text-secondary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
