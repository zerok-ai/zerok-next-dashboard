import CustomSkeleton from "components/custom/CustomSkeleton";
import ZkLink from "components/ZkLink";
import { useRouter } from "next/router";
import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopTyping } from "redux/chat/chatSlice";
import { type ChatEventQueryType } from "redux/chat/chatTypes";
import { useDispatch, useSelector } from "redux/store";
import { getFormattedTime } from "utils/dateHelpers";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./ChatBoxDisplay.module.scss";

interface ChatBoxDisplayProps {
  query: ChatEventQueryType & { created_at?: string };
}

const AIChatBox = ({ query }: ChatBoxDisplayProps) => {
  const { queries } = useSelector(chatSelector);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const onTypeEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    dispatch(stopTyping(query.id));
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const { error, loading } = query;
  const text = query?.event.response ?? null;
  const queryIndex = queries.findIndex((q) => q.id === query.id);
  const animate = query.typing && queryIndex === queries.length - 1;
  return (
    <div className={styles.container}>
      <div className={styles["chatbox-logo"]}>
        <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
      </div>

      {!error && text ? (
        <div className={styles["text-container"]}>
          {animate ? (
            <TypeAnimation
              cursor={false}
              sequence={[
                text,
                () => {
                  onTypeEnd();
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
              Based on request{" "}
              <ZkLink
                href={getSpanPageLinkFromIncident(query.incidentId!, router)}
                highlight
              >
                {query.incidentId}
              </ZkLink>
            </span>
            <span>
              {query.created_at && getFormattedTime(query.created_at)}
            </span>
          </div>
          <div ref={bottomRef}></div>
        </div>
      ) : loading && !error ? (
        <CustomSkeleton
          containerClass={styles["skeleton-container"]}
          skeletonClass={styles.skeleton}
          len={1}
        />
      ) : (
        error && (
          <p>
            Could not fetch a response, please try again or contact support.
          </p>
        )
      )}
    </div>
  );
};

export default AIChatBox;
