import { OutlinedInput } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { ICON_BASE_PATH, ICONS, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";
import { ZK_GPT_RCA_ENDPOINT } from "utils/issues/endpoints";
import raxios from "utils/raxios";
import { type GenericObject } from "utils/types";

import styles from "./IncidentChatTab.module.scss";

let timer: ReturnType<typeof setInterval>;

const IncidentChatTab = () => {
  // const [allText, setAllText] = useState<string[]>([
  //   `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n`,
  // ]);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { incident: incidentId, issue: issueId } = router.query;
  const { data, fetchData } = useFetch<GenericObject>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  // const {
  //   currentText: currentChatText,
  //   isTyping,
  //   setCurrentText,
  //   setIsTyping,
  // } = useTypeAnimation(allText[0], 10);
  const [userInput, setUserInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [questionAnswers, setQuestionAnswers] = useState<GenericObject[]>([]);

  const { setStatus } = useStatus();

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      fetchData("/gpt1.json");
    }
  }, [incidentId, issueId, selectedCluster]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questionAnswers, data]);
  console.log("here");
  useEffect(() => {
    if (!isTyping) {
      timer = setInterval(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else clearInterval(timer);
  }, [isTyping]);

  const handleInputSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput && selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      setQuestionAnswers((prev) => [...prev, { question: userInput }]);
      setUserInput("");
      setStatus({ loading: true, error: null });
      const rdata = await raxios.get("/gpt2.json");
      setQuestionAnswers((prev) =>
        prev.map((qa, idx) => {
          if (idx === prev.length - 1) {
            return { ...qa, answer: rdata.data.payload.answer };
          }
          return qa;
        })
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles["chat-box-container"]}>
        <div className={styles["logo-container"]}>
          <div className={styles["chatbox-logo"]}>
            <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
          </div>
        </div>
        <div className={styles["text-container"]}>
          {data && data.rca && (
            <TypeAnimation
              sequence={[
                () => {
                  setIsTyping(true);
                },
                data.rca,
                () => {
                  setIsTyping(false);
                },
              ]}
              repeat={0}
              wrapper="p"
              speed={{ type: "keyStrokeDelayInMs", value: 3 }}
              preRenderFirstString={false}
            />
          )}
          {questionAnswers.length > 0 &&
            questionAnswers.map((qa, idx) => {
              const isNew = idx === questionAnswers.length - 1;
              return (
                <div className={styles["chat-qa-container"]} key={nanoid()}>
                  <div className={styles["chat-question-container"]}>
                    <br />
                    <p className={styles["chat-question-number"]}>
                      Question {idx + 1}:
                    </p>
                    <p className={styles["chat-question"]}>{qa.question}</p>
                  </div>
                  <div className={styles["chat-answer-container"]}>
                    <br />
                    <p className={styles["chat-answer-number"]}>Answer: </p>
                    <p className={styles["chat-answer"]}>{qa.answer}</p>
                  </div>
                </div>
              );
            })}
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className={styles["chat-input-container"]}>
        <form onSubmit={handleInputSubmit} id="chat-form">
          <button
            type="submit"
            style={{ width: "0", height: "0", opacity: "0" }}
            id="chat-form-btn"
          ></button>
          <OutlinedInput
            fullWidth
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            className={styles["chat-input"]}
            placeholder="Type something..."
            endAdornment={
              <span
                className={styles["send-icon"]}
                role="button"
                onClick={() => {
                  document.getElementById("chat-form-btn")?.click();
                }}
              >
                <img src={`${ICON_BASE_PATH}/${ICONS.send}`} alt="send_icon" />
              </span>
            }
          />
        </form>
      </div>
    </div>
  );
};

export default IncidentChatTab;
