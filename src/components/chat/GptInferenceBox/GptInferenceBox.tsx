// import cssVars from "styles/variables.module.scss";
import CustomSkeleton from "components/custom/CustomSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopTyping } from "redux/chat";
import { useDispatch, useSelector } from "redux/store";
import { type ChatInferenceEventType } from "redux/types";
import { getFormattedTime } from "utils/dateHelpers";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./GptInferenceBox.module.scss";

interface GptInferenceBoxProps {
  query: ChatInferenceEventType;
}

const GptInferenceBox = ({ query }: GptInferenceBoxProps) => {
  const { queries } = useSelector(chatSelector);
  const text = query.event.response
    ? query.event.response.summary ?? query.event.response.data
    : null;
  const router = useRouter();

  const queryIndex = queries.findIndex((q) => q.id === query.id);
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["chatbox-logo"]}>
          <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
        </div>
        <h5>Inference</h5>
      </div>

      {text ? (
        <div className={styles["text-container"]}>
          {query.typing && queryIndex === queries.length - 1 ? (
            <TypeAnimation
              cursor={false}
              sequence={[
                text,
                () => {
                  dispatch(stopTyping(query.id));
                },
              ]}
              repeat={0}
              wrapper="p"
              speed={{ type: "keyStrokeDelayInMs", value: 3 }}
              preRenderFirstString={false}
            />
          ) : (
            text
          )}
          <div className={styles.footer}>
            <span>
              Based on{" "}
              <Link
                href={getSpanPageLinkFromIncident(
                  query.incidentId as string,
                  router
                )}
              >
                this request
              </Link>
            </span>
            <span>
              {query.created_at && getFormattedTime(query.created_at)}
            </span>
          </div>
        </div>
      ) : (
        <CustomSkeleton
          containerClass={styles["skeleton-container"]}
          skeletonClass={styles.skeleton}
          len={1}
        />
      )}
    </div>
  );
};

export default GptInferenceBox;