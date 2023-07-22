import { OutlinedInput } from "@mui/material";
import { useTypeAnimation } from "hooks/useTypeAnimation";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { ICON_BASE_PATH, ICONS, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";
import { ZK_GPT_RCA_ENDPOINT } from "utils/issues/endpoints";

import styles from "./IncidentChatTab.module.scss";

const IncidentChatTab = () => {
  const [allText, setAllText] = useState<string[]>([
    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n`,
  ]);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { incident: incidentId, issue: issueId } = router.query;
  // const { loading, data, error, fetchData } = useFetch<GenericObject>("rca");

  const {
    currentText: currentChatText,
    isTyping,
    setCurrentText,
    setIsTyping,
  } = useTypeAnimation(allText[0], 10);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = ZK_GPT_RCA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId as string);
      // fetchData(endpoint);
    }
  }, [incidentId, issueId, selectedCluster]);
  // console.log({ chatText });
  return (
    <div className={styles.container}>
      <div className={styles["chat-box-container"]}>
        <div className={styles["logo-container"]}>
          <div className={styles["chatbox-logo"]}>
            <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
          </div>
        </div>
        <div className={styles["text-container"]}>
          {allText.map((text, index) => {
            return (
              <TypeAnimation
                sequence={[text]}
                repeat={0}
                wrapper="p"
                speed={{ type: "keyStrokeDelayInMs", value: 10 }}
                preRenderFirstString={false}
                key={nanoid()}
              />
            );
          })}
        </div>
      </div>
      <div className={styles["chat-input-container"]}>
        <OutlinedInput
          fullWidth
          className={styles["chat-input"]}
          placeholder="Type something..."
          endAdornment={
            <span
              className={styles["send-icon"]}
              role="button"
              onClick={() => {
                setAllText((old) => [...old, "currentChatText"]);
                setCurrentText("hey there");
                setIsTyping(true);
              }}
            >
              <img src={`${ICON_BASE_PATH}/${ICONS.send}`} alt="send_icon" />
            </span>
          }
        />
      </div>
    </div>
  );
};

export default IncidentChatTab;
