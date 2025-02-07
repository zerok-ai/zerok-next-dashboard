import { MenuItem, Select } from "@mui/material";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DEFAULT_TIME_RANGE } from "utils/constants";

import styles from "./TimeSelector.module.scss";
import { TIME_OPTIONS } from "./TimeSelector.utils";

interface TimeSelectorProps {
  handlePush?: boolean;
  onChange?: (range: string) => void;
}

const TimeSelector = ({ handlePush = true, onChange }: TimeSelectorProps) => {
  const [time, setTime] = useState(
    TIME_OPTIONS.find((t) => t.value === DEFAULT_TIME_RANGE)?.value ??
      TIME_OPTIONS[0].value
  );
  const router = useRouter();
  const changeTime = (range: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, range },
    });
  };
  useEffect(() => {
    const { range } = router.query;
    if (range && range !== time) {
      setTime(range as string);
    }
  }, [router.query]);

  return (
    <div className={styles.container}>
      <TooltipX placement="top" arrow={false} title="Time range">
        <Select
          value={time}
          name="time-selector"
          className={styles.select}
          renderValue={(val) => {
            return (
              <span className={styles["select-value"]}>
                <span className={styles["select-value-metric"]}>Last </span>
                {TIME_OPTIONS.find((t) => t.value === val)?.label}
              </span>
            );
          }}
          onChange={(val) => {
            if (val !== null && val.target && val.target.value) {
              if (handlePush) {
                changeTime(val.target.value);
              } else {
                setTime(val.target.value);
                onChange && onChange(val.target.value);
              }
            }
          }}
        >
          {TIME_OPTIONS.map((t) => {
            return (
              <MenuItem value={t.value} key={nanoid()}>
                {t.label}
              </MenuItem>
            );
          })}
        </Select>
      </TooltipX>
    </div>
  );
};

export default TimeSelector;
