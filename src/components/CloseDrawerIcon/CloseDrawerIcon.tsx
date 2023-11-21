import cx from "classnames";
import { HiOutlineX } from "react-icons/hi";

import styles from "./CloseDrawerIcon.module.scss";

interface CloseDrawerIconProps {
  onClick: () => void;
  customClassName?: string;
}

const CloseDrawerIcon = ({
  onClick,
  customClassName,
}: CloseDrawerIconProps) => {
  return (
    <span
      className={cx(styles["close-button"], customClassName)}
      onClick={onClick}
      role="button"
    >
      <HiOutlineX className={styles["close-icon"]} />
    </span>
  );
};

export default CloseDrawerIcon;
