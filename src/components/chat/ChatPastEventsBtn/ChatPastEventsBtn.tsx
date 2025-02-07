import { IconButton } from "@mui/material";
import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { AiOutlineHistory } from "react-icons/ai";
import { chatSelector } from "redux/chat/chatSlice";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { fetchPastEvents } from "redux/thunks/chat";

import styles from "./ChatPastEventsBtn.module.scss";

interface ChatPastEventsBtnProps {
  issueId: string;
}

const ChatPastEventsBtn = ({ issueId }: ChatPastEventsBtnProps) => {
  const { history, historyCount } = useSelector(chatSelector);
  const dispatch = useDispatch();
  const { selectedCluster } = useSelector(clusterSelector);

  const onClick = () => {
    dispatch(
      fetchPastEvents({
        selectedCluster: selectedCluster as string,
        issueId,
      })
    );
  };
  const disabled = historyCount !== null && history.length === historyCount;
  return (
    <TooltipX
      arrow={false}
      title={
        !disabled
          ? "Get past conversations for this issue"
          : "No more conversations for this issue"
      }
      placement="left"
    >
      <div className={styles.container}>
        <IconButton
          color="secondary"
          size="medium"
          disabled={disabled}
          onClick={onClick}
          className={styles.button}
        >
          <AiOutlineHistory
            className={cx(styles.icon, disabled && styles.disabled)}
          />
        </IconButton>
      </div>
    </TooltipX>
  );
};

export default ChatPastEventsBtn;
