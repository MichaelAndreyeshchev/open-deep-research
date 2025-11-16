'use client';

import * as React from 'react';
import { Tooltip as MantineTooltip } from '@mantine/core';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children, delayDuration }: { children: React.ReactNode; delayDuration?: number }) => <>{children}</>;

const Tooltip = ({ children, open }: { children: React.ReactNode; open?: boolean }) => {
  let label: React.ReactNode = null;
  let trigger: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as any)?.displayName === 'TooltipContent') {
        label = child.props.children;
      } else if ((child.type as any)?.displayName === 'TooltipTrigger') {
        trigger = child.props.children;
      }
    }
  });

  if (!label || !trigger) {
    return <>{children}</>;
  }

  return (
    <MantineTooltip label={label} opened={open}>
      {trigger}
    </MantineTooltip>
  );
};

const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = ({ className, children, side, sideOffset, align, ...props }: { className?: string; children: React.ReactNode; align?: string; side?: string; sideOffset?: number; [key: string]: any }) => (
  <>{children}</>
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
