import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { ZK_GPT_RCA_ENDPOINT } from "utils/issues/endpoints";
import raxios from "utils/raxios";

import styles from "./IncidentChatTab.module.scss";
import AIChatBox from "components/AIChatBox";
import { UserInputField, UserQueryCard } from "./IncidentChatTab.utils";

let timer: ReturnType<typeof setInterval>;

interface IncidentChatData {
  query: string;
  loading: boolean;
  reply: null | string;
}

const IncidentChatTab = () => {
  // const [allText, setAllText] = useState<string[]>([
  //   `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n`,
  // ]);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { incident: incidentId, issue: issueId } = router.query;
  const { data: rca, fetchData } = useFetch<string>("rca");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IncidentChatData[]>([]);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      fetchData(endpoint);
    }
  }, [incidentId, issueId, selectedCluster]);

  const onTypeStart = () => {
    timer = setInterval(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };
  const onTypeEnd = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    clearInterval(timer);
  };

  const handleInputSubmit = async (val: string) => {
    if (selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      setQueries((prev) => [
        ...prev,
        { query: val, loading: true, reply: null },
      ]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        console.log(err);
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
          <AIChatBox
            text={rca}
            animate={true}
            onTypeEnd={onTypeEnd}
            onTypeStart={onTypeStart}
          />

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
                      animate={idx === queries.length - 1}
                      onTypeEnd={onTypeEnd}
                      onTypeStart={onTypeStart}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className={styles["chat-input-container"]}>
        <UserInputField onSubmit={handleInputSubmit} />
      </div>
    </div>
  );
};

export default IncidentChatTab;
