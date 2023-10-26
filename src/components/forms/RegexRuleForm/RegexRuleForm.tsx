import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormHelperText,
  FormLabel,
  OutlinedInput,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { RegexFormSchema, type RegexFormSchemaType } from "utils/data/types";

import styles from "./RegexRuleForm.module.scss";

interface RegexRuleFormProps {
  onFinish: () => void;
  onClose: () => void;
}

const RegexRuleForm = ({ onFinish, onClose }: RegexRuleFormProps) => {
  const {
    formState: { errors },
    // watch,
    register,
    handleSubmit,
  } = useForm<RegexFormSchemaType>({
    resolver: zodResolver(RegexFormSchema),
  });
  const onSubmit = (values: RegexFormSchemaType) => {
    console.log({ values });
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <FormLabel htmlFor="name">Rule Name</FormLabel>
        <div>
          <OutlinedInput
            {...register("name")}
            id="name"
            autoComplete="off"
            error={!!errors.name}
            fullWidth
            placeholder="Give a unique name for this rule"
          />
          <FormHelperText error={!!errors.name}>
            {errors.name?.message}{" "}
          </FormHelperText>
        </div>
      </fieldset>

      {/* regex input */}
      <fieldset>
        <FormLabel htmlFor="name">Rule Pattern</FormLabel>
        <div>
          <OutlinedInput
            id="pattern"
            placeholder="Enter a regex pattern to match the data"
            {...register("pattern")}
            error={!!errors.pattern}
            fullWidth
          />
          <FormHelperText error={!!errors.pattern}>
            {errors.pattern
              ? errors.pattern.message
              : `Ex: A credit card regex would be something like - ^4[0-9]{12}
            (?:[0-9]
            {3})?$`}
          </FormHelperText>
        </div>
      </fieldset>

      <Button variant="contained" type="submit">
        Create{" "}
      </Button>
    </form>
  );
};

export default RegexRuleForm;
