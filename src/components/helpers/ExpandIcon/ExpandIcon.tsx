import { IconButton } from "@mui/material";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { HiOutlineArrowsPointingIn } from "react-icons/hi2";

import styles from "./ExpandIcon.module.scss";

interface ExpandIconProps {
  isExpanded: boolean;
  toggleExpansion: () => void;
}

const ExpandIcon = ({ isExpanded, toggleExpansion }: ExpandIconProps) => {
  return (
    <IconButton
      size="small"
      className={isExpanded ? styles["expanded-btn"] : styles["expand-btn"]}
      onClick={toggleExpansion}
    >
      {isExpanded ? (
        <HiOutlineArrowsPointingIn className={styles["expand-icon"]} />
      ) : (
        <HiOutlineArrowsExpand className={styles["expand-icon"]} />
      )}
    </IconButton>
  );
};

export default ExpandIcon;
