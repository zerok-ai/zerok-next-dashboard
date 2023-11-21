import { IconButton } from "@mui/material";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { HiOutlineArrowsPointingIn } from "react-icons/hi2";

import styles from "./ExpanIconButton.module.scss";

interface ExpandIconButtonProps {
  expanded: boolean;
  onClick: () => void;
}

const ExpanIconButton = ({ expanded, onClick }: ExpandIconButtonProps) => {
  return (
    <IconButton
      size="small"
      className={expanded ? styles["expanded-btn"] : styles["expand-btn"]}
      onClick={onClick}
    >
      {expanded ? (
        <HiOutlineArrowsPointingIn className={styles["expand-icon"]} />
      ) : (
        <HiOutlineArrowsExpand className={styles["expand-icon"]} />
      )}
    </IconButton>
  );
};

export default ExpanIconButton;
