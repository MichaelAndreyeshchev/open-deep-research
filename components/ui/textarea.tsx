import * as React from 'react';
import { Textarea as MantineTextarea, type TextareaProps } from '@mantine/core';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <MantineTextarea
      ref={ref}
      className={cn(className)}
      minRows={3}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
