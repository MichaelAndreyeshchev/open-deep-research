'use client';

import * as React from 'react';
import { Select as MantineSelect, type SelectProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const Select = ({ children, ...props }: any) => {
  return <MantineSelect {...props} />;
};

const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const SelectValue = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const SelectTrigger = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const SelectScrollUpButton = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const SelectScrollDownButton = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const SelectContent = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const SelectLabel = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const SelectItem = ({ children, className, value }: { children?: React.ReactNode; className?: string; value?: string }) => (
  <div className={cn(className)} data-value={value}>{children}</div>
);

const SelectSeparator = ({ className }: { className?: string }) => (
  <div className={cn(className)} />
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
