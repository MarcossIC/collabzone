import { cn } from '@/utils/functions/cn';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

const formFieldCVA = cva(
  'autofill-removed no-outline shadow-inset-small border-neutral-1000 relative mt-px h-11 w-full rounded-4xl border-2 border-solid bg-white px-4 text-sm text-black transition-all duration-300 ease-in-out placeholder:text-neutral-800 focus:border-neutral-700',
  {
    variants: {
      password: {
        true: 'pr-10',
        false: '',
      },
      defaultVariants: { password: false },
    },
  }
);

export const FormInput = forwardRef(function FormInput(
  { className = '', type = 'text', password, ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      className={cn(
        formFieldCVA({
          password,
        }),
        className
      )}
    />
  );
});
