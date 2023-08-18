import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { IconButton } from "@mui/material";
import cx from "classnames";
import { useState } from "react";

import styles from "./VisibilityToggleButton.module.scss";

interface VisibilityToggleProps {
  name: string;
  onChange: (isVisible: boolean) => void;
  isVisibleDefault?: boolean;
  customClassName?: string;
}

const VisibilityToggleButton = ({
  name,
  customClassName,
  onChange,
  isVisibleDefault = false,
}: VisibilityToggleProps) => {
  const [isVisible, setIsVisible] = useState(isVisibleDefault);
  const toggleVisibility = () => {
    setIsVisible((old) => {
      onChange(!old);
      return !old;
    });
  };
  return (
    <IconButton
      aria-label={`toggle ${name} visibility`}
      edge="end"
      color="secondary"
      onClick={toggleVisibility}
      className={cx(customClassName, styles.container)}
    >
      {isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
    </IconButton>
  );
};

export default VisibilityToggleButton;
