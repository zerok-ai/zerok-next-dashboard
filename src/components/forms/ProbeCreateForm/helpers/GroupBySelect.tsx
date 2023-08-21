import { FormHelperText, IconButton, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { type SPAN_PROTOCOLS_TYPE } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  type ConditionCardType,
  getPropertyByType,
  type GroupByType,
} from "../ProbeCreateForm.utils";

interface GroupBySelectProps {
  cards: ConditionCardType[];
  updateValue: (key: "service" | "property", value: string) => void;
  values: GroupByType;
  isFirstRow: boolean;
  deleteGroupBy: () => void;
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
  isFirstRow,
  deleteGroupBy,
}: GroupBySelectProps) => {
  const emptyCard =
    cards.filter((card) => card.rootProperty !== "").length === 0;
  const cardProperties = getPropertyByType(
    services.find((s, idx) => {
      return s.value === values.service;
    })?.protocol ?? null
  );

  const renderHelperText = (key: "service" | "property") => {
    if (isFirstRow) {
      return (
        <FormHelperText
          className={cx(
            styles["group-by-helper-text"],
            values.errors.service && styles["error-text"]
          )}
        >
          {values.errors[key]
            ? `Please select a ${key} to group by`
            : `Service name`}
        </FormHelperText>
      );
    } else {
      return (
        values.errors[key] && (
          <FormHelperText
            className={cx(styles["group-by-helper-text"], styles["error-text"])}
          >
            {`Please select a ${key} to group by`}
          </FormHelperText>
        )
      );
    }
  };
  return (
    <div
      className={cx(
        styles["group-by-row"],
        isFirstRow && styles["group-by-first-row"]
      )}
    >
      <div className={styles["group-by-select-container"]}>
        <Select
          disabled={emptyCard}
          defaultValue={""}
          fullWidth
          value={values.service ?? ""}
          className={styles["group-by-select"]}
          variant="outlined"
          onChange={(e) => {
            updateValue("service", e.target.value);
          }}
        >
          {cards.map((card, idx) => {
            return (
              <MenuItem value={card.rootProperty} key={card.key}>
                {card.rootProperty}
              </MenuItem>
            );
          })}
        </Select>
        {renderHelperText("service")}
      </div>
      <div className={styles["group-by-select-container"]}>
        <Select
          defaultValue=""
          fullWidth
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
        {renderHelperText("property")}
      </div>
      {!isFirstRow && (
        <IconButton
          size="small"
          className={styles["delete-group-by-button"]}
          onClick={deleteGroupBy}
        >
          <HiOutlineTrash />
        </IconButton>
      )}
    </div>
  );
};

export default GroupBySelect;
