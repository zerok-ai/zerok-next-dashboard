import { FormHelperText, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React from "react";
import { type SPAN_PROTOCOLS_TYPE } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  type ConditionCardType,
  getPropertyByType,
  type GroupByType,
} from "../ProbeCreateForm.utils";

interface GroupBySelectProps {
  cards: ConditionCardType[];
  updateValue: (key: "service" | "property", value: string | number) => void;
  values: GroupByType;
  services: Array<{
    label: string;
    value: string;
    protocol: SPAN_PROTOCOLS_TYPE;
  }>;
}

const GroupBySelect = ({
  cards,
  updateValue,
  values,
  services,
}: GroupBySelectProps) => {
  const emptyCard =
    cards.filter((card) => card.rootProperty !== "").length === 0;
  const cardProperties = getPropertyByType(
    services.find((s) => {
      return values.property === s.value;
    })?.protocol ?? null
  );
  return (
    <div className={styles["group-by-container"]}>
      <p className={styles["group-by-title"]}>
        Group inferences by{" "}
        <span className={styles["group-by-link"]}>See how Group by works</span>
      </p>
      <div className={styles["group-by-selects"]}>
        <div className={styles["group-by-select-container"]}>
          <Select
            disabled={emptyCard}
            defaultValue={""}
            fullWidth
            value={values.service?.toString() ?? ""}
            className={styles["group-by-select"]}
            variant="outlined"
            onChange={(e) => {
              updateValue("service", e.target.value);
            }}
          >
            {cards.map((card, idx) => {
              return (
                <MenuItem value={idx} key={card.key}>
                  {card.rootProperty}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText
            className={cx(
              styles["group-by-helper-text"],
              values.errors.service && styles["error-text"]
            )}
          >
            {values.errors.service
              ? `Please select a service to group by`
              : `Service name`}
          </FormHelperText>
        </div>
        <div className={styles["group-by-select-container"]}>
          <Select
            defaultValue=""
            variant="outlined"
            onChange={(e) => {
              updateValue("property", e.target.value);
            }}
            placeholder="Start typing..."
            className={styles["group-by-select"]}
            disabled={values.service === null}
          >
            {cardProperties.length > 0 &&
              cardProperties.map((pr) => {
                return (
                  <MenuItem value={pr.value} key={nanoid()}>
                    {pr.label}
                  </MenuItem>
                );
              })}
          </Select>
          <FormHelperText
            className={cx(
              styles["group-by-helper-text"],
              values.errors.property && styles["error-text"]
            )}
          >
            {values.errors.property
              ? `Please select a property to group by`
              : `Property - eg: Latency`}
          </FormHelperText>
        </div>
      </div>
    </div>
  );
};

export default GroupBySelect;
