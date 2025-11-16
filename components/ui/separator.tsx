'use client';

import * as React from 'react';
import { Divider, type DividerProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
  HTMLDivElement,
  DividerProps & { className?: string; orientation?: 'horizontal' | 'vertical' }
>(
  (
    { className, orientation = 'horizontal', ...props },
    ref,
  ) => (
    <Divider
      ref={ref}
      orientation={orientation}
      className={cn(className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Separator';

export { Separator };
