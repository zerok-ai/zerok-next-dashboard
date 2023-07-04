import { Dialog, DialogActions, DialogContentText } from "@mui/material";
import styles from "./DialogX.module.scss";
import { DialogTitle } from "@mui/material";
import { Button } from "@mui/material";

interface DialogXProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const DialogX = ({
  title,
  onSuccess,
  onCancel,
  isOpen,
  onClose,
  children,
}: DialogXProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={styles["dialog-container"]}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText className={styles["dialog-content"]}>
        {children}
      </DialogContentText>
      <DialogActions className={styles["dialog-actions"]}>
        <Button color="primary" onClick={onSuccess} variant="contained">
          Delete
        </Button>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogX;
