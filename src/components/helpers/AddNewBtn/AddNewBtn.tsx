import { LoadingButton } from "@mui/lab";
import { HiOutlinePlus } from "react-icons/hi";

import styles from "./AddNewBtn.module.scss";

interface AddNewBtnProps {
  text: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

const AddNewBtn = ({
  text,
  onClick,
  variant = "contained",
  size = "medium",
  loading = false,
}: AddNewBtnProps) => {
  return (
    <LoadingButton
      key="add-btn"
      variant={variant}
      className={styles["add-btn"]}
      onClick={onClick}
      size={size}
      loading={loading}
    >
      <HiOutlinePlus /> {text}
    </LoadingButton>
  );
};

export default AddNewBtn;
