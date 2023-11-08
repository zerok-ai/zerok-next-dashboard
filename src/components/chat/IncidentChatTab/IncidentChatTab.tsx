import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import ChatDisabledCard from "components/chat/ChatDisabledCard";
import GptInferenceBox from "components/chat/GptInferenceBox";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ResizableChatBox from "components/ResizableChatBox";
import { useToggle } from "hooks/useToggle";
import { useRouter } from "next/router";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  chatSelector,
  // fetchLikelyCause,
} from "redux/chat/chatSlice";
import {
  type ChatEventContextSwitchType,
  type ChatEventInferenceType,
  type ChatEventQueryType,
  type ChatEventTagType,
} from "redux/chat/chatTypes";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { fetchLikelyCause } from "redux/thunks/chat";
import {
  CHAT_EVENTS,
  ZKCHAT_DEFAULT_WIDTH,
  ZKCHAT_MINIMIZED_WIDTH,
} from "utils/gpt/constants";

// import { GPT_FLAGS } from "utils/gpt/flags";
import ChatEventCard from "../ChatEventCard";
import ChatPastEventsBtn from "../ChatPastEventsBtn";
import ChatTagCard from "../ChatTagCard";
import ChatToggleBanner from "../ChatToggleBanner";
import ChatUserInput from "../ChatUserInput";
import GptLikelyCauseBox from "../GptLikelyCauseBox";
import styles from "./IncidentChatTab.module.scss";
import { ChatMinimizedIcon, ContextEventText } from "./IncidentChatTab.utils";

const IncidentChatTab = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const [enableChat] = useToggle(true);
  const [chatMinimized, toggleChatMinimized] = useToggle(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { issue_id: issueId } = router.query;
  const bottomRef = useRef<HTMLDivElement>(null);
  const { likelyCause, queries, loading } = useSelector(chatSelector);
  const incidentId =
    router.query.trace ??
    likelyCause.event?.incidentId ??
    router.query.latest ??
    null;
  const [width, setWidth] = useState(ZKCHAT_DEFAULT_WIDTH);
  useEffect(() => {
    if (selectedCluster && issueId && enableChat) {
      dispatch(
        fetchLikelyCause({
          selectedCluster,
          issueId: issueId as string,
        })
      );
    }
  }, [selectedCluster, issueId, enableChat]);

  const pastEventsButton = useMemo(() => {
    return <ChatPastEventsBtn issueId={issueId as string} />;
  }, [issueId]);

  const renderChat = useCallback(() => {
    if (!enableChat) {
      return (
        <ChatDisabledCard text="This feature is disabled for your organisation. Please contact ZeroK support for more details." />
      );
    } else {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
      return queries.map((qa, idx) => {
        const { type } = qa.event;
        switch (type) {
          case CHAT_EVENTS.CONTEXT_SWITCH: {
            const cx = qa as ChatEventContextSwitchType;
            return (
              <ChatEventCard
                component={
                  <ContextEventText event={cx.event} router={router} />
                }
                key={qa.id}
              />
            );
          }
          case CHAT_EVENTS.QUERY: {
            const qr = qa as ChatEventQueryType;
            return (
              <Fragment key={qr.id}>
                <ChatEventCard text={qr.event.query} />
                <AIChatBox query={qa as ChatEventQueryType} />
              </Fragment>
            );
          }
          case CHAT_EVENTS.INFERENCE: {
            return (
              <GptInferenceBox
                query={qa as ChatEventInferenceType}
                key={qa.id}
              />
            );
          }
          case CHAT_EVENTS.TAG: {
            const ev = qa as ChatEventTagType;
            return <ChatTagCard tag={ev.event.tag} key={qa.id} />;
          }
          default:
            return null;
        }
      });
    }
  }, [queries, likelyCause]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [queries.length]);

  const minimizeChat = () => {
    toggleChatMinimized();
    setWidth(ZKCHAT_MINIMIZED_WIDTH);
  };

  return (
    <ResizableChatBox
      width={width}
      minimized={chatMinimized}
      updateWidth={(w) => {
        setWidth(w);
      }}
    >
      <div className={cx(styles.container, chatMinimized && styles.minimized)}>
        <ChatToggleBanner
          minimized={chatMinimized}
          toggleMinimize={minimizeChat}
        />
        {!chatMinimized ? (
          <div className={styles["chat-container"]}>
            <div className={styles["chat-events-container"]}>
              <div className={styles["chat-past-event-btn"]}>
                {pastEventsButton}
              </div>
              <div className={styles["likely-cause-container"]}>
                <GptLikelyCauseBox />
              </div>
              {loading === CHAT_EVENTS.HISTORY && <CustomSkeleton len={5} />}
              <div className={styles["chat-events"]}>{renderChat()}</div>
              {loading && <CustomSkeleton len={1} />}
            </div>
            <div className={styles["chat-input-container"]} ref={bottomRef}>
              <ChatUserInput
                disabled={!enableChat}
                incidentId={incidentId as string}
              />
            </div>
          </div>
        ) : (
          <ChatMinimizedIcon onClick={toggleChatMinimized} />
        )}
      </div>
    </ResizableChatBox>
  );
};

export default IncidentChatTab;
