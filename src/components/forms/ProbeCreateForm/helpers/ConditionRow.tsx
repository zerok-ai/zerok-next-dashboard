import { FormHelperText, Input, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import CustomCheckbox from "components/custom/CustomCheckbox";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import React, { Fragment } from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineX } from "react-icons/hi";
import { type AttributeType } from "utils/probes/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  type ConditionRowType,
  CONDITIONS,
  getInputTypeByDatatype,
  getOperatorByType,
  type ProbeFormType,
} from "../ProbeCreateForm.utils";
import JoiningSelect from "./JoiningSelect";

interface ConditionRowProps {
  attributeOptions: AttributeType[];
  form: UseFormReturn<ProbeFormType, any, undefined>;
  currentCardKey: string;
  resetGroupBy: () => void;
  condition: ConditionRowType;
  conditionIndex: number;
}

const ConditionRow = ({
  attributeOptions,
  form,
  currentCardKey,
  resetGroupBy,
  conditionIndex,
  condition,
}: ConditionRowProps) => {
  const {
    setValue,
    getValues,
    formState: { errors: formErrors },
  } = form;
  const cards = getValues("cards");
  const cardIndex = cards.findIndex((c) => c.key === currentCardKey);
  const currentCard = cards[cardIndex];
  const { rootProperty, conditions } = currentCard;
  const [jsonPathEnabled, toggleJsonPathEnabled] = useToggle(false);
  const getConditionErrors = (conditionIndex: number) => {
    if (
      formErrors.cards &&
      formErrors.cards[cardIndex] &&
      formErrors.cards[cardIndex]?.conditions &&
      formErrors.cards[cardIndex]?.conditions![conditionIndex]
    ) {
      return formErrors.cards[cardIndex]?.conditions![conditionIndex];
    } else {
      return {};
    }
  };
  const updateProperty = (value: string) => {
    const attribute = attributeOptions.find((at) => at.id === value);
    const datatype = attribute!.data_type;
    const executor = attribute!.executor;
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.property`, value);
    setValue(
      `cards.${cardIndex}.conditions.${conditionIndex}.datatype`,
      datatype
    );
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.operator`, "");
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.value`, "");
    setValue(
      `cards.${cardIndex}.conditions.${conditionIndex}.executor`,
      executor
    );
    resetGroupBy();
  };

  const updateOperator = (value: string) => {
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.operator`, value);
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.value`, "");
    if (value === "exists" || value === "not_exists") {
      setValue(`cards.${cardIndex}.conditions.${conditionIndex}.value`, value);
    }
  };

  const updateValue = (value: string) => {
    setValue(`cards.${cardIndex}.conditions.${conditionIndex}.value`, value);
  };

  const updateJsonpath = (value: string) => {
    setValue(
      `cards.${cardIndex}.conditions.${conditionIndex}.json_path`,
      value
    );
  };

  const deleteCondition = (conditionKey: string) => {
    const newConditions = conditions.filter((c) => c.key !== conditionKey);
    setValue(`cards.${cardIndex}.conditions`, newConditions);
  };
  const operators = getOperatorByType(condition.datatype);
  const property = attributeOptions.find((p) => {
    return p.id === condition.property;
  });
  const valueType = property?.input ?? "input";
  const helpText = "";
  const isJsonKeyAttribute =
    property?.supported_formats && property.supported_formats.includes(" JSON");
  const getSelectValues = () => {
    if (property?.input === "select") {
      try {
        return JSON.parse(property.values);
      } catch (err) {
        console.log({ err });
        return [];
      }
    } else if (property?.input === "bool") {
      return ["true", "false"];
    }
    return [];
  };
  const errors = getConditionErrors(cardIndex);
  const hideValueField =
    condition.operator === "exists" || condition.operator === "not_exists";
  return (
    <div
      className={cx(
        styles["condition-card-item"],
        conditionIndex === 0 && styles["condition-row-1"],
        isJsonKeyAttribute && jsonPathEnabled && styles["json-path-enabled"]
      )}
      key={condition.key}
    >
      {/* DUMMY AND BUTTON */}
      {conditionIndex > 0 && (
        <JoiningSelect
          list={CONDITIONS}
          color="purple"
          value="And"
          onSelect={null}
          buttonMode={true}
        />
      )}
      {/* PROPERTY / ATTRIBUTE with JSON path */}
      <div
        className={cx(
          styles["condition-item-container"],
          errors?.property && styles["error-input"]
        )}
      >
        <Select
          fullWidth
          disabled={!rootProperty.length}
          defaultValue=""
          variant="standard"
          name="property"
          className={cx(styles["property-select"])}
          placeholder="Choose a property"
          value={condition.property}
          onChange={(value) => {
            updateProperty(value.target.value);
          }}
        >
          {attributeOptions.map((at) => {
            return (
              <MenuItem value={at.id} key={at.id}>
                {at.field}
              </MenuItem>
            );
          })}
        </Select>
        {isJsonKeyAttribute && (
          <div className={cx(errors?.json_path && styles["error-input"])}>
            <div className={styles["checkbox-container"]}>
              <CustomCheckbox
                size="small"
                onChange={() => {
                  if (jsonPathEnabled) {
                    setValue(
                      `cards.${cardIndex}.conditions.${conditionIndex}.json_path`,
                      ""
                    );
                  }
                  toggleJsonPathEnabled();
                }}
                defaultChecked={jsonPathEnabled}
              />{" "}
              <small>Valuate this attribute with a JSON path</small>
            </div>
            {jsonPathEnabled && (
              <Fragment>
                <Input
                  name="json_path"
                  fullWidth
                  className={cx(styles["json-path-input"])}
                  placeholder="Enter the JSON path to access the key"
                  type={"text"}
                  defaultValue={""}
                  value={condition.json_path}
                  onChange={(e) => {
                    updateJsonpath(e.target.value);
                  }}
                />
                <FormHelperText
                  className={cx(styles["error-text"], styles["json-help-text"])}
                >
                  {errors?.json_path && (
                    <span>Please enter a valid json path.</span>
                  )}
                </FormHelperText>
              </Fragment>
            )}
          </div>
        )}
      </div>
      {/* OPERATOR */}
      <div
        className={cx(
          styles["condition-item-container"],
          errors?.operator && styles["error-input"]
        )}
      >
        <Select
          variant="standard"
          defaultValue=""
          fullWidth
          name="operator"
          disabled={!condition.property.length}
          className={cx(styles["operator-select"])}
          placeholder="Choose"
          value={condition.operator}
          onChange={(value) => {
            updateOperator(value.target.value);
          }}
        >
          {operators.map((prt) => {
            return (
              <MenuItem
                value={prt.value}
                key={nanoid()}
                className={styles["menu-item"]}
              >
                {prt.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      {!hideValueField && (
        <div
          className={cx(
            styles["condition-item-container"],
            errors?.value && styles["error-input"]
          )}
        >
          {valueType !== "select" && valueType !== "bool" ? (
            <Input
              name="value"
              fullWidth
              className={cx(styles["value-input"])}
              placeholder="Value"
              type={getInputTypeByDatatype(condition.datatype)}
              disabled={!condition.operator.length}
              value={condition.value}
              onChange={(e) => {
                updateValue(e.target.value);
              }}
            />
          ) : (
            <Select
              name="value"
              fullWidth
              variant="standard"
              disabled={!condition.operator.length}
              value={condition.value}
              onChange={(e) => {
                updateValue(e.target.value);
              }}
            >
              {getSelectValues().map((v: string) => {
                if (v.includes("*/*")) {
                  return null;
                }
                return (
                  <MenuItem
                    value={v}
                    key={nanoid()}
                    className={styles["menu-item"]}
                  >
                    {v}
                  </MenuItem>
                );
              })}
            </Select>
          )}
          {helpText.length > 0 && !errors?.value && (
            <FormHelperText>{helpText}</FormHelperText>
          )}
        </div>
      )}
      {/* DELETE ICON */}
      {conditionIndex !== 0 && (
        <HiOutlineX
          role="button"
          className={styles["delete-condition-button"]}
          onClick={() => {
            deleteCondition(condition.key);
          }}
        />
      )}
    </div>
  );
};

export default ConditionRow;
