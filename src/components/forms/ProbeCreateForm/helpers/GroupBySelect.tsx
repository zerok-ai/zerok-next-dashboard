import { FormHelperText, MenuItem, Select } from "@mui/material";
import { PROTOCOLS } from "components/CreateNewIssueDrawer/CreateNewIssueDrawer.utils";
import { nanoid } from "nanoid";
import React from "react";

import styles from "../ProbeCreateForm.module.scss";
const GroupBySelect = () => {
  return (
    <div className={styles["group-by-container"]}>
      <p className={styles["group-by-title"]}>
        Group inferences by{" "}
        <span className={styles["group-by-link"]}>See how Group by works</span>
      </p>
      <Select
        variant="outlined"
        placeholder="Start typing..."
        className={styles["group-by-select"]}
      >
        {PROTOCOLS.map((pr) => {
          return (
            <MenuItem value={pr.value} key={nanoid()}>
              {pr.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText className={styles["group-by-helper-text"]}>
        eg: Service:Error code
      </FormHelperText>
    </div>
  );
};

export default GroupBySelect;
