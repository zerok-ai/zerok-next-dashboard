import { OutlinedInput } from "@mui/material";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onChange: (input: string) => void;
  inputState: string;
  placeholder?: string;
}

const SearchBar = ({ onChange, inputState, placeholder }: SearchBarProps) => {
  const SearchIcon = () => {
    return (
      <span className={styles["search-icon"]}>
        <img src={`${ICON_BASE_PATH}/${ICONS.search}`} alt="search-icon" />
      </span>
    );
  };
  return (
    <div className={styles.container}>
      <OutlinedInput
        placeholder={placeholder ?? "Search"}
        value={inputState}
        name="search-bar"
        fullWidth
        className={styles.input}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        endAdornment={<SearchIcon />}
      />
    </div>
  );
};

export default SearchBar;
