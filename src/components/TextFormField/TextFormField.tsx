import { FieldValues, UseFormRegister } from "react-hook-form";
import cx from "classnames";

import styles from "./TextFormField.module.scss";
import { InputLabel, TextField } from "@mui/material";

interface TextFormFieldProps {
  type?: string;
  name: string;
  customClassName: string;
  placeholder: string;
  label: string;
  register: UseFormRegister<FieldValues>;
}

const TextFormField = ({
  type,
  name,
  label,
  placeholder,
  customClassName,
  register,
}: TextFormFieldProps) => {
  return (
    <div className={cx("form-item", customClassName)}>
      <InputLabel htmlFor={name} className={cx("form-label")}>
        {label}
      </InputLabel>
      <TextField
        fullWidth
        variant="outlined"
        type={type || "text"}
        {...register(name)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextFormField;
