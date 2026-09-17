import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button';
  };

type AsLink = ButtonBaseProps &
  Omit<LinkProps, keyof ButtonBaseProps> & {
    as: typeof Link;
  };

export type ButtonProps = AsButton | AsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold-400 text-surface-900 hover:bg-gold-500 active:bg-gold-600 disabled:bg-gold-400/40 disabled:cursor-not-allowed font-semibold',
  secondary:
    'border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 active:bg-gold-400/20 disabled:border-gold-400/40 disabled:text-gold-400/40 disabled:cursor-not-allowed',
  ghost:
    'text-gold-400 hover:text-gold-300 hover:bg-gold-400/10 active:bg-gold-400/20 disabled:text-gold-400/40 disabled:cursor-not-allowed',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      ...rest
    } = props;

    const classes = `inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if ('as' in rest && rest.as === Link) {
      const { as: _as, ...linkRest } = rest as AsLink;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...linkRest}
        >
          {children}
        </Link>
      );
    }

    const { as: _as, ...buttonRest } = rest as AsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonRest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
