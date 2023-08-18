import { IconButton } from "@mui/material";
import cx from "classnames";
import { HiOutlineMap } from "react-icons/hi2";

import styles from "./MapToggle.module.scss";

interface MapToggleProps {
  active: boolean;
  onChange: () => void;
}

const MapToggle = ({ active, onChange }: MapToggleProps) => {
  return (
    <IconButton
      className={cx(styles.container, active && styles.active)}
      onClick={onChange}
    >
      <HiOutlineMap />
    </IconButton>
  );
};

export default MapToggle;
