import TagX from "components/themeX/TagX";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { GENERIC_AVATAR, SLACK_LOGO } from "utils/images";

import { SLACK_CHANNELS } from "../ProbeCreateForm.utils";
import styles from "./SlackInput.module.scss";

interface SlackInputProps {
  channels: string[];
  addChannel: (channel: string) => void;
  deleteChannel: (channel: string) => void;
}

const InputComponent = ({
  addChannel,
  anchor,
}: {
  addChannel: (channel: string) => void;
  anchor: React.RefObject<HTMLDivElement>;
}) => {
  const [channel, setChannel] = useState("");
  const [isMenuOpen, toggleMenu] = useToggle(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const filteredChannels = channel.length
    ? SLACK_CHANNELS.filter((slc) => {
        return slc.value.toLowerCase().includes(channel.toLowerCase());
      })
    : SLACK_CHANNELS;
  return (
    <div>
      <input
        value={channel}
        ref={inputRef}
        onClick={() => {
          console.log("clicked");
        }}
        onFocus={() => {
          if (!isMenuOpen) {
            toggleMenu();
          }
        }}
        onChange={(e) => {
          setChannel(e.target.value);
          inputRef.current?.focus();
        }}
      />
      {isMenuOpen && (
        <div className={styles["channels-menu"]}>
          {filteredChannels.length !== 0 ? (
            filteredChannels.map((slc) => {
              console.log("slc", slc);
              return (
                <p
                  key={nanoid()}
                  role="button"
                  className={styles["channel-item"]}
                  onClick={() => {
                    addChannel(
                      `${slc.type === "channel" ? "#" : "@"}${slc.value}`
                    );
                    toggleMenu();
                    setChannel("");
                  }}
                >
                  <span
                    className={styles["channel-type"]}
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    {slc.type === "channel" ? (
                      " # "
                    ) : (
                      <img src={GENERIC_AVATAR} alt="avatar" />
                    )}
                  </span>
                  <span>{slc.value}</span>
                  {/* </p> */}
                </p>
              );
            })
          ) : (
            <p className={styles["channel-item"]}>No channels found</p>
          )}
        </div>
      )}
    </div>
  );
};

const SlackInput = ({
  channels,
  addChannel,
  deleteChannel,
}: SlackInputProps) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  console.log({ anchorRef }, "here", { channels });
  return (
    <div className={styles.container} ref={anchorRef}>
      <div className={styles["slack-title"]}>
        <span className={styles["slack-image"]}>
          <img src={SLACK_LOGO} alt="slack logo" />
        </span>{" "}
        Slack Recipients
      </div>
      <div className={styles["channels-container"]}>
        <div className={styles.channels}>
          {channels.map((channel) => {
            return (
              <TagX
                key={nanoid()}
                label={channel}
                closable={true}
                onClose={deleteChannel}
              />
            );
          })}
        </div>
        <div className={styles["channels-input"]}>
          <InputComponent addChannel={addChannel} anchor={anchorRef} />
        </div>
      </div>
    </div>
  );
};

export default SlackInput;
