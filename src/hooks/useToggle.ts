import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

export function useToggle(
  defaultValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => {
    setValue((x) => {
      return !x;
    });
  }, []);

  return [value, toggle, setValue];
}
