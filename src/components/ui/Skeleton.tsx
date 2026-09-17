type SkeletonVariant = 'text' | 'card' | 'poster';

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-xl',
  poster: 'h-80 w-52 rounded-xl',
};

export default function Skeleton({
  className = '',
  variant = 'text',
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-600/50 ${variantClasses[variant]} ${className}`}
    />
  );
}
