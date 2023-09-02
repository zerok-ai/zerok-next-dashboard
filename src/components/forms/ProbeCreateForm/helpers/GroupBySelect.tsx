import { FormHelperText, IconButton, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineTrash } from "react-icons/hi";
import { type SPAN_PROTOCOLS_TYPE } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  getPropertyByType,
  type ProbeFormType,
} from "../ProbeCreateForm.utils";

interface GroupBySelectProps {
  form: UseFormReturn<ProbeFormType, any, undefined>;
  currentGroupByKey: string;
  services: Array<{
    label: string;
    value: string;
    protocol: SPAN_PROTOCOLS_TYPE;
    rootOnly?: boolean;
  }>;
}

const GroupBySelect = ({
  form,
  services,
  currentGroupByKey,
}: GroupBySelectProps) => {
  const { setValue, getValues, formState } = form;
  const { cards, groupBy } = getValues();
  const currentGroupByIndex = groupBy.findIndex((g) => {
    return g.key === currentGroupByKey;
  });
  const values = getValues(`groupBy.${currentGroupByIndex}`);
  const emptyCard =
    cards.filter((card) => card.rootProperty !== "").length === 0;
  const cardProperties = getPropertyByType(
    services.find((s, idx) => {
      return s.value === values.service;
    })?.protocol ?? null
  );

  const errors = formState.errors.groupBy?.[currentGroupByIndex] ?? {};
  const isFirstIndex = currentGroupByIndex === 0;

  const updateValue = (key: "property" | "service", value: string) => {
    setValue(`groupBy.${currentGroupByIndex}.${key}`, value);
  };

  const deleteGroupBy = () => {
    const newGroupBy = groupBy.filter((g) => g.key !== currentGroupByKey);
    setValue("groupBy", newGroupBy);
  };

  const renderHelperText = (key: "service" | "property") => {
    if (currentGroupByIndex === 0) {
      return (
        <FormHelperText
          className={cx(
            styles["group-by-helper-text"],
            errors[key] && styles["error-text"]
          )}
        >
          {errors[key] ? `Please select a ${key} to group by` : `Service name`}
        </FormHelperText>
      );
    } else {
      return (
        errors[key] && (
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
        isFirstIndex && styles["group-by-first-row"]
      )}
    >
      <div className={styles["group-by-select-container"]}>
        <Select
          disabled={emptyCard}
          defaultValue={""}
          fullWidth
          value={values.service ?? ""}
          name="group-service"
          className={styles["group-by-select"]}
          variant="outlined"
          onChange={(e) => {
            updateValue("service", e.target.value);
          }}
        >
          {cards.map((card, idx) => {
            const service = services.find((s) => s.value === card.rootProperty);
            const label = service?.label;
            return (
              <MenuItem
                value={card.rootProperty}
                key={card.key}
                className={styles["menu-item"]}
              >
                {label}
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
          name="group-property"
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
                <MenuItem
                  value={pr.value}
                  key={nanoid()}
                  className={styles["menu-item"]}
                >
                  {pr.label}
                </MenuItem>
              );
            })}
        </Select>
        {renderHelperText("property")}
      </div>
      {!isFirstIndex && (
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
