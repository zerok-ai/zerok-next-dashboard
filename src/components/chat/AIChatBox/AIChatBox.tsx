// import cssVars from "styles/variables.module.scss";
import CustomSkeleton from "components/custom/CustomSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { chatSelector, stopTyping } from "redux/chat";
import { useDispatch, useSelector } from "redux/store";
import { type ChatQueryType } from "redux/types";
import { getSpanPageLinkFromIncident } from "utils/gpt/functions";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./ChatBoxDisplay.module.scss";

interface ChatBoxDisplayProps {
  query: ChatQueryType;
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
    // bottomRef.current?.scrollIntoView({
    //   behavior: "smooth",
    // });
  };
  const text = query?.response ?? null;
  const queryIndex = queries.findIndex((q) => q.id === query.id);
  const animate = query.typing && queryIndex === queries.length - 1;
  return (
    <div className={styles.container}>
      <div className={styles["chatbox-logo"]}>
        <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
      </div>

      {text ? (
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
            Based on trace -{" "}
            <Link href={getSpanPageLinkFromIncident(query.incidentId!, router)}>
              {query.incidentId}
            </Link>
          </div>
          <div ref={bottomRef}></div>
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

export default AIChatBox;
