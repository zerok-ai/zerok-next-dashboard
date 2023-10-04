import { Divider, Menu, MenuItem } from "@mui/material";
import {
  CHAT_COMMANDS,
  CHAT_TAG_CHARACTER,
  SLACK_ITEMS,
} from "utils/gpt/constants";
import { type ChatCommandType, type ChatTagType } from "utils/gpt/types";
import { ZEROK_DRAWER_LOGO_MINIMIZED } from "utils/images";
import { type GenericObject } from "utils/types";

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

  const handleMouseClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: ChatCommandType | ChatTagType
  ) => {
    e.preventDefault();
    onSelect(item.value);
    setMenuOpen(false);
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
    if (input[0] === CHAT_TAG_CHARACTER) {
      return SLACK_ITEMS.map((item: GenericObject, idx: number) => {
        if (item.disabled) {
          return (
            <MenuItem key={idx} disabled>
              {item.label}
            </MenuItem>
          );
        }
        if (item.divider) {
          return <Divider key={idx} />;
        }
        return (
          <MenuItem
            key={idx}
            className={styles["menu-item"]}
            onClick={(e) => {
              handleMouseClick(e, {
                label: item.label,
                value: `${CHAT_TAG_CHARACTER}${item.label as string}`,
              });
            }}
          >
            {item.label}
          </MenuItem>
        );
      });
    } else {
      const search = input.substring(1);
      const fields = CHAT_COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
      );
      if (fields.length === 0) return <EmptyItem />;
      return fields.map((cmd, idx) => {
        const isLastItem = idx === fields.length - 1;
        return (
          <MenuItem
            key={cmd.value}
            className={styles["menu-item"]}
            onClick={(e) => {
              handleMouseClick(e, cmd);
            }}
            ref={isLastItem ? lastItemRef : null}
          >
            {renderCommand(cmd)}
          </MenuItem>
        );
      });
    }
  };

  return (
    <div className={styles.container}>
      <Menu
        anchorEl={menuRef.current}
        open={isMenuOpen}
        onClose={toggleMenu}
        transitionDuration={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        // disableAutoFocus
        className={styles.menu}
      >
        {renderCommands()}
      </Menu>
    </div>
  );
};

export default ChatCommandMenu;
