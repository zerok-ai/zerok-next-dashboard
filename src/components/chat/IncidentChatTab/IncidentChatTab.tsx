import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import GptInferenceBox from "components/GptInferenceBox";
import ResizableChatBox from "components/ResizableChatBox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { HiChevronRight } from "react-icons/hi";
import {
  addEvent,
  addInvalidCard,
  chatSelector,
  fetchLikelyCause,
  fetchNewInference,
  fetchQueryResponse,
} from "redux/chat";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
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
  const { likelyCause, queries, contextIncident } = useSelector(chatSelector);
  const [width, setWidth] = useState(550);
  console.log("rerender chat tab");

  useEffect(() => {
    if (bottomRef.current) {
      console.log("firing");
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [queries]);

  useEffect(() => {
    console.log("in useeffect");
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
      if ((val === "/context" || val === "/infer") && !incidentId) {
        dispatch(addInvalidCard("Please select an incident first"));
        return;
      }
      if (val === "/context") {
        dispatch(
          addEvent({
            type: "CONTEXT",
            newIncidentID: incidentId as string,
          })
        );
      } else if (val === "/infer") {
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
            incidentId: incidentId as string,
          })
        );
      }
    }
  };

  const renderChat = useCallback(() => {
    if (!enableChat) {
      return null;
    } else {
      return (
        <Fragment>
          <div className={styles["text-boxes"]}>
            <GptLikelyCauseBox />
            {queries.map((qa, idx) => {
              const { type } = qa;
              if (type === "invalid") {
                return (
                  <ChatEventCard
                    text="Please select a request from the right to continue."
                    key={qa.id}
                  />
                );
              }
              if (type === "context") {
                const DisplayText = () => {
                  return (
                    <span>
                      Chat context changed from{" "}
                      <Link
                        href={getSpanPageLinkFromIncident(
                          contextIncident!,
                          router
                        )}
                      >
                        this
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
              if (type === "query") {
                return (
                  <Fragment key={qa.id}>
                    <ChatEventCard text={qa.query} />
                    <AIChatBox query={qa} />
                  </Fragment>
                );
              }
              if (type === "infer") {
                return (
                  <Fragment key={qa.id}>
                    <GptInferenceBox query={qa} />
                  </Fragment>
                );
              }
              return (
                <Fragment key={nanoid()}>
                  <span></span>
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      );
    }
  }, [queries, likelyCause]);

  const WrapperElement = ({ children }: { children: React.ReactNode }) => {
    return chatMinimized ? (
      <Fragment>{children}</Fragment>
    ) : (
      <ResizableChatBox
        width={width}
        updateWidth={(w) => {
          setWidth(w);
        }}
      >
        {children}
      </ResizableChatBox>
    );
  };
  return (
    <WrapperElement>
      <div className={cx(styles.container, chatMinimized && styles.minimized)}>
        <ChatToggleBanner
          minimized={chatMinimized}
          toggleMinimize={toggleChatMinimized}
        />
        {!chatMinimized ? (
          <Fragment>
            <div className={styles["chat-box-container"]}>
              <div className={styles["text-container"]}>
                {renderChat()}
                <div ref={bottomRef}></div>
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
    </WrapperElement>
  );
};

export default IncidentChatTab;
