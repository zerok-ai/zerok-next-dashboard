import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Resizable } from "re-resizable";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { HiChevronRight } from "react-icons/hi";
import {
  addEvent,
  addInvalidCard,
  chatSelector,
  fetchLikelyCause,
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
  console.log("rerender chat tab");

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
      if (val === "/context") {
        if (!incidentId) {
          dispatch(addInvalidCard("Please select an incident first"));
        } else {
          dispatch(
            addEvent({
              type: "CONTEXT",
              newIncidentID: incidentId as string,
            })
          );
        }
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
              return (
                <Fragment key={nanoid()}>
                  <div ref={bottomRef}></div>
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
      <Resizable
        defaultSize={{
          width: 550,
          height: "100%",
        }}
        minWidth={"400px"}
        maxWidth={"900px"}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
        }}
        className={styles.resizable}
      >
        {children}
      </Resizable>
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
              {/* <IconButton size="small" onClick={toggleEnableChat}>
          <HiOutlineBugAnt />
        </IconButton> */}
              <div className={styles["text-container"]}>
                {/* {!enableChat && (
                  <AIChatBox
                    text={
                      "This functionality is disabled for your organization. Please contact ZeroK support to enable this."
                    }
                    animate={queries.length === 0}
                    blink={false}
                    header="Scenario summary"
                  />
                )} */}
                {renderChat()}
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
