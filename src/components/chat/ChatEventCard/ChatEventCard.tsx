import { Skeleton } from "@mui/material";

import styles from "./ChatEventCard.module.scss";

interface ChatEventCardProps {
  render?: () => React.ReactElement;
  text?: string;
  loading?: boolean;
}

const ChatEventCard = ({
  text,
  render,
  loading = false,
}: ChatEventCardProps) => {
  return (
    <div className={styles["chat-event-card"]}>
      <div className={styles["chat-event-icon"]}>
        <img
          src={`/images/vectors/ai-user-avatar.svg`}
          alt={`user-avatar-icon`}
        />
      </div>
      {text && <p className={styles["chat-event-text"]}>{text}</p>}
      {render && render()}
      {loading && <Skeleton variant="rectangular" width={"100%"} height={20} />}
    </div>
  );
};

export default ChatEventCard;
