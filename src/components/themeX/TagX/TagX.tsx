import { HiOutlineXMark } from "react-icons/hi2";

import styles from "./TagX.module.scss";

interface TagXProps {
  label: string;
  onClose: (label: string) => void;
  closable: boolean;
}

const TagX = ({ label, onClose, closable }: TagXProps) => {
  return (
    <span
      className={styles.container}
      role="button"
      onClick={() => {
        onClose(label);
      }}
    >
      {label}
      {closable && <HiOutlineXMark className={styles["close-icon"]} />}
    </span>
  );
};

export default TagX;
