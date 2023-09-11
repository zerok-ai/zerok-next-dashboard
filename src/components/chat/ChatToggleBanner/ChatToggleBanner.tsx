import { Fragment } from "react";
import { HiX } from "react-icons/hi";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ChatToggleBanner.module.scss";

interface ChatToggleBannerProps {
  minimized: boolean;
  toggleMinimize: () => void;
}

const ChatToggleBanner = ({
  minimized,
  toggleMinimize,
}: ChatToggleBannerProps) => {
  return (
    <div className={styles.container} role={"button"}>
      <div className={styles["chat-icon"]}>
        <img src={`${ICON_BASE_PATH}/${ICONS["ai-magic"]}`} alt="chat-icon" />
      </div>
      {!minimized && (
        <Fragment>
          <h5>Issue Synthesis</h5>
          <HiX
            className={styles["close-icon"]}
            role="button"
            onClick={toggleMinimize}
          />
        </Fragment>
      )}
    </div>
  );
};

export default ChatToggleBanner;