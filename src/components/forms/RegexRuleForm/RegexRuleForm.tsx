import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import useStatus from "hooks/useStatus";
import { useForm } from "react-hook-form";
import {
  OBFUSCATION_RULE_CREATION_ENDPOINT,
  UPDATE_OBFUSCATION_RULE_ENDPOINT,
} from "utils/data/endpoint";
import {
  type ObfuscationRuleType,
  RegexFormSchema,
  type RegexFormSchemaType,
} from "utils/data/types";
import raxios from "utils/raxios";

import styles from "./RegexRuleForm.module.scss";

interface RegexRuleFormProps {
  onFinish: () => void;
  onClose: () => void;
  editMode: boolean;
  selectedRule: ObfuscationRuleType | null;
}

const FIELDS: Array<{
  label: string;
  name: keyof RegexFormSchemaType;
  placeholder: string;
  helperText?: string;
}> = [
  {
    label: "Rule Name",
    name: "name",
    placeholder: "Give a unique name for this rule",
  },
  {
    label: "Rule Pattern",
    name: "pattern",
    placeholder: "Enter a regex pattern to match the data",
    helperText: `Ex: A credit card regex would be something like - ^4[0-9]{12}
  (?:[0-9]
  {3})?$`,
  },
  {
    label: "Replacement string",
    name: "replacement",
    placeholder: "Enter a replacement string",
    helperText: `Replacement string for the matched pattern. Ex: "XXXX-XXXX-XXXX-XXXX"`,
  },
];

const RegexRuleForm = ({
  onFinish,
  onClose,
  editMode,
  selectedRule,
}: RegexRuleFormProps) => {
  const { status, setStatus } = useStatus();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<RegexFormSchemaType>({
    resolver: zodResolver(RegexFormSchema),
    defaultValues: {
      name: selectedRule?.name ?? "",
      pattern: selectedRule?.analyzer.pattern ?? "",
      replacement: selectedRule?.anonymizer.params.new_value ?? "",
    },
  });
  const onSubmit = async (values: RegexFormSchemaType) => {
    const { name, pattern, replacement } = values;
    setStatus({ loading: true, error: null });
    try {
      const body = {
        name,
        enabled: true,
        analyzer: {
          type: "regex",
          pattern,
        },
        anonymizer: {
          operator: "replace",
          params: {
            new_value: replacement,
          },
        },
      };
      if (!editMode && !selectedRule) {
        await raxios.post(OBFUSCATION_RULE_CREATION_ENDPOINT, body);
      } else if (editMode && selectedRule) {
        const endpoint = UPDATE_OBFUSCATION_RULE_ENDPOINT.replace(
          "{obfuscation_id}",
          selectedRule.id
        );
        await raxios.put(endpoint, body);
      } else {
        onClose();
      }
      setStatus({ loading: false, error: null });
      onFinish();
    } catch (e) {
      setStatus({
        loading: false,
        error: "Could not create rule, please check your regex and try again.",
      });
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {FIELDS.map((field) => {
        return (
          <fieldset key={field.name}>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            <OutlinedInput
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <FormHelperText error={true}>
                {errors[field.name]!.message}
              </FormHelperText>
            )}
            {field.helperText && (
              <FormHelperText>{field.helperText}</FormHelperText>
            )}
          </fieldset>
        );
      })}

      <LoadingButton variant="contained" type="submit" loading={status.loading}>
        Create{" "}
      </LoadingButton>

      {<p className={styles["error-text"]}>{status.error && status.error}</p>}
    </form>
  );
};

export default RegexRuleForm;
