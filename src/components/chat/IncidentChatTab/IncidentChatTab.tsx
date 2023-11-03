import { Button } from "@mui/material";
import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import ChatDisabledCard from "components/chat/ChatDisabledCard";
import GptInferenceBox from "components/chat/GptInferenceBox";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ResizableChatBox from "components/ResizableChatBox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineHistory } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import {
  addTagCard,
  chatSelector,
  // fetchLikelyCause,
} from "redux/chat/chatSlice";
import {
  fetchLikelyCause,
  fetchPastEvents,
  postChatQuery,
  postNewChatEvent,
} from "redux/chat/chatThunks";
import {
  type ChatEventInferenceType,
  type ChatEventQueryType,
  type ChatEventTagType,
} from "redux/chat/chatTypes";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { CHAT_EVENTS, CHAT_TAG_CHARACTER } from "utils/gpt/constants";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";

import ChatEventCard from "../ChatEventCard";
import ChatTagCard from "../ChatTagCard";
import ChatToggleBanner from "../ChatToggleBanner";
import GptLikelyCauseBox from "../GptLikelyCauseBox";
import styles from "./IncidentChatTab.module.scss";
import { UserInputField } from "./IncidentChatTab.utils";

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
    history,
    historyCount,
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

  console.log({ queries, contextIncident, likelyCause });
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
          <div className={styles["text-boxes"]}>
            <div className={styles["likely-cause-container"]}>
              <Button
                variant="text"
                color="primary"
                disabled={
                  historyCount !== null && history.length === historyCount
                }
                onClick={() => {
                  dispatch(
                    fetchPastEvents({
                      selectedCluster: selectedCluster as string,
                      issueId: issueId as string,
                    })
                  );
                }}
              >
                <AiOutlineHistory /> Get older conversations
              </Button>
              <GptLikelyCauseBox />
            </div>

            {queries.map((qa, idx) => {
              const { type } = qa.event;
              if (type === CHAT_EVENTS.INVALID) {
                return (
                  <ChatEventCard
                    text="Please select a request to continue."
                    key={qa.id}
                  />
                );
              }
              if (type === CHAT_EVENTS.CONTEXT_SWITCH) {
                const DisplayText = () => {
                  return (
                    <span>
                      Chat context changed from the{" "}
                      <Link
                        href={getSpanPageLinkFromIncident(
                          contextIncident!,
                          router
                        )}
                      >
                        old request
                      </Link>{" "}
                      to the{" "}
                      <Link
                        href={getSpanPageLinkFromIncident(
                          incidentId as string,
                          router
                        )}
                      >
                        current
                      </Link>{" "}
                      request
                    </span>
                  );
                };
                return (
                  <ChatEventCard render={() => <DisplayText />} key={qa.id} />
                );
              }
              if (type === CHAT_EVENTS.QUERY) {
                const qr = qa as ChatEventQueryType;
                return (
                  <Fragment key={qr.id}>
                    <ChatEventCard text={qr.event.query} />
                    <AIChatBox query={qa as ChatEventQueryType} />
                  </Fragment>
                );
              }
              if (type === CHAT_EVENTS.INFERENCE) {
                return (
                  <Fragment key={qa.id}>
                    <GptInferenceBox query={qa as ChatEventInferenceType} />
                  </Fragment>
                );
              }
              if (type === CHAT_EVENTS.TAG) {
                const ev = qa as ChatEventTagType;
                return (
                  <Fragment key={qa.id}>
                    <ChatTagCard tag={ev.event.tag} />
                  </Fragment>
                );
              }
              return null;
            })}
          </div>
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
                {renderChat()}
                {loading === CHAT_EVENTS.HISTORY && <CustomSkeleton len={8} />}
                {loading && <ChatEventCard loading={true} />}
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
