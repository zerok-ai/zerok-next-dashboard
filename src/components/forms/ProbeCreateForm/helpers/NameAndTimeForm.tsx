import { MenuItem, OutlinedInput, Select } from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";

import styles from "../ProbeCreateForm.module.scss";
import { PROBE_TIME_RANGES } from "../ProbeCreateForm.utils";

interface NameAndTimeFormProps {
  values: {
    title: string;
    time: string;
  };
  updateValues: (value: string, key: string) => void;
}

const NameAndTimeForm = ({ values, updateValues }: NameAndTimeFormProps) => {
  return (
    <div className={styles["name-form-container"]}>
      <div className={styles["name-form-item"]}>
        <label htmlFor="title">Name of the probe</label>
        <OutlinedInput
          placeholder="Give a unique name to your probe"
          className={styles["name-input"]}
          id="title"
          value={values.title}
          onChange={(e) => {
            updateValues("title", e.target.value);
          }}
        />
      </div>
      <div className={styles["name-form-item"]}>
        <label htmlFor="time">Probe active for</label>
        <Select
          defaultValue={PROBE_TIME_RANGES[0].value}
          className={styles["time-input"]}
          id="time"
          value={values.time}
          onChange={(e) => {
            updateValues(e.target.value, "time");
          }}
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
