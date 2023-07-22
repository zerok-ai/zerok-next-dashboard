import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./ChatBoxDisplay.module.scss";

interface ChatBoxDisplayProps {
  text: string;
}
const ChatBoxDisplay = ({ text }: ChatBoxDisplayProps) => {
  return (
    <div className={styles.container}>
      <div className={styles["logo-container"]}>
        <div className={styles["chatbox-logo"]}>
          <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
        </div>
      </div>
      <p className={styles["text-container"]}>{text}</p>
    </div>
  );
};

export default ChatBoxDisplay;
