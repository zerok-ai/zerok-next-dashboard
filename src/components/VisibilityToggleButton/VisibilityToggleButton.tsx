import styles from "./VisibilityToggleButton.module.scss";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { IconButton } from "@mui/material";

interface VisibilityToggleProps {
  name: string;
  onChange: (isVisible: boolean) => void;
  isVisibleDefault?: boolean;
}

const VisibilityToggleButton = ({
  name,
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
    >
      {isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
    </IconButton>
  );
};

export default VisibilityToggleButton;
