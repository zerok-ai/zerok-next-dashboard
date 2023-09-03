import { FormHelperText, OutlinedInput } from "@mui/material";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

import styles from "../ProbeCreateForm.module.scss";
import { type ProbeFormType } from "../ProbeCreateForm.utils";

interface NameAndTimeFormProps {
  form: UseFormReturn<ProbeFormType, any, undefined>;
}

const NameAndTimeForm = ({ form }: NameAndTimeFormProps) => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const { name } = getValues();
  return (
    <div className={styles["name-form-container"]}>
      <div className={styles["name-form-item"]}>
        <label htmlFor="title">Name of the probe</label>
        <div>
          <OutlinedInput
            placeholder="Give a unique name to your probe"
            className={styles["name-input"]}
            id="title"
            value={name}
            onChange={(e) => {
              setValue("name", e.target.value);
            }}
          />
          {errors.name && (
            <FormHelperText error>Probe name cannot be empty.</FormHelperText>
          )}
        </div>
      </div>
      {/* <div className={styles["name-form-item"]}>
        <label htmlFor="time-input">Probe active for</label>
        <Select
          defaultValue={PROBE_TIME_RANGES[0].value}
          className={styles["time-input"]}
          id="time-input"
          name="time-input"
          value={time}
          onChange={(e) => {
            setValue("time", e.target.value);
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
      </div> */}
    </div>
  );
};

export default NameAndTimeForm;
