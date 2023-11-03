import CustomSkeleton from "components/custom/CustomSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopLikelyCauseTyping } from "redux/chat";
import { useDispatch, useSelector } from "redux/store";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./GptLikelyCauseBox.module.scss";

const GptLikelyCauseBox = () => {
  const { likelyCause, queries, typing, likelyCauseError } =
    useSelector(chatSelector);
  const text =
    likelyCause?.response?.data ?? likelyCause?.response?.summary ?? null;
  const router = useRouter();
  const dispatch = useDispatch();

  const renderText = () => {
    if (likelyCauseError) {
      return "Couldn't fetch the likely cause for this incident. Please try again later or contact support.";
    } else {
      return text ? (
        <Fragment>
          {typing && queries.length === 0 ? (
            <TypeAnimation
              cursor={false}
              sequence={[
                text,
                () => {
                  dispatch(stopLikelyCauseTyping());
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
            <Link
              href={getSpanPageLinkFromIncident(
                likelyCause?.incidentId as string,
                router
              )}
            >
              {likelyCause?.incidentId}
            </Link>
          </div>
        </Fragment>
      ) : (
        <CustomSkeleton
          containerClass={styles["skeleton-container"]}
          skeletonClass={styles.skeleton}
          len={1}
        />
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
