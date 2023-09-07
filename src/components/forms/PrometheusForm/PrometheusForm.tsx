import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormLabel, OutlinedInput, Switch } from "@mui/material";
import { useForm } from "react-hook-form";

import styles from "./PrometheusForm.module.scss";
import {
  PromFormSchema,
  type PromFormSchemaType,
} from "./PrometheusForm.utils";

const PrometheusForm = () => {
  const {
    // formState: { errors },
    register,
  } = useForm<PromFormSchemaType>({
    defaultValues: {},
    resolver: zodResolver(PromFormSchema),
  });
  return (
    <div className={styles.container}>
      <div className={styles["form-group"]}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <OutlinedInput {...register("name")} id="name" name="name" />
      </div>
      <div className={styles["form-group"]}>
        <FormLabel htmlFor="url">URL</FormLabel>
        <OutlinedInput {...register("url")} id="url" name="url" />
      </div>
      <div className={styles.divider}></div>
      <h5>Basic Auth:</h5>
      <div className={styles["form-group-container"]}>
        <div className={styles["form-group"]}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <OutlinedInput
            {...register("username")}
            id="username"
            name="username"
          />
        </div>
        <div className={styles["form-group"]}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <OutlinedInput {...register("password")} id="password" />
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles["form-group-horizontal"]}>
        Org level data source:
        <Switch {...register("level")} />
      </div>
      <div className={styles.divider}></div>
      <Button type="submit" variant="contained" className={styles.button}>
        Add cluster
      </Button>
    </div>
  );
};

export default PrometheusForm;
