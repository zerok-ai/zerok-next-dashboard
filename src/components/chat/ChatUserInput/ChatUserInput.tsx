import { OutlinedInput } from "@mui/material";
import ChatCommandMenu from "components/chat/ChatCommandMenu";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { addTagCard } from "redux/chat/chatSlice";
import { useDispatch, useSelector } from "redux/store";
import { postChatQuery, postNewChatEvent } from "redux/thunks/chat";
import {
  CHAT_COMMAND_CHARACTER,
  CHAT_EVENTS,
  CHAT_TAG_CHARACTER,
} from "utils/gpt/constants";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ChatUserInput.module.scss";

const ChatUserInput = ({
  disabled,
  incidentId,
}: {
  disabled: boolean;
  incidentId: string;
}) => {
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLFormElement>(null);
  const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false);
  const lastItemRef = useRef<HTMLLIElement>(null);

  const { selectedCluster } = useSelector((state) => state.cluster);
  const { contextIncident } = useSelector((state) => state.chat);
  const router = useRouter();
  const issueId = router.query.issue_id;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInput[0] === CHAT_COMMAND_CHARACTER && userInput.length === 1) {
      setMenuOpen(true);
      return;
    }
    if (userInput[0] === CHAT_TAG_CHARACTER && userInput.length === 1) {
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
      handleInputSubmit(command);
      setMenuOpen(false);
    } else if (userInput[0] === CHAT_TAG_CHARACTER) {
      setUserInput(command.trim());
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
      setMenuOpen(false);
    }
  };

  const handleInputSubmit = async (val: string) => {
    if (disabled) {
      return;
    }
    if (selectedCluster) {
      if (val === `/${CHAT_EVENTS.CONTEXT_SWITCH}`) {
        dispatch(
          postNewChatEvent({
            selectedCluster,
            issueId: issueId as string,
            incidentId: contextIncident as string,
            type: CHAT_EVENTS.CONTEXT_SWITCH,
            newIncident: (router.query.trace ?? router.query.latest) as string,
          })
        );
      } else if (val === `/${CHAT_EVENTS.INFERENCE}`) {
        dispatch(
          postNewChatEvent({
            selectedCluster,
            issueId: issueId as string,
            incidentId,
            type: CHAT_EVENTS.INFERENCE,
          })
        );
      } else if (val === `/${CHAT_EVENTS.POSTMORTEM}`) {
        console.log({ val });
      } else if (val.includes(`${CHAT_TAG_CHARACTER}`)) {
        dispatch(addTagCard(val));
      } else {
        dispatch(
          postChatQuery({
            selectedCluster,
            query: val,
            issueId: issueId as string,
            uid: nanoid(),
            incidentId,
          })
        );
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleInputSubmit(userInput);
        setUserInput("");
      }}
      id="chat-form"
      className={styles.container}
      ref={menuRef}
    >
      <button
        type="submit"
        style={{ width: "0", height: "0", opacity: "0", display: "none" }}
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
        autoComplete={"off"}
        autoFocus={false}
        autoCorrect="false"
        autoCapitalize="false"
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

export default ChatUserInput;
