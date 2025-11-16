import { Skeleton as MantineSkeleton, type SkeletonProps } from '@mantine/core';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: SkeletonProps & { className?: string }) {
  return (
    <MantineSkeleton
      className={cn(className)}
      {...props}
    />
  );
}

export { Skeleton };
