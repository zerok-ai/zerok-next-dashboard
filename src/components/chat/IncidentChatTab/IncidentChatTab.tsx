import cx from "classnames";
import AIChatBox from "components/chat/AIChatBox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Resizable } from "re-resizable";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { HiChevronRight } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { CHAT_TAG_CHARACTER } from "utils/gpt/constants";
import {
  GPT_INCIDENT_ENDPOINT,
  GPT_INCIDENT_ENDPOINT_OLD,
} from "utils/gpt/endpoints";
import raxios from "utils/raxios";

import ChatToggleBanner from "../ChatToggleBanner";
import styles from "./IncidentChatTab.module.scss";
import { UserInputField, UserQueryCard } from "./IncidentChatTab.utils";

interface IncidentChatData {
  query: string;
  loading: boolean;
  reply: null | string;
  doneTyping: boolean;
  tagCard?: boolean;
}

interface IncidentSummaryType {
  inference: {
    data: string | null;
    anamolies: string | null;
    summary: string | null;
  };
  incidentId: string;
  issueId: string;
}

const IncidentChatTab = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const [enableChat] = useToggle(true);
  const [chatMinimized, toggleChatMinimized] = useToggle(false);
  const router = useRouter();
  const {
    issue_id: issueId,
    trace: incidentId,
    issue: scenarioId,
  } = router.query;
  const [incidentData, setIncidentData] = useState<null | IncidentSummaryType>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IncidentChatData[]>([]);

  const getIncidentSummary = async () => {
    try {
      const endpoint = GPT_INCIDENT_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      const rdata = await raxios.post(endpoint, {
        issueId,
      });
      setIncidentData(rdata.data.payload);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (selectedCluster) {
      getIncidentSummary();
    }
  }, [selectedCluster]);

  const handleInputSubmit = async (val: string) => {
    if (!enableChat) {
      return;
    }
    if (val.includes(CHAT_TAG_CHARACTER)) {
      setQueries((prev) => [
        ...prev,
        {
          query: val,
          loading: false,
          reply: null,
          doneTyping: false,
          tagCard: true,
        },
      ]);
      return;
    }
    if (selectedCluster) {
      const endpoint = GPT_INCIDENT_ENDPOINT_OLD.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      setQueries((prev) => [
        ...prev,
        { query: val, loading: true, reply: null, doneTyping: false },
      ]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      try {
        const rdata = await raxios.post(endpoint, { query: val });
        setQueries((prev) =>
          prev.map((qa, idx) => {
            if (idx === prev.length - 1) {
              return {
                ...qa,
                loading: false,
                reply: rdata.data.payload.answer,
              };
            }
            return qa;
          })
        );
      } catch (err) {
        setQueries((prev) =>
          prev.map((qa, idx) => {
            if (idx === prev.length - 1) {
              return { ...qa, loading: false, reply: "Something went wrong" };
            }
            return qa;
          })
        );
      }
    }
  };

  const renderLikelyCause = () => {
    const text = incidentData
      ? incidentData.inference.summary ?? incidentData.inference.data
      : null;
    const ChatFooter = () => {
      if (!incidentData) return null;
      return (
        <span>
          Based on trace -{" "}
          <Link
            href={`/issues/detail?issue_id=${issueId as string}&trace=${
              incidentData.incidentId
            }&issue=${scenarioId as string}`}
          >
            {incidentData.incidentId}
          </Link>
        </span>
      );
    };
    return (
      <Fragment>
        <AIChatBox
          header="Likely cause"
          text={text}
          animate={queries.length === 0}
          footer={<ChatFooter />}
        />
        {incidentData?.inference.anamolies && (
          <AIChatBox
            header="Anamolies"
            text={text}
            animate={queries.length === 0}
            footer={<ChatFooter />}
          />
        )}
      </Fragment>
    );
  };

  const renderChat = () => {
    if (!enableChat) {
      return null;
    } else {
      return (
        <Fragment>
          {renderLikelyCause()}
          <div className={styles["text-boxes"]}>
            {queries.map((qa, idx) => {
              const { query, reply, tagCard } = qa;
              if (tagCard) {
                return (
                  <div className={styles["query-container"]} key={nanoid()}>
                    <div className={styles.query}>
                      <UserQueryCard text={query} tagCard={true} />
                    </div>
                  </div>
                );
              }
              return (
                <div className={styles["query-container"]} key={nanoid()}>
                  <div className={styles.query}>
                    <UserQueryCard text={query} tagCard={false} />
                  </div>
                  <div className={styles.reply}>
                    <AIChatBox
                      text={reply}
                      animate={idx === queries.length - 1 && !qa.doneTyping}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        </Fragment>
      );
    }
  };
  return (
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
                {!enableChat && (
                  <AIChatBox
                    text={
                      "This functionality is disabled for your organization. Please contact ZeroK support to enable this."
                    }
                    animate={queries.length === 0}
                    blink={false}
                    header="Scenario summary"
                  />
                )}
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
    </Resizable>
  );
};

export default memo(IncidentChatTab);
