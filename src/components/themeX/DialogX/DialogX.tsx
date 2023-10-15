import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import styles from "./DialogX.module.scss";

interface DialogXProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  successText?: string;
  cancelText?: string;
  loading?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const DialogX = ({
  title,
  onSuccess,
  onCancel,
  isOpen,
  loading,
  onClose,
  children,
  successText = "Delete",
  cancelText = "Cancel",
}: DialogXProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.container}>
      <DialogTitle className={styles.title}>{title}</DialogTitle>
      <DialogContentText className={styles["dialog-content"]}>
        {children}
      </DialogContentText>
      <DialogActions className={styles["dialog-actions"]}>
        <LoadingButton
          color="primary"
          onClick={onSuccess}
          loading={loading}
          variant="contained"
        >
          {successText ?? "Delete"}
        </LoadingButton>
        <Button color="secondary" onClick={onCancel}>
          {cancelText ?? "Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogX;
