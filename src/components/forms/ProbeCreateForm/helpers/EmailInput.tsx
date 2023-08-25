import cx from "classnames";
import TagX from "components/themeX/TagX";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { validateEmail } from "utils/functions";

import styles from "../ProbeCreateForm.module.scss";

interface EmailInputProps {
  emails: string[];
  addEmail: (email: string) => void;
  deleteEmail: (email: string) => void;
}

const EmailInput = ({ emails, addEmail, deleteEmail }: EmailInputProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onSubmit = () => {
    if (validateEmail(email)) {
      setError(false);
      addEmail(email);
      setEmail("");
      inputRef.current?.focus();
    } else {
      setError(true);
    }
  };

  const removeEmail = (email: string) => {
    deleteEmail(email);
    inputRef.current?.focus();
  };

  return (
    <div className={styles["email-container"]}>
      <label htmlFor="email">
        <HiOutlineMail className={styles["email-icon"]} /> Email Recipients
      </label>
      <div className={styles["email-input-container"]}>
        <div className={styles["emails-container"]}>
          {emails.map((email, index) => {
            return (
              <TagX
                key={index}
                label={email}
                closable={true}
                onClose={removeEmail}
              />
            );
          })}
        </div>
        <div>
          <input
            ref={inputRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            id="email"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                onSubmit();
              }
            }}
            onBlur={() => {
              setEmail("");
              setError(false);
            }}
            className={cx(error && styles["error-text"])}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailInput;
