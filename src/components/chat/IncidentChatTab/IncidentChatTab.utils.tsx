import Link from "next/link";
import { type NextRouter } from "next/router";
import { HiChevronRight } from "react-icons/hi";
import { type ChatEventContextSwitchType } from "redux/chat/chatTypes";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";

import styles from "./IncidentChatTab.module.scss";

export const ContextEventText = ({
  event,
  router,
}: {
  event: ChatEventContextSwitchType["event"];
  router: NextRouter;
}) => {
  const { oldIncident, newIncident } = event;
  return (
    <span>
      Switched context from{" "}
      <Link href={getSpanPageLinkFromIncident(oldIncident, router)}>
        the old request
      </Link>{" "}
      to{" "}
      <Link href={getSpanPageLinkFromIncident(newIncident, router)}>
        this request
      </Link>
    </span>
  );
};

export const ChatMinimizedIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles["mini-icon"]} role="button" onClick={onClick}>
      <HiChevronRight className={styles["expand-icon"]} />
    </div>
  );
};
