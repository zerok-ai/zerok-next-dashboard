import {
  Divider,
  FormHelperText,
  Input,
  MenuItem,
  Select,
} from "@mui/material";
import cx from "classnames";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineX } from "react-icons/hi";
import { ATTRIBUTE_SUPPORTED_FORMATS } from "utils/probes/constants";
import {
  type AttributeSupportedType,
  type AttributeType,
} from "utils/probes/types";

import styles from "../ProbeCreateForm.module.scss";
import { type ConditionOperatorType } from "../ProbeCreateForm.types";
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
  disabled?: boolean;
}

const ConditionRow = ({
  attributeOptions,
  disabled = false,
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
  const [jsonPathEnabled, , setJsonpathEnabled] = useToggle(false);
  const [attributeFormat, setAttributeFormat] = useState<
    AttributeSupportedType | ""
  >("");

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

  const updateOperator = (
    value: string | AttributeType,
    type: "all" | "data"
  ) => {
    // @ts-expect-error expected
    if (ATTRIBUTE_SUPPORTED_FORMATS.includes(value)) {
      setJsonpathEnabled(true);
      setAttributeFormat(value as AttributeSupportedType);
      setValue(`cards.${cardIndex}.conditions.${conditionIndex}.operator`, "");
    } else {
      if (type === "all") {
        setJsonpathEnabled(false);
        setAttributeFormat("");
      }
      setValue(
        `cards.${cardIndex}.conditions.${conditionIndex}.operator`,
        value as string
      );
      setValue(`cards.${cardIndex}.conditions.${conditionIndex}.value`, "");
      if (value === "exists" || value === "not_exists") {
        setValue(
          `cards.${cardIndex}.conditions.${conditionIndex}.value`,
          value
        );
      }
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
  useEffect(() => {
    if (disabled && condition.json_path && condition.json_path.length > 0) {
      setAttributeFormat("JSON");
      setJsonpathEnabled(true);
      setValue(
        `cards.${cardIndex}.conditions.${conditionIndex}.json_path`,
        condition.json_path
      );
    }
  }, [condition]);

  const deleteCondition = (conditionKey: string) => {
    const newConditions = conditions.filter((c) => c.key !== conditionKey);
    setValue(`cards.${cardIndex}.conditions`, newConditions);
  };
  const property = attributeOptions.find((p) => {
    return p.id === condition.property;
  });
  const allOperators = getOperatorByType(
    condition.datatype,
    property?.supported_formats ?? []
  );
  const dataOperators = getOperatorByType(condition.datatype, []);
  const valueType = property?.input ?? "input";
  const helpText = "";
  const isJsonKeyAttribute =
    property?.supported_formats && property.supported_formats.includes("JSON");
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

  const renderOperatorSelect = (
    list: ConditionOperatorType[],
    type: "all" | "data"
  ) => {
    const value =
      type === "all"
        ? (attributeFormat as string).length
          ? attributeFormat
          : condition.operator
        : condition.operator;
    return (
      <Select
        variant="standard"
        defaultValue=""
        fullWidth
        disabled={!condition.property.length || disabled}
        MenuProps={{
          disableAutoFocus: true,
        }}
        name="operator"
        className={cx(styles["operator-select"])}
        placeholder="Choose"
        value={value}
        onChange={(value) => {
          updateOperator(value.target.value, type);
        }}
      >
        {list.map((prt) => {
          if (prt.divider) {
            return <Divider key={nanoid()} />;
          }
          if (prt.title) {
            return (
              <p
                key={nanoid()}
                autoFocus={false}
                className={styles["menu-item-title"]}
              >
                {prt.title}
              </p>
            );
          }
          if (prt.value) {
            return (
              <MenuItem
                value={prt.value}
                key={nanoid()}
                className={styles["menu-item"]}
              >
                {prt.label}
              </MenuItem>
            );
          }
          return null;
        })}
      </Select>
    );
  };
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
          disabled={disabled}
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
          disabled={!rootProperty.length || disabled}
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
        {jsonPathEnabled && (
          <div className={cx(errors?.json_path && styles["error-input"])}>
            <Input
              name="json_path"
              fullWidth
              className={cx(styles["json-path-input"])}
              placeholder="Enter the JSON path to access the key"
              type={"text"}
              value={condition.json_path}
              disabled={disabled}
              onChange={(e) => {
                updateJsonpath(e.target.value);
              }}
            />
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
        <div className={styles["all-operators"]}>
          {renderOperatorSelect(allOperators, "all")}
        </div>
        <div className={styles["data-operators"]}>
          {(attributeFormat as string).length > 0 &&
            jsonPathEnabled &&
            renderOperatorSelect(dataOperators, "data")}
        </div>
      </div>
      {!hideValueField && (
        <div
          className={cx(
            styles["condition-item-container"],
            errors?.value && styles["error-input"],
            styles["value-container"]
          )}
        >
          {valueType !== "select" && valueType !== "bool" ? (
            <Input
              name="value"
              fullWidth
              className={cx(styles["value-input"])}
              placeholder="Value"
              type={getInputTypeByDatatype(condition.datatype)}
              disabled={!condition.operator.length || disabled}
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
              disabled={!condition.operator.length || disabled}
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
          className={cx(
            styles["delete-condition-button"],
            disabled && styles["delete-condition-button-disabled"]
          )}
          onClick={() => {
            if (!disabled) {
              deleteCondition(condition.key);
            }
          }}
        />
      )}
    </div>
  );
};

export default ConditionRow;
