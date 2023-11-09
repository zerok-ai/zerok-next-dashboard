// import cssVars from "styles/variables.module.scss";
import { useZkFlag } from "hooks/useZkFlag";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./ChatDisabledCard.module.scss";

const ChatDisabledCard = () => {
  const text = useZkFlag("org", "gpt", "zkchat").disabledText;
  return (
    <div className={styles.container}>
      <figure className={styles["chatbox-logo"]}>
        <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
      </figure>
      <div className={styles.content}>
        <h5>Likely Cause</h5>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ChatDisabledCard;
