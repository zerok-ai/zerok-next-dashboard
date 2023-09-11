import cx from "classnames";
import { useState } from "react";
import { HiOutlineCheck } from "react-icons/hi2";

import styles from "./CustomCheckbox.module.scss";

interface CustomCheckboxProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CustomCheckbox = ({ defaultChecked, onChange }: CustomCheckboxProps) => {
  const [checked, setChecked] = useState(defaultChecked);
  const updateVal = (val: boolean) => {
    setChecked(val);
    if (onChange) {
      onChange(val);
    }
  };
  return (
    <div className={cx(styles.container, checked && styles.checked)}>
      {checked && <HiOutlineCheck className={styles.icon} />}
      <input
        className={styles.checkbox}
        type="checkbox"
        // defaultChecked={defaultChecked}
        checked={checked}
        onChange={(e) => {
          updateVal(e.target.checked);
        }}
      />
    </div>
  );
};

export default CustomCheckbox;
