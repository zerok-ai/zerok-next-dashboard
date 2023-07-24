import { OutlinedInput } from "@mui/material";
import styles from "./IncidentChatTab.module.scss";
import { useState } from "react";
import { ICONS, ICON_BASE_PATH } from "utils/images";

export const UserQueryCard = ({ text }: { text: string }) => {
  return (
    <div className={styles["user-query-card"]}>
      <div className={styles["user-query-icon"]}>
        <img
          src={`/images/vectors/ai-user-avatar.svg`}
          alt={`user-avatar-icon`}
        />
      </div>
      <p className={styles["user-query-text"]}>{text}</p>
    </div>
  );
};

export const UserInputField = ({
  onSubmit,
}: {
  onSubmit: (val: string) => void;
}) => {
  const [userInput, setUserInput] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(userInput);
        setUserInput("");
      }}
      id="chat-form"
    >
      <button
        type="submit"
        style={{ width: "0", height: "0", opacity: "0" }}
        id="chat-form-btn"
      ></button>
      <OutlinedInput
        fullWidth
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        className={styles["chat-input"]}
        placeholder="Ask a query"
        endAdornment={
          <span
            className={styles["send-icon"]}
            role="button"
            onClick={() => {
              document.getElementById("chat-form-btn")?.click();
            }}
          >
            <img src={`${ICON_BASE_PATH}/${ICONS.send}`} alt="send_icon" />
          </span>
        }
      />
    </form>
  );
};
