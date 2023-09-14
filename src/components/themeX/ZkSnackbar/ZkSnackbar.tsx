import { Snackbar } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { hideSnackbar, snackbarSelector } from "redux/snackbar";
import { dispatch } from "redux/store";
import { ICON_BASE_PATH } from "utils/images";

import styles from "./ZkSnackbar.module.scss";

const SNACKBAR_DURATION = 3000;

const ZkSnackbar = () => {
  const { open, key, type, message } = useSelector(snackbarSelector);
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        dispatch(hideSnackbar());
      }, SNACKBAR_DURATION);
    }
  }, [open]);
  const SnackContent = () => {
    if (!type) return null;
    const image = `${ICON_BASE_PATH}/snack_${type}.svg`;
    return (
      <div className={styles.message}>
        <img src={image} alt="snackbar" />
        <p>{message}</p>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <Snackbar
        open={open}
        autoHideDuration={SNACKBAR_DURATION}
        message={<SnackContent />}
        key={key}
        className={styles.snackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ position: "absolute" }}
      />
    </div>
  );
};

export default ZkSnackbar;
