import { Input, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { AiOutlineCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { type GenericObject } from "utils/types";

import styles from "../ProbeCreateForm.module.scss";
import { CONDITIONS, EQUALS, PROPERTIES } from "../ProbeCreateForm.utils";
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
      datatype: "",
    },
  ]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        property: "",
        operator: "",
        datatype: "",
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
    console.log({ index, name, value });
    setConditions(newConditions);
  };

  return (
    <div className={styles["condition-card"]}>
      {deleteCard && (
        <div
          className={styles["close-button-container"]}
          role="button"
          onClick={deleteCard}
        >
          <AiOutlineCloseCircle className={styles["close-button"]} />
        </div>
      )}
      <div className={styles["root-condition-container"]}>
        {includeAnd && (
          <JoiningSelect
            value="And"
            buttonMode={true}
            list={CONDITIONS}
            color="purple"
          />
        )}
        <JoiningSelect
          buttonMode={false}
          list={services}
          color="blue"
          value="Service"
        />
      </div>
      <div className={styles["condition-rows"]}>
        {conditions.map((condition, index) => {
          return (
            <div
              className={cx(
                styles["condition-card-item"],
                index === 0 && styles["condition-row-1"]
              )}
              key={nanoid()}
            >
              {index > 0 && (
                <JoiningSelect
                  list={CONDITIONS}
                  color="purple"
                  value="And"
                  buttonMode={true}
                />
              )}
              <Select
                defaultValue={null}
                variant="standard"
                name="property"
                className={styles["property-select"]}
                placeholder="Choose a property"
                value={conditions[index].property}
                onChange={(value) => {
                  updateValues(index, "property", value.target.value as string);
                }}
              >
                {PROPERTIES.map((prt) => {
                  return (
                    <MenuItem value={prt.value} key={nanoid()}>
                      {prt.label}
                    </MenuItem>
                  );
                })}
              </Select>

              {/* Operator */}
              <Select
                defaultValue={null}
                variant="standard"
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
                // value={}
                // onChange={(e) => {
                //   console.log({ e });
                //   updateValues(index, "value", e.target.value);
                // }}
              />

              {/* Delete */}
              {index !== 0 && (
                <AiOutlineDelete
                  className={styles["delete-button"]}
                  role="button"
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
