import { FieldError, FieldValues, UseFormRegister } from "react-hook-form";
import cx from "classnames";

import styles from "./TextFormField.module.scss";
import { InputLabel, TextField } from "@mui/material";
import { ReactNode } from "react";

interface TextFormFieldProps {
  type?: string;
  name: string;
  customClassName: string;
  placeholder: string;
  label: string;
  // @TODO - add generics for these kinds of types
  register: UseFormRegister<any>;
  error: boolean;
  errorText: undefined | string;
  helperText?: string;
  endAdornment?: ReactNode;
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
}: TextFormFieldProps) => {

  return (
    <div className={cx("form-item", customClassName)}>
      <InputLabel htmlFor={name} className={cx("form-label")}>
        {label}
      </InputLabel>
      <TextField
        id={name}
        fullWidth
        variant="outlined"
        type={type || "text"}
        {...register(name)}
        placeholder={placeholder}
        error={error}
        helperText={errorText && error ? errorText : helperText}
        InputProps={{ endAdornment: endAdornment || null }}
      />
    </div>
  );
};

export default TextFormField;
