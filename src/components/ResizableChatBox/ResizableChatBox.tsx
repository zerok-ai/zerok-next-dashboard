import { Resizable } from "re-resizable";

import styles from "./ResizableChatBox.module.scss";

interface ResizableChatBoxProps {
  children: React.ReactNode;
  width: number;
  updateWidth: (width: number) => void;
  minimized: boolean;
}

const ResizableChatBox = ({
  children,
  width,
  updateWidth,
  minimized,
}: ResizableChatBoxProps) => {
  return (
    <Resizable
      defaultSize={{
        width,
        height: "100%",
      }}
      size={{
        width,
        height: "100%",
      }}
      minWidth={minimized ? "64px" : "400px"}
      maxWidth={"1200px"}
      enable={{
        top: false,
        right: !minimized,
        bottom: false,
        left: false,
      }}
      onResizeStop={(e, direction, ref, d) => {
        updateWidth(width + d.width);
      }}
      className={styles.resizable}
    >
      {children}
    </Resizable>
  );
};

export default ResizableChatBox;
