'use client';

import * as React from 'react';
import { Menu } from '@mantine/core';
import { cn } from '@/lib/utils';

const DropdownMenu = ({ children, ...props }: any) => <Menu {...props}>{children}</Menu>;

const DropdownMenuTrigger = Menu.Target;

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuSubTrigger = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const DropdownMenuSubContent = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
);

const DropdownMenuContent = Menu.Dropdown;

const DropdownMenuItem = Menu.Item;

const DropdownMenuCheckboxItem = ({ children, className, checked }: { children?: React.ReactNode; className?: string; checked?: boolean }) => (
  <Menu.Item className={cn(className)}>{children}</Menu.Item>
);

const DropdownMenuRadioItem = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <Menu.Item className={cn(className)}>{children}</Menu.Item>
);

const DropdownMenuLabel = Menu.Label;

const DropdownMenuSeparator = Menu.Divider;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
