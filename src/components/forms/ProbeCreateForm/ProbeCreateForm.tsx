import { Button } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import {
  filterServices,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
// import raxios from "utils/raxios";
import { CREATE_PROBE_ENDPOINT } from "utils/scenarios/endpoints";
import { type GenericObject, type ServiceDetail } from "utils/types";

import ConditionCard from "./helpers/ConditionCard";
import GroupBySelect from "./helpers/GroupBySelect";
import NameAndTimeForm from "./helpers/NameAndTimeForm";
import NotificationForm from "./helpers/NotificationForm";
import styles from "./ProbeCreateForm.module.scss";
import {
  buildProbeBody,
  type ConditionCardType,
  type ConditionRowStrings,
  getEmptyCard,
  getEmptyCondition,
  getEmptyGroupBy,
  type GroupByType,
} from "./ProbeCreateForm.utils";

const formatServices = (services: ServiceDetail[]) => {
  const filter = services.filter((sv) => sv.protocol);
  return filter.map((sv) => {
    return {
      label: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
      value: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
      protocol: sv.protocol ?? "http",
    };
  });
};

const ProbeCreateForm = () => {
  const [cards, setCards] = useState<ConditionCardType[]>([getEmptyCard()]);
  const { selectedCluster } = useSelector(clusterSelector);
  const {
    data: services,
    fetchData: fetchServices,
    loading: loadingServices,
  } = useFetch<ServiceDetail[]>("results", null, filterServices);
  const [nameForm, setNameForm] = useState<{
    title: string;
    time: string;
    error: boolean;
  }>({
    title: "",
    time: DEFAULT_TIME_RANGE,
    error: false,
  });
  const router = useRouter();

  const [groupBy, setGroupBy] = useState<GroupByType[]>([getEmptyGroupBy()]);

  const updateNameForm = (key: string, value: string) => {
    setNameForm({ ...nameForm, [key]: value, error: false });
  };

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SERVICES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{range}", DEFAULT_TIME_RANGE);
      fetchServices(endpoint);
    }
  }, [selectedCluster]);

  const addCard = () => {
    setCards([...cards, getEmptyCard()]);
  };

  const deleteCard = (key: string) => {
    setCards(cards.filter((c, i) => c.key !== key));
  };

  const addGroupBy = () => {
    setGroupBy([...groupBy, getEmptyGroupBy()]);
  };

  const deleteGroupBy = (key: string) => {
    setGroupBy(groupBy.filter((g, i) => g.key !== key));
  };

  const addCondition = (idx: number) => {
    const newCards = [...cards];
    newCards[idx].conditions.push(getEmptyCondition());
    setCards(newCards);
  };

  const deleteCondition = (cardIndex: number, conditionIndex: number) => {
    const newCards = [...cards];
    newCards[cardIndex].conditions = newCards[cardIndex].conditions.filter(
      (_: GenericObject, i: number) => i !== conditionIndex
    );
    setCards(newCards);
  };

  const formattedServices = formatServices(services ?? []);

  const updateProperty = (
    cardIndex: number,
    conditionIndex: number,
    property: string,
    datatype: string
  ) => {
    const newCards = [...cards];
    const card = newCards[cardIndex];
    card.conditions[conditionIndex].property = property;
    card.conditions[conditionIndex].datatype = datatype;
    card.conditions[conditionIndex].operator = "";
    card.conditions[conditionIndex].value = "";
    card.conditions[conditionIndex].errors.property = false;
    card.conditions[conditionIndex].errors.datatype = false;
    newCards[cardIndex] = card;
    setCards(newCards);
  };

  const updateOperator = (
    cardIndex: number,
    conditionIndex: number,
    operator: string
  ) => {
    const newCards = [...cards];
    const card = newCards[cardIndex];
    card.conditions[conditionIndex].operator = operator;
    card.conditions[conditionIndex].value = "";
    card.conditions[conditionIndex].errors.operator = false;
    newCards[cardIndex] = card;
    setCards(newCards);
  };

  const updateValue = (
    cardIndex: number,
    conditionIndex: number,
    value: string
  ) => {
    const newCards = [...cards];
    const card = newCards[cardIndex];
    card.conditions[conditionIndex].value = value;
    card.conditions[conditionIndex].errors.value = false;
    newCards[cardIndex] = card;
    setCards(newCards);
  };

  const updateRootProperty = (cardIndex: number, property: string) => {
    const newCards = [...cards];
    const card = newCards[cardIndex];
    card.rootProperty = property;
    card.conditions = [getEmptyCondition()];
    card.errors.rootProperty = false;
    newCards[cardIndex] = card;
    setCards(newCards);
  };
  const handleSubmit = () => {
    const newCards = [...cards];
    let errors = 0;
    newCards.forEach((c) => {
      if (!c.rootProperty || !c.rootProperty.length) {
        errors++;
        c.errors.rootProperty = true;
      }
      c.conditions.forEach((cond) => {
        Object.keys(cond).forEach((id: string) => {
          if (id === "errors") return;
          const key = id as ConditionRowStrings;
          if (!cond[key] || !cond[key].length) {
            errors++;
            cond.errors[key] = true;
          }
        });
      });
    });

    if (!nameForm.title || !nameForm.title.length) {
      errors++;
      setNameForm((old) => ({ ...old, error: true }));
    }

    const newGroup = [...groupBy];
    newGroup.forEach((gr) => {
      if (gr.service === null) {
        errors++;
        gr.errors.service = true;
      }
      if (!gr.property || !gr.property.length) {
        errors++;
        gr.errors.property = true;
      }
    });
    setGroupBy(newGroup);
    if (errors > 0) {
      setCards(newCards);
      return;
    }
    const body = buildProbeBody(cards, nameForm.title, groupBy);
    try {
      const endpoint = CREATE_PROBE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      console.log({ body, endpoint });
      // raxios.post(endpoint, body);
      router.push("/probes");
    } catch (err) {
      router.push("/probes");
    }
  };
  const handleGroupByUpdate = (
    key: "service" | "property",
    value: string,
    index: number
  ) => {
    const newGroup = [...groupBy];
    const group = newGroup[index];
    group[key] = value;
    group.errors = {
      service: false,
      property: false,
    };
    newGroup[index] = group;
    setGroupBy([...newGroup]);
  };
  return (
    <div className={styles.container}>
      <div className={styles["cards-container"]}>
        {cards.map((c, idx) => {
          return (
            <ConditionCard
              cards={cards}
              includeAnd={idx > 0}
              conditions={c.conditions}
              rootProperty={c.rootProperty}
              loadingServices={loadingServices}
              addCondition={() => {
                addCondition(idx);
              }}
              deleteCondition={(conditionIndex) => {
                deleteCondition(idx, conditionIndex);
              }}
              updateProperty={(conditionIndex, property, datatype) => {
                updateProperty(idx, conditionIndex, property, datatype);
              }}
              updateOperator={(conditionIndex, operator) => {
                updateOperator(idx, conditionIndex, operator);
              }}
              updateValue={(conditionIndex, value) => {
                updateValue(idx, conditionIndex, value);
              }}
              updateRootProperty={(property) => {
                updateRootProperty(idx, property);
              }}
              key={c.key}
              services={formattedServices}
              deleteCard={
                idx > 0
                  ? () => {
                      deleteCard(c.key);
                    }
                  : null
              }
            />
          );
        })}
      </div>
      <Button
        color="secondary"
        variant="contained"
        className={styles["add-card-btn"]}
        onClick={addCard}
        disabled={cards.length === formattedServices.length}
      >
        Add service <HiOutlinePlus />
      </Button>
      <div className={styles.divider}></div>
      <div className={styles["group-by-container"]}>
        <p className={styles["group-by-title"]}>
          Group inferences by{" "}
          <span className={styles["group-by-link"]}>
            See how Group by works
          </span>
        </p>
        <div className={styles["group-by-selects"]}>
          {groupBy.map((gr, idx) => {
            return (
              <GroupBySelect
                isFirstRow={idx === 0}
                deleteGroupBy={() => {
                  deleteGroupBy(gr.key);
                }}
                cards={cards}
                key={gr.key}
                values={gr}
                updateValue={(key, value) => {
                  handleGroupByUpdate(key, value, idx);
                }}
                services={formattedServices}
              />
            );
          })}
        </div>
        <p
          role="button"
          className={styles["add-group-by-button"]}
          onClick={addGroupBy}
        >
          + Group by another property
        </p>
      </div>

      <div className={styles.divider}></div>
      <NotificationForm />
      <div className={styles.divider}></div>
      <NameAndTimeForm values={nameForm} updateValues={updateNameForm} />
      <Button
        variant="contained"
        className={styles["create-button"]}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default ProbeCreateForm;
