import { ModalProps } from "@mui/base";
import styles from "./ModalX.module.scss";

import cx from "classnames";
import { Modal } from "@mui/material";
import { IconButton } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

interface ModalXProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  customClassName?: string;
  keepMounted?: boolean;
}

const ModalX = ({
  isOpen,
  onClose,
  title,
  children,
  customClassName = "",
  keepMounted = false,
}: ModalXProps) => {
  return (
    <Modal
      open={isOpen}
      keepMounted={keepMounted}
      className={cx(customClassName, styles["modal"])}
      onClose={onClose}
    >
      <div className={styles["container"]}>
        <div className={styles["modal-header"]}>
          <h5>{title}</h5>
          <IconButton className={styles["modal-close-icon"]} onClick={onClose}>
            <AiOutlineClose />
          </IconButton>
        </div>
        <div className={styles["modal-content"]}>{children}</div>
      </div>
    </Modal>
  );
};

export default ModalX;
