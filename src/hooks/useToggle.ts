import {
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

export function useToggle(
  defaultValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = () => {
    setValue((v) => !v);
  };

  return [value, toggle, setValue];
}
