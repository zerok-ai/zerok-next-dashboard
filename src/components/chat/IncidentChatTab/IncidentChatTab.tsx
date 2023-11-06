import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import ChatDisabledCard from "components/chat/ChatDisabledCard";
import GptInferenceBox from "components/chat/GptInferenceBox";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ResizableChatBox from "components/ResizableChatBox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiChevronRight } from "react-icons/hi";
import {
  addTagCard,
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
import {
  fetchLikelyCause,
  postChatQuery,
  postNewChatEvent,
} from "redux/thunks/chat";
import { CHAT_EVENTS, CHAT_TAG_CHARACTER } from "utils/gpt/constants";

import ChatEventCard from "../ChatEventCard";
import ChatPastEventsBtn from "../ChatPastEventsBtn";
import ChatTagCard from "../ChatTagCard";
import ChatToggleBanner from "../ChatToggleBanner";
import GptLikelyCauseBox from "../GptLikelyCauseBox";
import styles from "./IncidentChatTab.module.scss";
import { ContextEventText, UserInputField } from "./IncidentChatTab.utils";

const IncidentChatTab = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const [enableChat] = useToggle(true);
  const [chatMinimized, toggleChatMinimized] = useToggle(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { issue_id: issueId } = router.query;
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    likelyCause,
    queries,
    contextIncident,
    loading,

  } = useSelector(chatSelector);
  const incidentId =
    router.query.trace ??
    likelyCause.event?.incidentId ??
    router.query.latest ??
    null;
  const [width, setWidth] = useState(450);
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

  const handleInputSubmit = async (val: string) => {
    if (!enableChat) {
      return;
    }
    if (selectedCluster) {
      if (val === `/${CHAT_EVENTS.CONTEXT_SWITCH}`) {
        dispatch(
          postNewChatEvent({
            selectedCluster,
            issueId: issueId as string,
            incidentId: contextIncident as string,
            type: CHAT_EVENTS.CONTEXT_SWITCH,
            newIncident: (router.query.trace ?? router.query.latest) as string,
          })
        );
      } else if (val === `/${CHAT_EVENTS.INFERENCE}`) {
        dispatch(
          postNewChatEvent({
            selectedCluster,
            issueId: issueId as string,
            incidentId: incidentId as string,
            type: CHAT_EVENTS.INFERENCE,
          })
        );
      } else if (val === `/${CHAT_EVENTS.POSTMORTEM}`) {
        console.log({ val });
      } else if (val.includes(`${CHAT_TAG_CHARACTER}`)) {
        dispatch(addTagCard(val));
      } else {
        dispatch(
          postChatQuery({
            selectedCluster,
            query: val,
            issueId: issueId as string,
            uid: nanoid(),
            incidentId: incidentId as string,
          })
        );
      }
    }
  };

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
      return (
        <Fragment>
          {queries.map((qa, idx) => {
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
                  <Fragment key={qa.id}>
                    <GptInferenceBox query={qa as ChatEventInferenceType} />
                  </Fragment>
                );
              }
              case CHAT_EVENTS.TAG: {
                const ev = qa as ChatEventTagType;
                return (
                  <Fragment key={qa.id}>
                    <ChatTagCard tag={ev.event.tag} />
                  </Fragment>
                );
              }
              default:
                return null;
            }
          })}
        </Fragment>
      );
    }
  }, [queries, likelyCause]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [queries.length]);
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
          toggleMinimize={() => {
            toggleChatMinimized();
            setWidth(64);
          }}
        />
        {!chatMinimized ? (
          <Fragment>
            <div className={styles["chat-box-container"]}>
              <div className={styles["text-container"]}>
                <div className={styles["likely-cause-container"]}>
                  {pastEventsButton}
                  <GptLikelyCauseBox />
                </div>
                <div className={styles["text-boxes"]}>{renderChat()}</div>
                {loading === CHAT_EVENTS.HISTORY && <CustomSkeleton len={8} />}
                {loading && <CustomSkeleton len={1} />}
                <div ref={bottomRef} className={styles.bottom}></div>
              </div>
            </div>
            <div className={styles["chat-input-container"]}>
              <UserInputField
                onSubmit={handleInputSubmit}
                disabled={!enableChat}
              />
            </div>
          </Fragment>
        ) : (
          <div
            className={styles["mini-icon"]}
            role="button"
            onClick={toggleChatMinimized}
          >
            <HiChevronRight className={styles["expand-icon"]} />
          </div>
        )}
      </div>
    </ResizableChatBox>
  );
};

export default IncidentChatTab;
