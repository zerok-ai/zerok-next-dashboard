import { Button, Menu, MenuItem } from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/CustomSkeleton";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

import styles from "../ProbeCreateForm.module.scss";

interface JoiningSelectProps {
  list: Array<{
    label: string;
    value: string;
  }>;
  buttonMode: boolean;
  placeholder?: string;
  color: "blue" | "purple";
  value?: string;
  onSelect: ((value: string) => void) | null;
  loading?: boolean;
}

const JoiningSelect = ({
  list,
  buttonMode,
  color,
  value,
  onSelect,
  loading,
}: JoiningSelectProps) => {
  const [btnRef, setBtnRef] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBtnRef(event.currentTarget);
  };
  const handleClose = () => {
    setBtnRef(null);
  };
  const getList = () => {
    if (loading) {
      return list;
    }
    return list.length > 0 ? list : [{ label: "No services.", value: "" }];
  };
  // console.log({ list });
  return (
    <div className={styles["joining-select-container"]}>
      <Button
        variant="contained"
        onClick={handleClick}
        size="small"
        className={cx(
          color === "blue" ? styles.blue : styles.purple,
          styles["joining-select"],
          buttonMode && styles["no-button"]
        )}
      >
        {value}
        {!buttonMode && <HiOutlineChevronDown />}
      </Button>
      {!buttonMode && (
        <Menu
          anchorEl={btnRef}
          open={!!btnRef}
          onClose={handleClose}
          className={styles["joining-select-menu"]}
        >
          {!loading ? (
            getList().map((item) => {
              return (
                <MenuItem
                  value={item.value}
                  disabled={!item.value}
                  key={nanoid()}
                  onClick={() => {
                    onSelect && onSelect(item.value);
                    handleClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              );
            })
          ) : (
            <CustomSkeleton len={8} />
          )}
        </Menu>
      )}
    </div>
  );
};

export default JoiningSelect;
