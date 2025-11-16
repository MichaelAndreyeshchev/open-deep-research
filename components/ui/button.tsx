import * as React from 'react';
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import { cn } from '@/lib/utils';

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  [key: string]: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const mantineVariant = 
      variant === 'default' ? 'filled' :
      variant === 'destructive' ? 'filled' :
      variant === 'outline' ? 'outline' :
      variant === 'secondary' ? 'light' :
      variant === 'ghost' ? 'subtle' :
      variant === 'link' ? 'transparent' :
      'filled';

    const mantineSize = 
      size === 'default' ? 'md' :
      size === 'sm' ? 'sm' :
      size === 'lg' ? 'lg' :
      size === 'icon' ? 'md' :
      'md';

    const mantineColor = variant === 'destructive' ? 'red' : undefined;

    return (
      <MantineButton
        ref={ref}
        variant={mantineVariant}
        size={mantineSize}
        color={mantineColor}
        className={cn(className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
