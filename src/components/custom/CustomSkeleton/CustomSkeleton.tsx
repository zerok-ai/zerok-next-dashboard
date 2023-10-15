import { Skeleton } from "@mui/material";
import { nanoid } from "nanoid";

interface CustomSkeletonProps {
  containerClass?: string;
  skeletonClass?: string;
  len: number;
}

const CustomSkeleton = ({
  containerClass,
  skeletonClass,
  len,
}: CustomSkeletonProps) => {
  const skeletonArray = Array(len).fill("zerok");
  return (
    <div className={containerClass}>
      {skeletonArray.map((sk) => {
        return (
          <Skeleton key={nanoid()} className={skeletonClass} height={40} />
        );
      })}
    </div>
  );
};

export default CustomSkeleton;
