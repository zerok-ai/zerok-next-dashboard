import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormHelperText, MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";

import styles from "./PrometheusForm.module.scss";
import {
  FormItem,
  PROM_LEVEL_OPTIONS,
  PromFormSchema,
  type PromFormSchemaType,
} from "./PrometheusForm.utils";

const PrometheusForm = () => {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
    handleSubmit,
  } = useForm<PromFormSchemaType>({
    defaultValues: {
      level: PROM_LEVEL_OPTIONS[0].value,
    },
    resolver: zodResolver(PromFormSchema),
  });
  const onSubmit = (values: PromFormSchemaType) => {
    console.log({ values });
  };
  return (
    <div>
      {/* Name */}
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          id={"name"}
          errors={errors}
          label={"Name"}
          register={register}
          helperText={"The name of the cluster on dashboard."}
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
        <Button type="submit" variant="contained" className={styles.button}>
          Add cluster
        </Button>
      </form>
    </div>
  );
};

export default PrometheusForm;
