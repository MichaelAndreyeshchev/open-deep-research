'use client';

import * as React from 'react';
import { Modal } from '@mantine/core';
import { cn } from '@/lib/utils';

const AlertDialog = ({ children, ...props }: any) => <Modal {...props}>{children}</Modal>;

const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const AlertDialogOverlay = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const AlertDialogContent = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn('text-lg font-semibold', className)}>{children}</div>
);

const AlertDialogDescription = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn('text-sm text-muted-foreground', className)}>{children}</div>
);

const AlertDialogAction = ({ children, className, ...props }: any) => (
  <button className={cn(className)} {...props}>{children}</button>
);

const AlertDialogCancel = ({ children, className, ...props }: any) => (
  <button className={cn(className)} {...props}>{children}</button>
);

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
