import AIChatBox from "components/AIChatBox";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { ZK_GPT_RCA_ENDPOINT } from "utils/issues/endpoints";
import raxios from "utils/raxios";

import styles from "./IncidentChatTab.module.scss";
import { UserInputField, UserQueryCard } from "./IncidentChatTab.utils";

interface IncidentChatData {
  query: string;
  loading: boolean;
  reply: null | string;
  doneTyping: boolean;
}

interface IncidentChatTabProps {
  trace: string | null;
}

const IncidentChatTab = ({ trace }: IncidentChatTabProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { issue: issueId } = router.query;
  const { data: rca, fetchData, setData } = useFetch<string>("rca");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IncidentChatData[]>([]);
  useEffect(() => {
    if (selectedCluster && trace) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", trace);
      setData(null);
      setQueries([]);
      fetchData(endpoint);
    }
  }, [selectedCluster, trace]);
  const handleInputSubmit = async (val: string) => {
    if (selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", trace as string);
      setQueries((prev) => [
        ...prev,
        { query: val, loading: true, reply: null, doneTyping: false },
      ]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      // setStatus({ loading: true, error: null });
      // const rdata = await raxios.get("/gpt2.json");
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
  return (
    <div className={styles.container}>
      <div className={styles["chat-box-container"]}>
        <div className={styles["text-container"]}>
          <AIChatBox text={rca} animate={queries.length === 0} blink={false} />

          <div className={styles["text-boxes"]}>
            {queries.map((qa, idx) => {
              const { query, reply } = qa;
              return (
                <div className={styles["query-container"]} key={nanoid()}>
                  <div className={styles.query}>
                    <UserQueryCard text={query} />
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
        </div>
      </div>
      <div className={styles["chat-input-container"]}>
        <UserInputField onSubmit={handleInputSubmit} />
      </div>
    </div>
  );
};

export default memo(IncidentChatTab);
