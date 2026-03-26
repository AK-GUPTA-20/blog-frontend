import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-outline-variant/60 bg-surface-container/80 px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30',
        className
      )}
      {...props}
    />
  );
});
