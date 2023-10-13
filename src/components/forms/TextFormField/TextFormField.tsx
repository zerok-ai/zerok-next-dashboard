import { InputLabel, TextField } from "@mui/material";
import cx from "classnames";
import { type ReactNode } from "react";
import { type UseFormRegister } from "react-hook-form";

interface TextFormFieldProps {
  type?: string;
  name: string;
  customClassName?: string;
  placeholder: string;
  label: string;
  // @TODO - add generics for these kinds of types
  register: UseFormRegister<any>;
  error: boolean;
  errorText: undefined | string;
  helperText?: string;
  endAdornment?: ReactNode;
  autoComplete?: "off" | "on";
}

const TextFormField = ({
  type,
  error,
  errorText,
  helperText,
  name,
  label,
  placeholder,
  customClassName,
  register,
  endAdornment,
  autoComplete = "off",
}: TextFormFieldProps) => {
  return (
    <fieldset className={cx("form-item", customClassName)}>
      <InputLabel htmlFor={name} className={cx("form-label")}>
        {label}
      </InputLabel>
      <TextField
        id={name}
        fullWidth
        variant="outlined"
        type={type ?? "text"}
        {...register(name)}
        placeholder={placeholder}
        error={error}
        autoComplete={autoComplete}
        helperText={errorText && error ? errorText : helperText}
        InputProps={{ endAdornment: endAdornment ?? null }}
      />
    </fieldset>
  );
};

export default TextFormField;
