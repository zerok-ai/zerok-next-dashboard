import { useEffect } from "react";
import { gsap, Elastic } from "gsap";
import cx from "classnames";
import styles from "./ChatLoader.module.scss";

const ChatLoader = () => {
  useEffect(() => {
    const loaderNine = document.querySelectorAll(".loader");
    const dotsNine = document.querySelectorAll(".dot");
    const tlNine = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
    });

    tlNine
      .staggerFrom(
        dotsNine,
        1,
        {
          autoAlpha: 0,
          scale: 0.1,
          ease: Elastic.easeOut,
        },
        0.2
      )
      .staggerTo(
        dotsNine,
        0.1,
        {
          backgroundColor: "#2b4d66",
        },
        0.1
      )
      .to(loaderNine, 0.2, {
        autoAlpha: 0,
        scale: 0,
      });
  }, []);

  return (
    <div className="loader">
      <div className={cx("dot", styles.dot)}></div>
      <div className={cx("dot", styles.dot)}></div>
      <div className={cx("dot", styles.dot)}></div>
    </div>
  );
};

export default ChatLoader;
