import styles from "./ChatEventCard.module.scss";

interface ChatEventCardProps {
  render?: () => React.ReactElement;
  text?: string;
}

const ChatEventCard = ({ text, render }: ChatEventCardProps) => {
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
    </div>
  );
};

export default ChatEventCard;
