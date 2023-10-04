import { nanoid } from "nanoid";
import { Fragment } from "react";
import { CHAT_TAG_CHARACTER } from "utils/gpt/constants";

import styles from "./ChatTagCard.module.scss";

interface ChatEventCardProps {
  tag: string;
}

const ChatEventCard = ({ tag }: ChatEventCardProps) => {
  const words = tag.split(" ");
  return (
    <div className={styles["chat-event-card"]}>
      <div className={styles["chat-event-icon"]}>
        <img
          src={`/images/vectors/ai-user-avatar.svg`}
          alt={`user-avatar-icon`}
        />
      </div>
      <div className={styles["chat-text"]}>
        {words.length > 1 ? (
          words.map((w) => {
            if (w.includes(CHAT_TAG_CHARACTER)) {
              return (
                <span className={styles["chat-event-tag"]} key={nanoid()}>
                  {w}
                </span>
              );
            } else {
              return `${w} ${" "}`;
            }
          })
        ) : (
          <Fragment>
            <span className={styles["chat-event-tag"]} key={nanoid()}>
              {words[0]}
            </span>{" "}
            has been added to the workspace.
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ChatEventCard;
