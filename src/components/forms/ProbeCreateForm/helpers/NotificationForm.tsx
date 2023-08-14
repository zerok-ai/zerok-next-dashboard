import React, { useState } from "react";

import styles from "../ProbeCreateForm.module.scss";
import EmailInput from "./EmailInput";
import SlackInput from "./SlackInput";

const NotificationForm = () => {
  const [emails, setEmails] = useState<string[]>([
    "tech@zerok.ai",
    "varun@zerok.ai",
  ]);
  const [channels, setChannels] = useState<string[]>(["#tech"]);

  const addEmail = (email: string) => {
    setEmails([...emails, email]);
  };
  const deleteEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };
  const addChannel = (channel: string) => {
    console.log("ADDING");
    setChannels([...channels, channel]);
  };
  const deleteChannel = (channel: string) => {
    setChannels(channels.filter((c) => c !== channel));
  };
  return (
    <div className={styles["notification-form-container"]}>
      <p className={styles["notification-form-title"]}>
        Notify me of a ZeroK Inference here
      </p>
      <EmailInput
        emails={emails}
        addEmail={addEmail}
        deleteEmail={deleteEmail}
      />
      <SlackInput
        channels={channels}
        addChannel={addChannel}
        deleteChannel={deleteChannel}
      />
    </div>
  );
};

export default NotificationForm;
