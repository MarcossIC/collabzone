'use client';

import { cn } from '@/utils/functions/cn';
import { Trigger } from '@radix-ui/react-tabs';
import { forwardRef } from 'react';

const TabsTrigger = forwardRef(({ className, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      'inline-flex grow items-center justify-center whitespace-nowrap border-b border-neutral-400 px-3 py-1.5 text-base font-medium text-neutral-400 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:grow-[0.25] data-[state=active]:border-accent-1000 data-[state=active]:text-accent-1000',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export default TabsTrigger;
