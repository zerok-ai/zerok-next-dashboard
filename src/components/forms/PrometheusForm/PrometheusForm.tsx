import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";

import styles from "./PrometheusForm.module.scss";
import {
  PROM_LEVEL_OPTIONS,
  PromFormSchema,
  type PromFormSchemaType,
} from "./PrometheusForm.utils";

const PrometheusForm = () => {
  const {
    // formState: { errors },
    register,
    setValue,
    watch,
  } = useForm<PromFormSchemaType>({
    defaultValues: {},
    resolver: zodResolver(PromFormSchema),
  });
  return (
    <div className={styles.container}>
      {/* Name */}
      <div className={styles["form-item-container"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Name</label>
          <OutlinedInput {...register("name")} id="name" name="name" />
        </div>
        <FormHelperText className={styles["form-helper"]}>
          Name of your cluster on the dashboard.
        </FormHelperText>
      </div>
      {/* URL */}
      <div className={styles["form-item-container"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="url">URL</label>
          <OutlinedInput {...register("url")} id="url" name="url" />
        </div>
        <FormHelperText className={styles["form-helper"]}>
          The full URL of the cluster, ex:http://localhost:8080
        </FormHelperText>
      </div>
      <div className={styles.divider}></div>
      <h5>Basic Auth:</h5>
      {/* Username */}
      <div className={styles["form-group-container"]}>
        <div className={styles["form-item-container"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="url">Username</label>
            <OutlinedInput
              {...register("username")}
              id="username"
              name="username"
            />
          </div>
          <FormHelperText className={styles["form-helper"]}>
            The username for basic auth.
          </FormHelperText>
        </div>
        {/* Pasword */}
        <div className={styles["form-item-container"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Password</label>
            <OutlinedInput
              {...register("password")}
              id="password"
              name="password"
            />
          </div>
          <FormHelperText className={styles["form-helper"]}>
            The password for basic auth.
          </FormHelperText>
        </div>
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
          The password for basic auth.
        </FormHelperText>
      </div>
      <div className={styles.divider}></div>
      <Button type="submit" variant="contained" className={styles.button}>
        Add cluster
      </Button>
    </div>
  );
};

export default PrometheusForm;
