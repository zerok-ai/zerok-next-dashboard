import { IconButton } from "@mui/material";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { HiOutlineTrash } from "react-icons/hi";
import { type ATTRIBUTE_PROTOCOLS } from "utils/probes/constants";
import {
  type AttributeProtocolType,
  type AttributeStateType,
} from "utils/probes/types";

import styles from "../ProbeCreateForm.module.scss";
import {
  getEmptyCondition,
  type ProbeFormType,
} from "../ProbeCreateForm.utils";
import ConditionRow from "./ConditionRow";
import JoiningSelect from "./JoiningSelect";

interface ConditionCardProps {
  services: Array<{
    label: string;
    value: string;
    protocol: (typeof ATTRIBUTE_PROTOCOLS)[number] | "";
    rootOnly?: boolean;
  }>;
  includeAnd: boolean;
  form: UseFormReturn<ProbeFormType, any, undefined>;
  loadingServices: boolean;
  currentCardKey: string;
  attributes: AttributeStateType | null;
  resetGroupBy: () => void;
  disabled?: boolean;
}

const ConditionCard = ({
  loadingServices,
  services,
  form,
  currentCardKey,
  attributes,
  resetGroupBy,
  disabled = false,
}: ConditionCardProps) => {
  const { setValue, getValues } = form;
  const cards = getValues("cards");
  const currentCardIndex = cards.findIndex((c) => c.key === currentCardKey);
  const currentCard = cards[currentCardIndex];
  const protocol = currentCard.protocol.toUpperCase() as AttributeProtocolType;
  const attributeOptions =
    attributes && protocol && attributes[protocol]
      ? [
          ...attributes[protocol].map((at) => {
            return [...at.attribute_list];
          }),
          ...attributes.GENERAL.map((at) => [...at.attribute_list]),
        ].flat()
      : [];

  const { rootProperty, conditions } = currentCard;
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

  const addConditon = () => {
    const newConditions = [...conditions, getEmptyCondition()];
    setValue(`cards.${currentCardIndex}.conditions`, newConditions);
  };

  return (
    <div className={styles["condition-card"]}>
      <div className={styles["root-condition-container"]}>
        <div className={styles["root-condition-selects"]}>
          <JoiningSelect
            disabled={disabled}
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
        {currentCardIndex !== 0 && !disabled && (
          <IconButton
            className={styles["delete-card-button"]}
            onClick={deleteCard}
            size="small"
            disabled={disabled}
          >
            <HiOutlineTrash />
          </IconButton>
        )}
      </div>
      <div className={styles["condition-rows"]}>
        {currentCard.conditions.map((cond, idx) => {
          return (
            <ConditionRow
              disabled={disabled}
              condition={cond}
              conditionIndex={idx}
              key={cond.key}
              currentCardKey={currentCardKey}
              attributeOptions={attributeOptions}
              form={form}
              resetGroupBy={resetGroupBy}
            />
          );
        })}
      </div>
      {!disabled && (
        <p
          className={styles["add-condition-button"]}
          role="button"
          onClick={addConditon}
        >
          + Condition
        </p>
      )}
    </div>
  );
};

export default ConditionCard;
