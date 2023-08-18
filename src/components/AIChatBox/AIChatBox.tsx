// import cssVars from "styles/variables.module.scss";
import CustomSkeleton from "components/CustomSkeleton";
import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./ChatBoxDisplay.module.scss";

interface ChatBoxDisplayProps {
  text: string | null;
  animate: boolean;
  onTypeStart?: () => void;
  onTypeEnd?: () => void;
  header?: string;
  blink?: boolean;
}

const AIChatBox = ({
  text,
  blink = true,
  header,
  animate,
}: ChatBoxDisplayProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTypeStart = () => {
    timerRef.current = setInterval(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };
  const onTypeEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles["logo-container"]}>
        <div className={styles["chatbox-logo"]}>
          <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
        </div>
      </div>

      {text ? (
        <div className={styles["text-container"]}>
          {header && <h6>{header}</h6>}
          {animate ? (
            <TypeAnimation
              cursor={blink}
              sequence={[
                () => {
                  onTypeStart();
                },
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
