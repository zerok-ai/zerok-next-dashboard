import { Button } from "@mui/material";
import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import GptInferenceBox from "components/chat/GptInferenceBox";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ResizableChatBox from "components/ResizableChatBox";
import { useToggle } from "hooks/useToggle";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineHistory } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import {
  addInvalidCard,
  chatSelector,
  fetchLikelyCause,
  fetchNewInference,
  fetchPastEvents,
  fetchQueryResponse,
  postContextEvent,
} from "redux/chat";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import {
  type ChatInferenceEventType,
  type ChatQueryEventType,
} from "redux/types";
import { CHAT_EVENTS } from "utils/gpt/constants";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";

import ChatEventCard from "../ChatEventCard";
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
  const { issue_id: issueId, trace: incidentId } = router.query;
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    likelyCause,
    queries,
    contextIncident,
    eventLoading,
    historyLoading,
    history,
    pastEventCount,
  } = useSelector(chatSelector);
  const [width, setWidth] = useState(550);
  useEffect(() => {
    if (selectedCluster && issueId) {
      dispatch(
        fetchLikelyCause({
          selectedCluster,
          issueId: issueId as string,
        })
      );
    }
  }, [selectedCluster]);

  const handleInputSubmit = async (val: string) => {
    if (!enableChat) {
      return;
    }
    if (selectedCluster) {
      if (
        (val === `/${CHAT_EVENTS.CONTEXT_SWITCH}` ||
          val === `/${CHAT_EVENTS.INFERENCE}`) &&
        !incidentId
      ) {
        dispatch(addInvalidCard("Please select an incident first"));
        return;
      }
      if (val === `/${CHAT_EVENTS.CONTEXT_SWITCH}`) {
        dispatch(
          postContextEvent({
            selectedCluster,
            issueId: issueId as string,
            incidentId: incidentId as string,
          })
        );
      } else if (val === `/${CHAT_EVENTS.INFERENCE}`) {
        dispatch(
          fetchNewInference({
            selectedCluster,
            issueId: issueId as string,
            incidentId: incidentId as string,
          })
        );
      } else {
        dispatch(
          fetchQueryResponse({
            selectedCluster,
            query: val,
            issueId: issueId as string,
          })
        );
      }
    }
  };

  const renderChat = useCallback(() => {
    if (!enableChat) {
      return null;
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
                  pastEventCount > 0 && history.length === pastEventCount
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
                    text="Please select a request from the right to continue."
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
                return (
                  <Fragment key={qa.id}>
                    <ChatEventCard text={qa.event.query} />
                    <AIChatBox query={qa as ChatQueryEventType} />
                  </Fragment>
                );
              }
              if (type === CHAT_EVENTS.INFERENCE) {
                return (
                  <Fragment key={qa.id}>
                    <GptInferenceBox query={qa as ChatInferenceEventType} />
                  </Fragment>
                );
              }
              return (
                <Fragment key={"some"}>
                  <span></span>
                </Fragment>
              );
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
                {historyLoading && <CustomSkeleton len={8} />}
                {eventLoading && <ChatEventCard loading={true} />}
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
