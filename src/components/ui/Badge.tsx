import type { ReactNode } from 'react';

type BadgeVariant = 'gold' | 'purple' | 'blue' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-400/20 text-gold-400 border border-gold-400/30',
  purple: 'bg-vip-purple/20 text-vip-purple border border-vip-purple/30',
  blue: 'bg-imax-blue/20 text-imax-blue border border-imax-blue/30',
  default: 'bg-surface-600/60 text-text-secondary border border-surface-500/30',
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
