import * as React from 'react';
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<MantineButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, type, ...props }, ref) => {
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
        type={type}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
