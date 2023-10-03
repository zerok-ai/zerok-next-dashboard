import { Divider, Menu, MenuItem } from "@mui/material";
import { CHAT_COMMANDS } from "utils/gpt/constants";
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
    selectItem(item.value);
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
  };

  return (
    <div className={styles.container}>
      <Menu
        anchorEl={menuRef.current}
        open={isMenuOpen}
        onClose={toggleMenu}
        transitionDuration={0}
        // disableAutoFocus
        className={styles.menu}
      >
        {renderCommands()}
      </Menu>
    </div>
  );
};

export default ChatCommandMenu;
