import { OutlinedInput } from "@mui/material";
import ChatCommandMenu from "components/ChatCommandMenu";
import { useToggle } from "hooks/useToggle";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_COMMAND_CHARACTER,
  CHAT_TAG_CHARACTER,
} from "utils/gpt/constants";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./IncidentChatTab.module.scss";

export const UserQueryCard = ({
  text,
  tagCard,
}: {
  text: string;
  tagCard: boolean;
}) => {
  const getText = () => {
    if (!tagCard) {
      return text;
    }
    const words = text.split(" ");
    return (
      <span>
        {words.map((word, index) => {
          if (word[0] === CHAT_TAG_CHARACTER) {
            if (words.length === 1) {
              return (
                <span key={index}>
                  <span className={styles["tag-text"]}>{word}</span> has entered
                  the workspace.
                </span>
              );
            }
            return (
              <span key={index} className={styles["tag-text"]}>
                {word}
              </span>
            );
          }
          return <span key={index}> {word} </span>;
        })}
      </span>
    );
  };

  return (
    <div className={styles["user-query-card"]}>
      <div className={styles["user-query-icon"]}>
        <img
          src={`/images/vectors/ai-user-avatar.svg`}
          alt={`user-avatar-icon`}
        />
      </div>
      <p className={styles["user-query-text"]}>{getText()}</p>
    </div>
  );
};

export const UserInputField = ({
  onSubmit,
  disabled,
}: {
  onSubmit: (val: string) => void;
  disabled: boolean;
}) => {
  const [userInput, setUserInput] = useState("");
  const [tagCount, setTagCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLFormElement>(null);
  const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false);
  const lastItemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const countTags = () => {
      let count = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === CHAT_TAG_CHARACTER) {
          count++;
        }
      }
      return count;
    };
    if (userInput[0] === CHAT_COMMAND_CHARACTER && userInput.length === 1) {
      setMenuOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return;
    }
    if (userInput.includes(CHAT_TAG_CHARACTER) && countTags() > tagCount) {
      setMenuOpen(true);
      return;
    }
    if (userInput.length === 0) {
      setMenuOpen(false);
      inputRef.current?.focus();
    }
  }, [userInput]);

  const handleCommand = (command: string) => {
    if (userInput[0] === CHAT_COMMAND_CHARACTER) {
      setUserInput("");
      setMenuOpen(false);
    } else {
      setUserInput((old) => {
        const lastIndex =
          old.lastIndexOf(CHAT_TAG_CHARACTER) >= 0
            ? old.lastIndexOf(CHAT_TAG_CHARACTER)
            : 0;
        const preCommand = old.substring(0, lastIndex);
        return `${preCommand}@${command}`;
      });
      setTagCount((old) => old + 1);
      setMenuOpen(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(userInput);
        setUserInput("");
        setTagCount(0);
      }}
      id="chat-form"
      className={styles["input-container"]}
      ref={menuRef}
    >
      <button
        type="submit"
        style={{ width: "0", height: "0", opacity: "0" }}
        id="chat-form-btn"
      ></button>

      <ChatCommandMenu
        input={userInput}
        onSelect={handleCommand}
        menuRef={menuRef}
        inputRef={inputRef}
        lastItemRef={lastItemRef}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        setMenuOpen={setMenuOpen}
      />

      <OutlinedInput
        fullWidth
        inputRef={inputRef}
        name="main-chat-input"
        value={userInput}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            lastItemRef.current?.focus();
          }
        }}
        disabled={disabled}
        onChange={(e) => {
          setUserInput(e.target.value);
          inputRef.current?.focus();
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
