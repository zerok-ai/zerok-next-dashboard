import { Button } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi";

import styles from "./AddNewBtn.module.scss";

interface AddNewBtnProps {
  text: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
}

const AddNewBtn = ({
  text,
  onClick,
  variant = "contained",
  size = "medium",
}: AddNewBtnProps) => {
  return (
    <Button
      key="add-btn"
      variant={variant}
      className={styles["add-btn"]}
      onClick={onClick}
      size={size}
    >
      <HiOutlinePlus /> {text}
    </Button>
  );
};

export default AddNewBtn;
