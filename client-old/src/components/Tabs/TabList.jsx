'use client';

import { List } from '@radix-ui/react-tabs';
import { forwardRef } from 'react';

import { cn } from '@/utils/functions/cn';

const TabsList = forwardRef(({ className, ...props }, ref) => (
  <List
    ref={ref}
    className={cn(
      'bg group inline-flex h-10 w-full items-center justify-center rounded-md py-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export default TabsList;
