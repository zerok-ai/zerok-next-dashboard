import { CircularProgress } from "@mui/material";

import styles from "./ZkSpinner.module.scss";

const ZkSpinner = () => {
  return <CircularProgress className={styles.spinner} />;
};

export default ZkSpinner;
