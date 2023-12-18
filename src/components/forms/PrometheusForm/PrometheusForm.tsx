import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { FormHelperText, MenuItem, Select, Switch } from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import {
  useCreatePrometheusIntegrationMutation,
  useUpdatePrometheusIntegrationMutation,
} from "fetchers/integrations/prometheusSlice";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import useZkStatusHandler from "hooks/useZkStatusHandler";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_INTEGRATION_ENDPOINT } from "utils/integrations/endpoints";
import {
  type PrometheusBaseType,
  type PrometheusListType,
} from "utils/integrations/types";

import PromTestButton from "./helpers/PromTestButton";
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
  const { data: defaultValues, fetchData } = useFetch<PrometheusListType>("");
  const basicToggleDefaultValue = !!(edit && defaultValues?.authentication);
  const [isBasicAuthEnabled, toggleBasicAuth] = useToggle(
    basicToggleDefaultValue
  );
  const [
    createIntegration,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      isError: createError,
    },
  ] = useCreatePrometheusIntegrationMutation();

  const [
    updateIntegration,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdatePrometheusIntegrationMutation();
  // create status
  useZkStatusHandler({
    error: {
      open: createError,
      message: "Failed to create Prometheus data source",
    },
    success: {
      open: createSuccess,
      message: "Data source created",
      callback: () => {
        router.push("/integrations/prometheus/list");
      },
    },
  });
  // update status
  useZkStatusHandler({
    error: {
      open: updateError,
      message: "Failed to update Prometheus data source",
    },
    success: {
      open: updateSuccess,
      message: "Prometheus data source updated successfully",
      callback: () => {
        router.push("/integrations/prometheus/list");
      },
    },
  });
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
      const endpoint = GET_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      ).replace("{integration_id}", router.query.id as string);
      fetchData(endpoint);
    };
    if (edit && selectedCluster) {
      getInitialValues();
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (edit && defaultValues) {
      const integ = defaultValues;
      if (integ) {
        const { username, password } = integ.authentication
          ? integ.authentication
          : { username: null, password: null };
        reset({
          url: integ.url,
          username,
          password,
          level: integ.level,
          name: integ.alias,
        });
      }
    }
  }, [defaultValues]);

  const toggleBasicAuthDisplay = () => {
    if (!isBasicAuthEnabled) {
      toggleBasicAuth();
      setValue("username", "");
      setValue("password", "");
    } else {
      toggleBasicAuth();
      setValue("username", null);
      setValue("password", null);
    }
  };

  const onSubmit = async (values: PromFormSchemaType) => {
    const { url, username, password, level, name } = values;
    const common: PrometheusBaseType = {
      alias: name,
      type: "PROMETHEUS",
      url,
      authentication: {
        username: isBasicAuthEnabled ? username ?? "" : null,
        password: isBasicAuthEnabled ? password ?? "" : null,
      },
      level,
    };
    if (!edit) {
      createIntegration(common);
    } else if (edit && defaultValues) {
      const body: PrometheusListType = {
        ...defaultValues,
        ...common,
      };
      updateIntegration(body);
    } else {
      router.push("/integrations/prometheus/list");
    }
  };

  if (edit && !defaultValues) {
    return <CustomSkeleton len={10} />;
  }
  const values = watch();
  const isTestDisabled = () => {
    if (values.url && values.name) {
      return false;
    }
    return true;
  };
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
        <div className={styles["form-group-container"]}>
          <div className={styles["form-item-container"]}>
            <div className={cx(styles["form-group"])}>
              <label htmlFor={"basic-auth"}>Basic auth</label>
              <div className={styles["auth-switch"]}>
                <Switch
                  onChange={toggleBasicAuthDisplay}
                  id="basic-auth"
                  name="basic-auth"
                  defaultChecked={isBasicAuthEnabled}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Username */}
        {isBasicAuthEnabled && (
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
        )}
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
        </div>
        <div className={styles.divider}></div>
        <div className={styles.buttons}>
          <PromTestButton disabled={isTestDisabled()} form={watch()} />
          <LoadingButton
            loading={createLoading ?? updateLoading}
            type="submit"
            variant="contained"
            className={styles.button}
          >
            {edit ? `Done` : `Add data source`}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default PrometheusForm;
