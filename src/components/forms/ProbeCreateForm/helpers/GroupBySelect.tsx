import { FormHelperText, IconButton, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineTrash } from "react-icons/hi";
import { type ATTRIBUTE_PROTOCOLS } from "utils/probes/constants";
import { type AttributeStateType } from "utils/probes/types";

import styles from "../ProbeCreateForm.module.scss";
import { type ProbeFormType } from "../ProbeCreateForm.utils";

interface GroupBySelectProps {
  form: UseFormReturn<ProbeFormType, any, undefined>;
  currentGroupByKey: string;
  services: Array<{
    label: string;
    value: string;
    protocol: (typeof ATTRIBUTE_PROTOCOLS)[number] | "";
    rootOnly?: boolean;
  }>;
  attributes: AttributeStateType | null;
}

const GroupBySelect = ({
  form,
  services,
  currentGroupByKey,
  attributes,
}: GroupBySelectProps) => {
  const { setValue, getValues, formState } = form;
  const { cards, groupBy } = getValues();
  const currentGroupByIndex = groupBy.findIndex((g) => {
    return g.key === currentGroupByKey;
  });
  const values = getValues(`groupBy.${currentGroupByIndex}`);
  const emptyCard =
    cards.filter((card) => card.rootProperty !== "").length === 0;

  const errors = formState.errors.groupBy?.[currentGroupByIndex] ?? {};
  const isFirstIndex = currentGroupByIndex === 0;

  const updateValue = (key: "property" | "service", value: string) => {
    setValue(`groupBy.${currentGroupByIndex}.${key}`, value);
    if (key === "service") {
      const service = services.find((s) => s.value === value);
      setValue(`groupBy.${currentGroupByIndex}.protocol`, service!.protocol);
    }
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
          {errors[key]
            ? `Please select a ${key} to group by`
            : `Group by ${key}`}
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
  const attributeOptions =
    attributes && values.protocol && attributes[values.protocol]
      ? attributes[values.protocol]
          .map((attr) => {
            return attr.attribute_list.filter(
              (a) => a.input === "string" || a.input === "select"
            );
          })
          .flat()
      : [];
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
          {attributeOptions.map((attr) => {
            return (
              <MenuItem value={attr.id} key={attr.id}>
                {attr.field}
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
