// import cssVars from "styles/variables.module.scss";
import CustomSkeleton from "components/custom/CustomSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopLikelyCauseTyping } from "redux/chat";
import { useDispatch, useSelector } from "redux/store";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./GptLikelyCauseBox.module.scss";

const GptLikelyCauseBox = () => {
  const { likelyCause, queries, typing } = useSelector(chatSelector);
  const text =
    likelyCause?.response?.summary ?? likelyCause?.response?.data ?? null;
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["chatbox-logo"]}>
          <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
        </div>
        <h5>Likely cause</h5>
      </div>

      {text ? (
        <div className={styles["text-container"]}>
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
            Based on trace -{" "}
            <Link
              href={getSpanPageLinkFromIncident(
                likelyCause?.incidentId as string,
                router
              )}
            >
              {likelyCause?.incidentId}
            </Link>
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

export default GptLikelyCauseBox;
