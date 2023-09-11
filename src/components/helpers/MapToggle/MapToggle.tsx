import { IconButton } from "@mui/material";
import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { HiOutlineMap } from "react-icons/hi2";

import styles from "./MapToggle.module.scss";

interface MapToggleProps {
  active: boolean;
  onChange: () => void;
  title: string;
}

const MapToggle = ({ active, onChange, title }: MapToggleProps) => {
  return (
    <TooltipX title={title}>
      <IconButton
        className={cx(styles.container, active && styles.active)}
        onClick={onChange}
      >
        <HiOutlineMap />
      </IconButton>
    </TooltipX>
  );
};

export default MapToggle;
