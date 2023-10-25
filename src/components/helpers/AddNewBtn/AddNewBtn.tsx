import { Button } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi";

import styles from "./AddNewBtn.module.scss";

interface AddNewBtnProps {
  text: string;
  onClick: () => void;
}

const AddNewBtn = ({ text, onClick }: AddNewBtnProps) => {
  return (
    <Button
      key="add-btn"
      variant="contained"
      className={styles["add-btn"]}
      onClick={onClick}
    >
      <HiOutlinePlus /> {text}
    </Button>
  );
};

export default AddNewBtn;
