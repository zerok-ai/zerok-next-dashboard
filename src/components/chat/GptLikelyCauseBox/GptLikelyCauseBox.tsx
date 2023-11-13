import CustomSkeleton from "components/custom/CustomSkeleton";
import ZkLink from "components/ZkLink";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopTyping } from "redux/chat/chatSlice";
import { useDispatch, useSelector } from "redux/store";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./GptLikelyCauseBox.module.scss";

const GptLikelyCauseBox = () => {
  const { likelyCause, queries } = useSelector(chatSelector);
  const { event, error, typing, loading } = likelyCause;
  const text = event?.inference.data ?? event?.inference.summary ?? null;
  const router = useRouter();
  const dispatch = useDispatch();
  const incidentId = event?.incidentId ?? null;

  const renderText = () => {
    if (error) {
      return "Couldn't fetch the likely cause for this incident. Please try again later or contact support.";
    } else if (loading || !text) {
      return (
        <CustomSkeleton
          containerClass={styles["skeleton-container"]}
          skeletonClass={styles.skeleton}
          len={1}
        />
      );
    } else {
      return (
        <Fragment>
          {typing && queries.length === 0 ? (
            <TypeAnimation
              cursor={false}
              sequence={[
                text,
                () => {
                  dispatch(stopTyping(likelyCause.id));
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
            Based on request{" "}
            <ZkLink
              href={getSpanPageLinkFromIncident(incidentId as string, router)}
              highlight
            >
              {incidentId}
            </ZkLink>
          </div>
        </Fragment>
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles["likely-cause-box"]}>
        <div className={styles.header}>
          <figure className={styles["chatbox-logo"]}>
            <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
          </figure>
          <h5>Likely cause</h5>
        </div>
        <div className={styles["text-container"]}>{renderText()}</div>
      </div>
    </div>
  );
};

export default GptLikelyCauseBox;
