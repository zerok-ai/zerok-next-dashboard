import { Input, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

import styles from "../ProbeCreateForm.module.scss";
import { type ProbeFormType } from "../ProbeCreateForm.utils";

interface SamplingProps {
  form: UseFormReturn<ProbeFormType, any, undefined>;
  disabled: boolean;
}

const Sampling = ({ form, disabled = false }: SamplingProps) => {
  const {
    formState: { errors },
  } = form;
  return (
    <div className={styles["sampling-container"]}>
      Collect{" "}
      <div className={cx(errors.sampling?.samples && styles["error-input"])}>
        <Input
          {...form.register("sampling.samples", { valueAsNumber: true })}
          type="number"
          disabled={disabled}
        />
      </div>{" "}
      samples per{" "}
      <div className={cx(errors.sampling?.duration && styles["error-input"])}>
        <Input
          {...form.register("sampling.duration", { valueAsNumber: true })}
          type="number"
          disabled={disabled}
        />{" "}
      </div>
      <div className={cx(errors.sampling?.metric && styles["error-input"])}>
        <Select
          variant="standard"
          value={form.watch("sampling.metric")}
          {...form.register("sampling.metric")}
          className={cx(styles["sampling-select"])}
          disabled={disabled}
        >
          <MenuItem value="s">seconds</MenuItem>
          <MenuItem value="m">minutes</MenuItem>
          <MenuItem value="h">hours</MenuItem>
          <MenuItem value="d">days</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default Sampling;
