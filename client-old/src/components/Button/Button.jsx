/* eslint-disable prettier/prettier */
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/utils/functions/cn';

const btnCVA = cva(
  `inline-flex items-center rounded-4xl no-outline truncate disabled:opacity-60 disabled:cursor-default disabled:bg-neutral-500 disable:text-neutral-800 transition-all ease-in-out duration-300 border-2 border-solid border-accent-1000 pointer-events-control`,
  {
    variants: {
      style: {
        normal: '',
        icon: 'gap-x-2',
      },
      variant: {
        primary:
          'bg-primary-400 text-accent-1000 font-medium [&:not(:disabled)]:hover:bg-primary-500 [&:not(:disabled)]:active:bg-primary-600',
        'accent-outline':
          'bg-transparent border-[3px] border-solid text-accent-1000 font-medium border-accent-1000 hover:border-accent-900 active:border-accent-800 active:bg-accent-200',
        secondary:
          'bg-secondary-300 text-accent-1000 font-medium [&:not(:disabled)]:hover:bg-secondary-400/50 [&:not(:disabled)]:active:bg-secondary-400/40',
        'secondary-light':
          'bg-secondary-100 text-accent-1000 font-medium [&:not(:disabled)]:hover:bg-secondary-200 [&:not(:disabled)]:active:bg-secondary-300',
        disabled: 'bg-neutral-500 text-neutral-800 cursor-not-allowed opacity-90',
        transparent: 'bg-transparent text-white border-transparent',
      },
      size: {
        default: 'h-[44px] py-[10px] px-7',
        full: 'h-[44px] py-[10px] px-7 w-full max-w-[100cqw]',
        fit: 'size-fit py-[10px] px-7',
      },
      icon: {
        true: '!p-0 justify-between gap-x-2 shadow-drop',
        false: 'justify-center',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default', icon: false },
  }
);

//TODO: Hay un iconLeft. Pero no hay soporte para iconRight
const Button = forwardRef(function Button(
  { className, variant, size, asChild = false, children, iconLeft, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(btnCVA({ variant, size, className, icon: !!iconLeft }))}
      ref={ref}
      {...props}>
      {iconLeft ? (
        <div className="rounded-4xl border-2 border-r-0 border-solid border-accent-1000 bg-accent-100 px-4 py-[10px]">
          <img src={iconLeft} width={24} height={24} />
        </div>
      ) : (
        ''
      )}
      {iconLeft ? (
        <div className="grow rounded-4xl border-2 border-l-0 border-solid border-accent-1000 bg-accent-100 px-4 py-[10px]">
          {children}
        </div>
      ) : (
        children
      )}
    </Comp>
  );
});

export default Button;
