import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { FormHelperText, MenuItem, Select } from "@mui/material";
import CustomSkeleton from "components/CustomSkeleton";
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { CREATE_INTEGRATION_ENDPOINT } from "utils/integrations/endpoints";
import {
  type PrometheusBaseType,
  type PrometheusListType,
} from "utils/integrations/types";
import raxios from "utils/raxios";

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
      const integ = defaultValues.find(
        (i) => i.id === parseInt(router.query.id as string)
      );
      if (integ) {
        reset({
          url: integ.url,
          username: integ.authentication.username,
          password: integ.authentication.password,
          level: integ.level,
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
      const { url, username, password, level } = values;
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      );
      const common: PrometheusBaseType = {
        type: "PROMETHEUS",
        url,
        authentication: {
          username,
          password,
        },
        level,
      };
      if (edit && defaultValues) {
        const integ = defaultValues.find(
          (i) => i.id === parseInt(router.query.id as string)
        );
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
        };
        await raxios.post(endpoint, body);
        router.push("/integrations/prometheus/list");
      } else if (!edit) {
        await raxios.post(endpoint, common);
        router.push("/integrations/prometheus/list");
      }
    } catch (err) {
      console.log({ err });
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
        <div className={styles.divider}></div>
        <LoadingButton
          loading={status.loading}
          type="submit"
          variant="contained"
          className={styles.button}
        >
          Add cluster
        </LoadingButton>
      </form>
    </div>
  );
};

export default PrometheusForm;
