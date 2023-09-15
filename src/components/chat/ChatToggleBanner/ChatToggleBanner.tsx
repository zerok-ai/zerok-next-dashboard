import cx from "classnames";
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
    <div
      className={cx(styles.container, minimized && styles.minimized)}
      role={"button"}
    >
      <div className={styles["chat-icon"]}>
        <img src={`${ICON_BASE_PATH}/${ICONS["ai-magic"]}`} alt="chat-icon" />
        <h5>Issue Synthesis</h5>
      </div>
      {!minimized && (
        <Fragment>
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
