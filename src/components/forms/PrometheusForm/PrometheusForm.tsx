import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import CustomSkeleton from "components/custom/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { clusterSelector } from "redux/cluster";
import { showSnackbar } from "redux/snackbar";
import { useDispatch, useSelector } from "redux/store";
import { CREATE_INTEGRATION_ENDPOINT } from "utils/integrations/endpoints";
import {
  type PrometheusBaseType,
  type PrometheusListType,
} from "utils/integrations/types";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";

import styles from "./PrometheusForm.module.scss";
import {
  FormItem,
  PROM_LEVEL_OPTIONS,
  PromFormSchema,
  type PromFormSchemaType,
} from "./PrometheusForm.utils";

const PrometheusForm = ({ edit }: { edit: boolean }) => {
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const { data: defaultValues, fetchData } =
    useFetch<PrometheusListType[]>("integrations");
  const { status, setStatus } = useStatus();
  const dispatch = useDispatch();
  const {
    formState: { errors },
    register,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm<PromFormSchemaType>({
    defaultValues: {
      level: PROM_LEVEL_OPTIONS[0].value,
    },
    resolver: zodResolver(PromFormSchema),
  });
  useEffect(() => {
    const getInitialValues = async () => {
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      fetchData(endpoint);
    };
    if (edit && selectedCluster) {
      getInitialValues();
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (edit && defaultValues) {
      const integ = defaultValues.find((i) => i.id === router.query.id);
      if (integ) {
        reset({
          url: integ.url,
          username: integ.authentication.username,
          password: integ.authentication.password,
          level: integ.level,
          name: integ.alias,
          metric_server: integ.metric_server,
        });
      }
    }
  }, [defaultValues]);

  const onSubmit = async (values: PromFormSchemaType) => {
    setStatus({
      loading: true,
      error: null,
    });
    try {
      const { url, username, password, level, name, metric_server } = values;
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      const common: PrometheusBaseType = {
        alias: name,
        type: "PROMETHEUS",
        url,
        authentication: {
          username,
          password,
        },
        level,
      };
      if (edit && defaultValues) {
        const integ = defaultValues.find((i) => i.id === router.query.id);
        const { id, cluster_id, created_at, updated_at, disabled, deleted } =
          integ as PrometheusListType;
        const body: PrometheusListType = {
          ...common,
          id,
          cluster_id,
          created_at,
          updated_at,
          disabled,
          deleted,
          metric_server,
        };
        await raxios.post(endpoint, body);
        router.push("/integrations/prometheus/list");
        dispatch(
          showSnackbar({
            message: `Data source ${
              edit ? "updated" : "created"
            } successfully.`,
            type: "success",
          })
        );
      } else if (!edit) {
        await raxios.post(endpoint, common);
        router.push("/integrations/prometheus/list");
      }
    } catch (err) {
      sendError(err);
      setStatus((old) => {
        return {
          ...old,
          error: "Could not create integration. Please try again.",
        };
      });
    } finally {
      setStatus((old) => {
        return {
          ...old,
          loading: false,
        };
      });
    }
  };
  if (edit && !defaultValues) {
    return <CustomSkeleton len={10} />;
  }
  return (
    <div>
      <PageHeader
        title={`${edit ? `Edit` : `Add`} Prometheus data source`}
        htmlTitle={`${edit ? `Edit` : `Add`} Prometheus data source`}
        showBreadcrumb={true}
        showRange={false}
        showRefresh={false}
      />
      {/* Name */}
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          id={"name"}
          errors={errors}
          label={"Name"}
          register={register}
          helperText={"The name of the data source on dashboard."}
        />
        {/* URL */}
        <FormItem
          id={"url"}
          errors={errors}
          label={"URL"}
          register={register}
          helperText={"The full URL of the server, ex: http://localhost:8080"}
        />
        <div className={styles.divider}></div>
        <h5>Basic Auth:</h5>
        {/* Username */}
        <div className={styles["form-group-container"]}>
          <FormItem
            errors={errors}
            id={"username"}
            label={"Username"}
            register={register}
            helperText={"The username for basic auth."}
          />
          {/* Pasword */}
          <FormItem
            errors={errors}
            id={"password"}
            label={"Password"}
            register={register}
            helperText={"The password for basic auth."}
          />
        </div>
        {/* Org switch */}
        <div className={styles.divider}></div>
        <div className={styles["form-group-container"]}>
          <div className={styles["form-item-container"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="password">Data source level</label>
              <Select
                {...register("level")}
                id="level"
                value={watch("level")}
                name="level"
                onChange={(e) => {
                  if (e.target && e.target.value) {
                    // @ts-expect-error already added types
                    setValue("level", e.target.value);
                  }
                }}
                className={styles.select}
              >
                {PROM_LEVEL_OPTIONS.map((option) => {
                  return (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <FormHelperText className={styles["form-helper"]}>
              Org or cluster level data source.
            </FormHelperText>
          </div>

          {/* Metric server switch */}
          <div className={styles["form-item-container"]}>
            <div className={styles["text-form-group"]}>
              <label htmlFor="metric_server" className={styles["text-label"]}>
                Use this data source as a metrics server:
              </label>
              <RadioGroup
                value={watch("metric_server") ? "true" : "false"}
                onChange={(e) => {
                  setValue(
                    "metric_server",
                    // eslint-disable-next-line no-unneeded-ternary
                    e.target.value === "true" ? true : false
                  );
                }}
                row
                aria-labelledby="metric-server-radio-buttons-group-label"
                name="row-radio-buttons-group"
                className={styles["radio-group"]}
              >
                <FormControlLabel
                  value={"true"}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={"false"}
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </div>
            {errors.metric_server && (
              <FormHelperText className={styles["error-text"]}>
                Please select an option.
              </FormHelperText>
            )}
          </div>
        </div>
        <div className={styles.divider}></div>
        <LoadingButton
          loading={status.loading}
          type="submit"
          variant="contained"
          className={styles.button}
        >
          {edit ? `Done` : `Add data source`}
        </LoadingButton>
      </form>
    </div>
  );
};

export default PrometheusForm;
