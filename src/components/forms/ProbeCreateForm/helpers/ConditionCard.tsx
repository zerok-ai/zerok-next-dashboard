import {
  FormHelperText,
  IconButton,
  Input,
  MenuItem,
  Select,
} from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineTrash, HiOutlineX } from "react-icons/hi";
import { type SPAN_PROTOCOLS_TYPE } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  CONDITIONS,
  getEmptyCondition,
  getInputTypeByDatatype,
  getOperatorByType,
  getPropertyByType,
  type ProbeFormType,
} from "../ProbeCreateForm.utils";
import JoiningSelect from "./JoiningSelect";

interface ConditionCardProps {
  services: Array<{
    label: string;
    value: string;
    protocol: SPAN_PROTOCOLS_TYPE;
    rootOnly?: boolean;
  }>;
  includeAnd: boolean;
  form: UseFormReturn<ProbeFormType, any, undefined>;
  loadingServices: boolean;
  currentCardKey: string;
}

const ConditionCard = ({
  loadingServices,
  includeAnd,
  services,
  form,
  currentCardKey,
}: ConditionCardProps) => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const cards = getValues("cards");
  const currentCardIndex = cards.findIndex((c) => c.key === currentCardKey);
  const currentCard = cards[currentCardIndex];

  const { rootProperty, conditions } = currentCard;

  const properties = getPropertyByType(
    services.find((s) => s.value === rootProperty)?.protocol ?? null
  );

  const getServicesForRootProperty = () => {
    return services.filter((s) => {
      const cardRoots = cards.map((c) => c.rootProperty);
      return !cardRoots.includes(s.value);
    });
  };

  const deleteCard = () => {
    const newCards = cards.filter((c) => c.key !== currentCardKey);
    setValue("cards", newCards);
  };

  const getConditionErrors = (conditionIndex: number) => {
    if (
      errors.cards &&
      errors.cards[currentCardIndex] &&
      errors.cards[currentCardIndex]?.conditions &&
      errors.cards[currentCardIndex]?.conditions![conditionIndex]
    ) {
      return errors.cards[currentCardIndex]?.conditions![conditionIndex];
    } else {
      return {};
    }
  };

  const updateProperty = (conditionIndex: number, value: string) => {
    const datatype = properties.find((p) => p.value === value)?.type ?? "";
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.property`,
      value
    );
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.datatype`,
      datatype
    );
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.operator`,
      ""
    );
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.value`,
      ""
    );
  };

  const updateOperator = (conditionIndex: number, value: string) => {
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.operator`,
      value
    );
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.value`,
      ""
    );
  };

  const updateValue = (conditionIndex: number, value: string) => {
    setValue(
      `cards.${currentCardIndex}.conditions.${conditionIndex}.value`,
      value
    );
  };

  const deleteCondition = (conditionKey: string) => {
    const newConditions = conditions.filter((c) => c.key !== conditionKey);
    setValue(`cards.${currentCardIndex}.conditions`, newConditions);
  };

  const addConditon = () => {
    const newConditions = [...conditions, getEmptyCondition()];
    setValue(`cards.${currentCardIndex}.conditions`, newConditions);
  };

  return (
    <div className={styles["condition-card"]}>
      <div className={styles["root-condition-container"]}>
        <div className={styles["root-condition-selects"]}>
          {includeAnd && (
            <JoiningSelect
              value="And"
              buttonMode={true}
              list={CONDITIONS}
              color="purple"
              onSelect={null}
            />
          )}
          <JoiningSelect
            loading={loadingServices}
            buttonMode={false}
            list={getServicesForRootProperty()}
            color="blue"
            value={rootProperty.length ? rootProperty : "Service"}
            onSelect={(value) => {
              const service = services.find((s) => s.value === value);
              const protocol = service?.protocol ?? "";
              setValue(`cards.${currentCardIndex}.rootProperty`, value);
              setValue(`cards.${currentCardIndex}.protocol`, protocol);
            }}
          />
        </div>
        {currentCardIndex !== 0 && (
          <IconButton
            className={styles["delete-card-button"]}
            onClick={deleteCard}
            size="small"
          >
            <HiOutlineTrash />
          </IconButton>
        )}
      </div>
      <div className={styles["condition-rows"]}>
        {conditions.map((condition, index) => {
          const operators = getOperatorByType(condition.datatype);
          const property = properties.find((p) => {
            return p.value === condition.property;
          });
          const valueType = property?.type ?? "input";
          const helpText = property?.helpText ?? "";
          const getSelectValues = () => {
            if (
              property?.value === "destination" ||
              property?.value === "source"
            ) {
              return services.map((s) => {
                return {
                  label: s.label,
                  value: s.value,
                };
              });
            }
            return property?.options ?? [];
          };
          const errors = getConditionErrors(index);
          return (
            <div
              className={cx(
                styles["condition-card-item"],
                index === 0 && styles["condition-row-1"]
              )}
              key={condition.key}
            >
              {index > 0 && (
                <JoiningSelect
                  list={CONDITIONS}
                  color="purple"
                  value="And"
                  onSelect={null}
                  buttonMode={true}
                />
              )}
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
                  value={conditions[index].property}
                  onChange={(value) => {
                    updateProperty(index, value.target.value);
                  }}
                >
                  {properties.map((prt) => {
                    if (prt.groupByOnly) {
                      return null;
                    }
                    return (
                      <MenuItem
                        className={styles["menu-item"]}
                        value={prt.value}
                        key={nanoid()}
                      >
                        {prt.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
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
                  disabled={!conditions[index].property.length}
                  className={cx(styles["operator-select"])}
                  placeholder="Choose"
                  value={conditions[index].operator}
                  onChange={(value) => {
                    updateOperator(index, value.target.value);
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
              <div
                className={cx(
                  styles["condition-item-container"],
                  errors?.value && styles["error-input"]
                )}
              >
                {valueType !== "select" ? (
                  <Input
                    name="value"
                    fullWidth
                    className={cx(styles["value-input"])}
                    placeholder="Value"
                    type={getInputTypeByDatatype(conditions[index].datatype)}
                    disabled={!conditions[index].operator.length}
                    value={conditions[index].value}
                    onChange={(e) => {
                      updateValue(index, e.target.value);
                    }}
                  />
                ) : (
                  <Select
                    name="value"
                    fullWidth
                    variant="standard"
                    disabled={!conditions[index].operator.length}
                    value={conditions[index].value}
                    onChange={(e) => {
                      updateValue(index, e.target.value);
                    }}
                  >
                    {getSelectValues().map((v) => {
                      if (v.value.includes("*/*")) {
                        return null;
                      }
                      return (
                        <MenuItem
                          value={v.value}
                          key={nanoid()}
                          className={styles["menu-item"]}
                        >
                          {v.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                {helpText.length > 0 && !errors?.value && (
                  <FormHelperText>{helpText}</FormHelperText>
                )}
              </div>
              {index !== 0 && (
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
        })}
      </div>
      <p
        className={styles["add-condition-button"]}
        role="button"
        onClick={addConditon}
      >
        + Condition
      </p>
    </div>
  );
};

export default ConditionCard;
