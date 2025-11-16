'use client';

import * as React from 'react';
import { Progress as MantineProgress, type ProgressProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  HTMLDivElement,
  ProgressProps & { className?: string }
>(({ className, value, ...props }, ref) => (
  <MantineProgress
    ref={ref}
    className={cn(className)}
    value={value}
    {...props}
  />
));
Progress.displayName = 'Progress';

export { Progress };
