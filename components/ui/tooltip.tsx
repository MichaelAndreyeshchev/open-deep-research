'use client';

import * as React from 'react';
import { Tooltip as MantineTooltip, type TooltipProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = MantineTooltip;

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
));
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
