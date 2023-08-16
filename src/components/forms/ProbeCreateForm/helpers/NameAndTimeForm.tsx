import { MenuItem, OutlinedInput, Select } from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";

import styles from "../ProbeCreateForm.module.scss";
import { PROBE_TIME_RANGES } from "../ProbeCreateForm.utils";

const NameAndTimeForm = () => {
  return (
    <div className={styles["name-form-container"]}>
      <div className={styles["name-form-item"]}>
        <label htmlFor="name">Name of the probe</label>
        <OutlinedInput
          placeholder="Give a unique name to your probe"
          className={styles["name-input"]}
          id="name"
        />
      </div>
      <div className={styles["name-form-item"]}>
        <label htmlFor="time">Probe active for</label>
        <Select
          defaultValue={PROBE_TIME_RANGES[0].value}
          className={styles["time-input"]}
          id="time"
        >
          {PROBE_TIME_RANGES.map((range) => {
            return (
              <MenuItem value={range.value} key={nanoid()}>
                {range.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    </div>
  );
};

export default NameAndTimeForm;
