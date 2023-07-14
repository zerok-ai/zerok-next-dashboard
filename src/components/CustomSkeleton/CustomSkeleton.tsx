import { nanoid } from "nanoid";
import styles from "./CustomSkeleton.module.scss";
import { Skeleton } from "@mui/material";

interface CustomSkeletonProps {
  containerClass: string;
  skeletonClass: string;
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
        return <Skeleton key={nanoid()} className={skeletonClass} />;
      })}
    </div>
  );
};

export default CustomSkeleton;
