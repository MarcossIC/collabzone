'use client';

import { Content } from '@radix-ui/react-tabs';
import { forwardRef } from 'react';

import { cn } from '@/utils/functions/cn';

const TabsContent = forwardRef(({ className, ...props }, ref) => (
  <Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export default TabsContent;
