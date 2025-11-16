import * as React from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
