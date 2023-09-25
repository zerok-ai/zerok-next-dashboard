import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { showSnackbar } from "redux/snackbar";
import { useDispatch, useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import {
  filterServices,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
import { type ATTRIBUTE_PROTOCOLS } from "utils/probes/constants";
import { PROBE_ATTRIBUTES_ENDPOINT } from "utils/probes/endpoints";
import {
  type AttributeResponseType,
  type AttributeStateType,
} from "utils/probes/types";
import raxios from "utils/raxios";
import { CREATE_PROBE_ENDPOINT } from "utils/scenarios/endpoints";
// import raxios from "utils/raxios";
import { type ServiceDetail } from "utils/types";

import ConditionCard from "./helpers/ConditionCard";
import GroupBySelect from "./helpers/GroupBySelect";
import NameAndTimeForm from "./helpers/NameAndTimeForm";
import Sampling from "./helpers/Sampling";
import styles from "./ProbeCreateForm.module.scss";
import { probeFormSchema } from "./ProbeCreateForm.types";
import {
  buildProbeBody,
  getEmptyCard,
  getEmptyGroupBy,
  type ProbeFormType,
} from "./ProbeCreateForm.utils";

const ALL_PROTOCOL_SERVICES: Array<{
  label: string;
  value: string;
  protocol: "http" | "mysql";
  rootOnly?: boolean;
}> = [
  {
    label: "All HTTP services",
    value: "*/*_http",
    protocol: "http",
    rootOnly: true,
  },
  {
    label: "All MYSQL services",
    value: "*/*_mysql",
    protocol: "mysql",
    rootOnly: true,
  },
];

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
  const probeForm = useForm<ProbeFormType>({
    resolver: zodResolver(probeFormSchema),
    reValidateMode: "onChange",
    values: {
      cards: [
        // @TODO - check why adding a function triggers infinite loop
        {
          key: "card-1",
          rootProperty: "",
          protocol: "",
          conditions: [
            {
              key: "condition-1",
              property: "",
              operator: "",
              value: "",
              datatype: "",
            },
          ],
        },
      ],
      groupBy: [
        {
          key: "group-by-1",
          service: null,
          property: "",
        },
      ],
      name: "",
      time: DEFAULT_TIME_RANGE,
      sampling: {
        samples: 10,
        duration: 1,
        metric: "m",
      },
    },
  });
  const { setValue, watch, getValues, handleSubmit } = probeForm;
  const { selectedCluster } = useSelector(clusterSelector);
  const { status, setStatus } = useStatus();
  const {
    data: services,
    fetchData: fetchServices,
    loading: loadingServices,
  } = useFetch<ServiceDetail[]>("results", null, filterServices);
  const dispatch = useDispatch();
  const router = useRouter();
  const [attributes, setAttributes] = useState<AttributeStateType | null>(null);

  const fetchAttributesForProtocol = async (
    protocol: (typeof ATTRIBUTE_PROTOCOLS)[number]
  ) => {
    if (!selectedCluster) return;
    if (attributes && attributes[protocol]) return;
    try {
      const endpoint = PROBE_ATTRIBUTES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{protocol}", protocol);
      const res = await raxios.get(endpoint);
      const attrList: AttributeResponseType =
        res.data.payload.attributes_list[0];
      attrList.attribute_details = attrList.attribute_details.map((attr) => {
        attr.attribute_list = attr.attribute_list.filter((a) => {
          return a.field && a.input && a.id;
        });
        return attr;
      });
      attrList.attribute_details = attrList.attribute_details.map((attr) => {
        attr.attribute_list = attr.attribute_list.map((a) => {
          return { ...a, executor: attr.executor };
        });
        return attr;
      });
      const attrMap: AttributeStateType = {
        [protocol]: attrList.attribute_details,
      };
      setAttributes((prev) => ({ ...prev, ...attrMap }));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (selectedCluster) {
      fetchAttributesForProtocol("http");
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SERVICES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{range}", DEFAULT_TIME_RANGE);
      fetchServices(endpoint);
    }
  }, [selectedCluster]);

  const {
    formState: { errors },
  } = probeForm;

  useEffect(() => {
    if (Object.keys(errors).length) {
      // scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errors]);

  const addCard = () => {
    setValue("cards", [...getValues("cards"), getEmptyCard()]);
  };

  const addGroupBy = () => {
    setValue("groupBy", [...getValues("groupBy"), getEmptyGroupBy()]);
  };

  const formattedServices = [
    ...ALL_PROTOCOL_SERVICES,
    ...formatServices(services ?? []),
  ];

  const { cards, groupBy, sampling } = watch();
  const onSubmit = () => {
    setStatus({
      loading: true,
      error: null,
    });
    const body = buildProbeBody(cards, getValues("name"), groupBy, sampling);
    const endpoint = CREATE_PROBE_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster as string
    );
    raxios
      .post(endpoint, body)
      .then((res) => {
        setStatus({
          loading: false,
          error: null,
        });
        router.push("/probes");
        dispatch(
          showSnackbar({
            message: "Probe created successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setStatus({
          loading: false,
          error: err,
        });
      });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["cards-container"]}>
        {cards.map((c, idx) => {
          return (
            <ConditionCard
              form={probeForm}
              includeAnd={idx > 0}
              loadingServices={loadingServices}
              key={c.key}
              currentCardKey={c.key}
              services={formattedServices}
              attributes={attributes}
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
          {/* <span className={styles["group-by-link"]}>
            See how Group by works
          </span> */}
        </p>
        <div className={styles["group-by-selects"]}>
          {groupBy.map((gr, idx) => {
            return (
              <GroupBySelect
                currentGroupByKey={gr.key}
                key={gr.key}
                services={formattedServices}
                form={probeForm}
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

      {/* <div className={styles.divider}></div>
      <NotificationForm /> */}
      <div className={styles.divider}></div>
      <Sampling form={probeForm} />
      <div className={styles.divider}></div>
      <NameAndTimeForm form={probeForm} />
      <LoadingButton
        variant="contained"
        className={styles["create-button"]}
        type="submit"
        loading={status.loading}
      >
        Submit
      </LoadingButton>
    </form>
  );
};

export default ProbeCreateForm;
