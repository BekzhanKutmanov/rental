import { Skeleton as MuiSkeleton } from '@mui/material';
import type { SkeletonProps as MuiSkeletonProps } from '@mui/material/Skeleton';

type SkeletonProps = {
  count?: number;
  length: MuiSkeletonProps['width'];
  height: MuiSkeletonProps['height'];
  variant?: MuiSkeletonProps['variant'];
  className?: string;
};

const MySkeleton = ({
  count = 1,
  length,
  height,
  variant = 'rectangular',
  className,
}: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <MuiSkeleton
          key={index}
          className={className}
          variant={variant}
          width={length}
          height={height}
        />
      ))}
    </>
  );
};

export default MySkeleton;
export type { SkeletonProps };
