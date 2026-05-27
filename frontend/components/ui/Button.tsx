import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'px-6 py-2 bg-brand-primary text-white font-medium rounded-lg shadow-sm hover:bg-brand-primary-hover hover:shadow-md transition-all active:scale-[0.98]',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
