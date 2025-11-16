'use client';

import * as React from 'react';
import { Tooltip as MantineTooltip } from '@mantine/core';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = ({ children }: { children: React.ReactNode }) => {
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
    <MantineTooltip label={label}>
      {trigger}
    </MantineTooltip>
  );
};

const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = ({ className, children, ...props }: { className?: string; children: React.ReactNode; align?: string }) => (
  <>{children}</>
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
