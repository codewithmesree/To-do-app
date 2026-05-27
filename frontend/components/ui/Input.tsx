import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
