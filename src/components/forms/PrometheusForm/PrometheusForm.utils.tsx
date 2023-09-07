import { FormHelperText, OutlinedInput } from "@mui/material";
import cx from "classnames";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { z } from "zod";

import styles from "./PrometheusForm.module.scss";

export const PROMETHEUS_LEVELS = ["cluster", "org"] as const;

export const PromFormSchema = z.object({
  name: z.string().nonempty("Name cannot be empty"),
  url: z
    .string()
    .nonempty("URL cannot be empty")
    .regex(
      /^(https?:\/\/)?[a-zA-Z0-9.-]+(:\d+)?(\/[\w/.-]*)?$/,
      "Please enter a valid URL"
    ),
  username: z.string(),
  password: z.string(),
  level: z.enum(["cluster", "org"]),
});

export type PromFormSchemaType = z.infer<typeof PromFormSchema>;

export const PROM_LEVEL_OPTIONS: Array<{
  value: (typeof PROMETHEUS_LEVELS)[number];
  label: string;
}> = [
  {
    value: "cluster",
    label: "Cluster",
  },
  {
    value: "org",
    label: "Organization",
  },
];

export const FormItem = ({
  id,
  label,
  register,
  helperText,
  errors,
}: {
  id: keyof PromFormSchemaType;
  label: string;
  register: UseFormRegister<PromFormSchemaType>;
  helperText: string;
  errors: FieldErrors<PromFormSchemaType>;
}) => {
  return (
    <div className={styles["form-item-container"]}>
      <div className={styles["form-group"]}>
        <label htmlFor={id}>{label}</label>
        <OutlinedInput {...register(id)} id={id} name={id} />
      </div>
      <FormHelperText
        className={cx(
          errors[id] ? styles["error-text"] : styles["helper-text"]
        )}
      >
        {errors[id] ? errors[id]!.message : helperText}
      </FormHelperText>
    </div>
  );
};
