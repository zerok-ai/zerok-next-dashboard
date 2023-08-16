import { IconButton, Input, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { HiOutlineTrash, HiOutlineX } from "react-icons/hi";
import { type GenericObject } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  CONDITIONS,
  EQUALS,
  getPropertyOptionLabel,
  PROPERTIES,
} from "../ProbeCreateForm.utils";
import JoiningSelect from "./JoiningSelect";

interface ConditionCardProps {
  services: Array<{ label: string; value: string }>;
  includeAnd: boolean;
  deleteCard: (() => void) | null;
}

const ConditionCard = ({
  includeAnd,
  deleteCard,
  services,
}: ConditionCardProps) => {
  const [conditions, setConditions] = useState<GenericObject[]>([
    {
      property: "",
      operator: "",
      value: "",
      datatype: "",
      key: nanoid(),
    },
  ]);

  const [rootProperty, setRootProperty] = useState<string | null>(null);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        property: "",
        operator: "",
        value: "",
        datatype: "",
        key: nanoid(),
      },
    ]);
  };

  const deleteCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const updateValues = (index: number, name: string, value: string) => {
    const newConditions = [...conditions];
    newConditions[index][name] = value;
    setConditions(newConditions);
  };
  console.log({ rootProperty, conditions });
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
            value={rootProperty ?? "Service"}
            onSelect={(value) => {
              setRootProperty(value);
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
              <Select
                defaultValue=""
                variant="standard"
                name="property"
                className={styles["property-select"]}
                placeholder="Choose a property"
                value={conditions[index].property}
                onChange={(value) => {
                  updateValues(index, "property", value.target.value as string);
                  updateValues(
                    index,
                    "datatype",
                    PROPERTIES.find((prt) => prt.value === value.target.value)
                      ?.type ?? ""
                  );
                }}
              >
                {PROPERTIES.map((prt) => {
                  return (
                    <MenuItem value={prt.value} key={nanoid()}>
                      {getPropertyOptionLabel(prt, rootProperty)}
                    </MenuItem>
                  );
                })}
              </Select>

              {/* Operator */}
              <Select
                variant="standard"
                defaultValue=""
                name="operator"
                className={styles["operator-select"]}
                placeholder="Choose"
                value={conditions[index].operator}
                onChange={(value) => {
                  updateValues(index, "operator", value.target.value as string);
                }}
              >
                {EQUALS.map((prt) => {
                  return (
                    <MenuItem value={prt.value} key={nanoid()}>
                      {prt.label}
                    </MenuItem>
                  );
                })}
              </Select>

              {/* Value */}
              <Input
                name="value"
                className={styles["value-input"]}
                placeholder="Value"
                value={conditions[index].value}
                onChange={(e) => {
                  updateValues(index, "value", e.target.value);
                }}
              />

              {/* Delete */}
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
