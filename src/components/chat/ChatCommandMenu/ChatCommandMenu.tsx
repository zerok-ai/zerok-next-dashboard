import { Divider, Menu, MenuItem } from "@mui/material";
import { nanoid } from "nanoid";
import { Fragment } from "react";
import {
  CHAT_COMMAND_CHARACTER,
  CHAT_COMMANDS,
  CHAT_TAG,
  CHAT_TAG_CHARACTER,
} from "utils/gpt/constants";
import { type ChatCommandType, type ChatTagType } from "utils/gpt/types";
import { ZEROK_DRAWER_LOGO_MINIMIZED } from "utils/images";

import styles from "./ChatCommandMenu.module.scss";

interface ChatCommandMenuProps {
  input: string;
  onSelect: (command: string) => void;
  menuRef: React.RefObject<HTMLFormElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  lastItemRef: React.RefObject<HTMLLIElement>;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (val: boolean) => void;
}

const ChatCommandMenu = ({
  input,
  onSelect,
  menuRef,
  inputRef,
  lastItemRef,
  isMenuOpen,
  toggleMenu,
  setMenuOpen,
}: ChatCommandMenuProps) => {
  const renderCommand = (cmd: ChatCommandType) => {
    return (
      <div className={styles["command-container"]}>
        <span className={styles["command-logo"]}>
          <img src={ZEROK_DRAWER_LOGO_MINIMIZED} />
        </span>
        <div className={styles["command-description"]}>
          <p className={styles["command-title"]}>{cmd.label}</p>
          <small className={styles["command-subtitle"]}>{cmd.subtitle}</small>
        </div>
      </div>
    );
  };

  const selectItem = (label: string) => {
    onSelect(label);
    setMenuOpen(false);
  };

  const handleMouseClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: ChatCommandType | ChatTagType
  ) => {
    e.preventDefault();
    selectItem(item.label);
  };

  const EmptyItem = () => {
    return (
      <div>
        <MenuItem disabled>No results</MenuItem>
        <Divider />
      </div>
    );
  };

  const renderCommands = () => {
    if (!input || !isMenuOpen) return null;
    const search = input.substring(1);
    const fields = CHAT_COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase())
    );
    if (fields.length === 0) return <EmptyItem />;
    return fields.map((cmd, idx) => {
      const isLastItem = idx === fields.length - 1;
      return (
        <MenuItem
          key={cmd.label}
          className={styles["menu-item"]}
          onClick={(e) => {
            handleMouseClick(e, cmd);
          }}
          // onKeyDown={(e) => {
          //   handleKeyDown(e, isLastItem, cmd);
          // }}
          ref={isLastItem ? lastItemRef : null}
        >
          {renderCommand(cmd)}
        </MenuItem>
      );
    });
  };

  const renderTags = () => {
    if (!input || !isMenuOpen || !input.length) return null;
    const index = input.lastIndexOf(CHAT_TAG_CHARACTER);
    if (index === -1) return null;
    const search = input.substring(index + 1);
    const filter = CHAT_TAG.map((tag) => {
      const list = tag.list.filter((item) => {
        return item.label.toLowerCase().includes(search.toLowerCase());
      });
      return { ...tag, list };
    });
    return filter.map((group) => {
      return (
        <Fragment key={group.group}>
          <MenuItem disabled className={styles["group-title"]}>
            {group.group}
          </MenuItem>
          {group.list.length > 0 ? (
            <Fragment>
              {group.list.map((item, idx) => {
                const isLastItem = idx === group.list.length - 1;
                return (
                  <MenuItem
                    key={nanoid()}
                    className={styles["menu-item"]}
                    onClick={(e) => {
                      handleMouseClick(e, item);
                    }}
                    ref={isLastItem ? lastItemRef : null}
                  >
                    <div className={styles["tag-container"]}>
                      <span className={styles["tag-icon"]}></span>
                      <span>{item.label}</span>
                    </div>
                  </MenuItem>
                );
              })}
              <Divider />
            </Fragment>
          ) : (
            <EmptyItem />
          )}
        </Fragment>
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* <Autocomplete renderInput={()=><span>} */}
      <Menu
        anchorEl={menuRef.current}
        open={isMenuOpen}
        onClose={toggleMenu}
        hideBackdrop
        disableEnforceFocus
        disableAutoFocusItem
        disableAutoFocus
        autoFocus={false}
        transitionDuration={0}
        // disableAutoFocus
        className={styles.menu}
      >
        {input[0] === CHAT_COMMAND_CHARACTER ? renderCommands() : renderTags()}
      </Menu>
    </div>
  );
};

export default ChatCommandMenu;
