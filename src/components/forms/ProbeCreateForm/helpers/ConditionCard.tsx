import { IconButton, Input, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React from "react";
import { HiOutlineTrash, HiOutlineX } from "react-icons/hi";

import styles from "../ProbeCreateForm.module.scss";
import {
  type ConditionRowType,
  CONDITIONS,
  getInputTypeByDatatype,
  getOperatorByType,
  getPropertyByType,
} from "../ProbeCreateForm.utils";
import JoiningSelect from "./JoiningSelect";

interface ConditionCardProps {
  services: Array<{ label: string; value: string }>;
  includeAnd: boolean;
  deleteCard: (() => void) | null;
  conditions: ConditionRowType[];
  rootProperty: string;
  addCondition: () => void;
  deleteCondition: (index: number) => void;
  updateProperty: (
    conditionIndex: number,
    property: string,
    datatype: string
  ) => void;
  updateOperator: (conditionIndex: number, operator: string) => void;
  updateValue: (conditionIndex: number, value: string) => void;
  updateRootProperty: (value: string) => void;
}

const ConditionCard = ({
  includeAnd,
  deleteCard,
  services,
  conditions,
  rootProperty,
  addCondition,
  deleteCondition,
  updateProperty,
  updateOperator,
  updateValue,
  updateRootProperty,
}: ConditionCardProps) => {
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
            buttonMode={false}
            list={services}
            color="blue"
            value={rootProperty.length ? rootProperty : "Service"}
            onSelect={(value) => {
              updateRootProperty(value);
            }}
          />
        </div>
        {deleteCard && (
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
          const properties = getPropertyByType(rootProperty);
          const operators = getOperatorByType(condition.datatype);
          const { errors } = condition;
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
                  errors.property && styles["error-input"]
                )}
              >
                <Select
                  fullWidth
                  defaultValue=""
                  variant="standard"
                  name="property"
                  className={cx(
                    styles["property-select"],
                    errors.property && styles["error-input"]
                  )}
                  placeholder="Choose a property"
                  value={conditions[index].property}
                  onChange={(value) => {
                    updateProperty(
                      index,
                      value.target.value,
                      properties.find((p) => p.value === value.target.value)
                        ?.type ?? ""
                    );
                  }}
                >
                  {properties.map((prt) => {
                    return (
                      <MenuItem value={prt.value} key={nanoid()}>
                        {prt.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div
                className={cx(
                  styles["condition-item-container"],
                  errors.operator && styles["error-input"]
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
                      <MenuItem value={prt.value} key={nanoid()}>
                        {prt.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div
                className={cx(
                  styles["condition-item-container"],
                  errors.value && styles["error-input"]
                )}
              >
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
              </div>
              {index !== 0 && (
                <HiOutlineX
                  role="button"
                  className={styles["delete-condition-button"]}
                  onClick={() => {
                    deleteCondition(index);
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
        onClick={addCondition}
      >
        + Condition
      </p>
    </div>
  );
};

export default ConditionCard;
