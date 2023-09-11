import AIChatBox from "components/AIChatBox";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { CHAT_TAG_CHARACTER } from "utils/gpt/constants";
import { GPT_INCIDENT_ENDPOINT, GPT_ISSUE_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

import styles from "./IncidentChatTab.module.scss";
import { UserInputField, UserQueryCard } from "./IncidentChatTab.utils";

interface IncidentChatData {
  query: string;
  loading: boolean;
  reply: null | string;
  doneTyping: boolean;
  tagCard?: boolean;
}

const IncidentChatTab = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const [enableChat] = useToggle(true);
  const router = useRouter();
  const { issue_id: issueId, trace: incidentId } = router.query;
  const {
    data: issueData,
    fetchData: fetchIssueData,
    loading: issueLoading,
  } = useFetch<string>("summary");
  const {
    data: incidentData,
    fetchData: fetchIncidentData,
    loading: incidentLoading,
  } = useFetch<string>("rca");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IncidentChatData[]>([]);

  useEffect(() => {
    if (issueId && selectedCluster) {
      const endpoint = GPT_ISSUE_ENDPOINT.replace(
        "{issue_id}",
        issueId as string
      ).replace("{cluster_id}", selectedCluster);
      fetchIssueData(endpoint);
    }
  }, [issueId, selectedCluster]);

  useEffect(() => {
    if (selectedCluster && incidentId) {
      const endpoint = GPT_INCIDENT_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      setQueries([]);
      fetchIncidentData(endpoint);
    }
  }, [selectedCluster, incidentId]);

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
      const endpoint = GPT_INCIDENT_ENDPOINT.replace(
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
  const renderChat = () => {
    if (!enableChat) {
      return null;
    } else {
      return (
        <Fragment>
          {(issueData ?? issueLoading) && (
            <AIChatBox
              text={issueData}
              animate={queries.length === 0}
              blink={false}
              header="Issue summary"
            />
          )}
          {(incidentData ?? incidentLoading) && (
            <AIChatBox
              text={incidentData}
              animate={queries.length === 0}
              blink={queries.length === 0}
              header="Cause"
            />
          )}
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
    <div className={styles.container}>
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
        <UserInputField onSubmit={handleInputSubmit} disabled={!enableChat} />
      </div>
    </div>
  );
};

export default memo(IncidentChatTab);
