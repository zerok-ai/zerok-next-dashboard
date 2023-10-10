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
import { DEFAULT_TIME_RANGE, IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import { type ATTRIBUTE_PROTOCOLS } from "utils/probes/constants";
import { PROBE_ATTRIBUTES_ENDPOINT } from "utils/probes/endpoints";
import {
  type AttributeProtocolType,
  type AttributeResponseType,
  type AttributeStateType,
} from "utils/probes/types";
import raxios from "utils/raxios";
import { CREATE_PROBE_ENDPOINT } from "utils/scenarios/endpoints";

// import raxios from "utils/raxios";
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

interface ProbeCreateFormProps {
  edit: false | ProbeFormType;
}

const ALL_PROTOCOL_SERVICES: Array<{
  label: string;
  value: string;
  protocol: AttributeProtocolType | "";
  rootOnly?: boolean;
}> = [
  {
    label: "All HTTP services",
    value: "*/*_http",
    protocol: "HTTP",
    rootOnly: true,
  },
];

const formatServices = (
  services: Array<{
    service: string;
    protocol?: AttributeProtocolType;
  }>
) => {
  const filter = services.filter((sv) => sv.protocol);
  return filter.map((sv) => {
    return {
      label: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
      value: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
      protocol: sv.protocol ?? "HTTP",
    };
  });
};

type ProbeServiceType = Array<{
  service: string;
  protocol?: AttributeProtocolType;
}>;

const filterServices = (services: ProbeServiceType): ProbeServiceType => {
  return services.filter(
    (sv) => !IGNORED_SERVICES_PREFIXES.includes(getNamespace(sv.service))
  );
};

const initialValues: ProbeFormType = {
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
          json_path: "",
        },
      ],
    },
  ],
  groupBy: [
    {
      key: "group-by-1",
      service: null,
      property: "",
      protocol: "",
      executor: "",
    },
  ],
  name: "",
  time: DEFAULT_TIME_RANGE,
  sampling: {
    samples: 10,
    duration: 1,
    metric: "m",
  },
};

const ProbeCreateForm = ({ edit }: ProbeCreateFormProps) => {
  const probeForm = useForm<ProbeFormType>({
    resolver: zodResolver(probeFormSchema),
    reValidateMode: "onChange",
    // eslint-disable-next-line no-unneeded-ternary
    values: edit ? edit : initialValues,
  });

  const {
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = probeForm;
  const { selectedCluster } = useSelector(clusterSelector);
  const { status, setStatus } = useStatus();
  const {
    data: services,
    fetchData: fetchServices,
    loading: loadingServices,
  } = useFetch<ProbeServiceType>("results", null, filterServices);
  const dispatch = useDispatch();
  const router = useRouter();
  const [attributes, setAttributes] = useState<AttributeStateType | null>(null);
  const fetchAttributesForProtocol = async (
    protocol: (typeof ATTRIBUTE_PROTOCOLS)[number]
  ) => {
    if (attributes && attributes[protocol]) return;
    try {
      const endpoint = PROBE_ATTRIBUTES_ENDPOINT.replace(
        "{protocol}",
        protocol
      );
      console.log({ endpoint });
      const res = await raxios.get("/errors.json");
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
    fetchAttributesForProtocol("HTTP");
  }, []);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SERVICES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{range}", DEFAULT_TIME_RANGE);
      fetchServices(endpoint);
    }
  }, [selectedCluster]);

  const { cards, groupBy } = watch();
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

  const resetGroupBy = () => {
    setValue("groupBy", [getEmptyGroupBy()]);
  };

  const formattedServices = [
    ...ALL_PROTOCOL_SERVICES,
    ...formatServices(services ?? []),
  ];
  const onSubmit = async () => {
    try {
      setStatus({
        loading: true,
        error: null,
      });
      const body = buildProbeBody(probeForm.watch(), attributes!);
      const endpoint = CREATE_PROBE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      await raxios.post(endpoint, body);
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
    } catch (err) {
      console.log({ err });
      setStatus({
        loading: false,
        error: "Something went wrong",
      });
      showSnackbar({
        message: "Something went wrong",
        type: "error",
      });
    }
  };
  const handleEditSubmit = () => {
    router.push("/probes");
  };
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["cards-container"]}>
        {cards.map((c, idx) => {
          return (
            <ConditionCard
              disabled={!!edit}
              form={probeForm}
              includeAnd={idx > 0}
              loadingServices={loadingServices}
              key={c.key}
              currentCardKey={c.key}
              services={formattedServices}
              attributes={attributes}
              resetGroupBy={resetGroupBy}
            />
          );
        })}
      </div>
      <Button
        color="secondary"
        variant="contained"
        className={styles["add-card-btn"]}
        onClick={addCard}
        disabled={cards.length === formattedServices.length || !!edit}
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
                attributes={attributes}
                disabled={!!edit}
              />
            );
          })}
        </div>
        {!edit && (
          <p
            role="button"
            className={styles["add-group-by-button"]}
            onClick={addGroupBy}
          >
            + Group by another property
          </p>
        )}
      </div>

      <div className={styles.divider}></div>
      <Sampling form={probeForm} disabled={!!edit} />
      <div className={styles.divider}></div>
      <NameAndTimeForm form={probeForm} disabled={!!edit} />
      <LoadingButton
        variant="contained"
        className={styles["create-button"]}
        type={edit ? "button" : "submit"}
        onClick={() => {
          edit ? handleEditSubmit() : handleSubmit(onSubmit);
        }}
        loading={status.loading}
      >
        {edit ? "Done" : "Submit"}
      </LoadingButton>
      {status.error && (
        <p className={styles["error-text"]}>
          Could not create probe, please check the form and try again or contact
          support.
        </p>
      )}
    </form>
  );
};

export default ProbeCreateForm;
