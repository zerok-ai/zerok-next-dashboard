import { Button, Drawer, MenuItem, Select } from "@mui/material";
import styles from "./CreateNewIssueDrawer.module.scss";
import { HiPlus } from "react-icons/hi";
import { useState } from "react";
import { ICONS, ICON_BASE_PATH } from "utils/images";

import cx from "classnames";
import { useForm } from "react-hook-form";
import TextFormField from "components/forms/TextFormField";
import {
  CONDITIONS,
  CUSTOM_TYPES,
  EQUALS,
  PROTOCOLS,
  TIME_FRAMES,
} from "./CreateNewIssueDrawer.utils";
import { ServiceDetail } from "utils/types";
import { getFormattedServiceName } from "utils/functions";
import { InputLabel } from "@mui/material";

import cssVars from "styles/variables.module.scss";
import { nanoid } from "nanoid";
import { AiOutlineDelete } from "react-icons/ai";

interface CreateNewIssueDrawerProps {
  services: ServiceDetail[] | null;
}

const CreateNewIssueDrawer = ({ services }: CreateNewIssueDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawer = () => {
    setIsOpen(false);
  };
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [rows, setRows] = useState(0);

  const addRow = () => setRows((old) => old + 1);

  const removeRow = () => setRows((old) => old - 1);

  const ConditionRow = ({ start = false }: { start?: boolean }) => {
    const [type, setType] = useState("service");
    return (
      <div
        className={cx(styles["condition-row"], start && styles["start-row"])}
      >
        {!start && (
          <div className={styles["select-container"]}>
            <Select
              defaultValue={"and"}
              {...register("condition")}
              variant="standard"
              className={cx(
                styles["condition-select"],
                styles["condition-and"]
              )}
            >
              {CONDITIONS.map((condition) => (
                <MenuItem value={condition.value}>{condition.label}</MenuItem>
              ))}
            </Select>
          </div>
        )}
        {/* protocol */}
        <div className={styles["select-container"]}>
          {/* {start && <InputLabel htmlFor="protocol">protocol</InputLabel>} */}
          <Select
            placeholder="Choose protocol"
            {...register("protocol")}
            variant="standard"
            id="protocol"
            defaultValue=""
            labelId="protocol"
            className={styles["protocol-select"]}
            onChange={(va) => setType(va.target.value as string)}
          >
            {PROTOCOLS.map((protocol) => (
              <MenuItem value={protocol.value} key={nanoid()}>
                {protocol.label}
              </MenuItem>
            ))}
          </Select>
        </div>
        {/* equals */}
        <div className={styles["select-container"]}>
          {/* {start && <InputLabel htmlFor="equals">equals</InputLabel>} */}
          <Select
            defaultValue={"equals"}
            {...register("equals")}
            variant="standard"
            className={styles["equal-select"]}
            labelId="equals"
            id="equals"
          >
            {EQUALS.map((equal) => (
              <MenuItem value={equal.value}>{equal.label}</MenuItem>
            ))}
          </Select>
        </div>
        {/* service */}
        {!!services?.length && (
          <div className={styles["select-container"]}>
            {/* {start && <InputLabel htmlFor="service">service</InputLabel>} */}
            <Select
              placeholder="Choose service"
              {...register("service")}
              defaultValue={""}
              variant="standard"
              id="service"
              labelId="service"
              className={styles["service-select"]}
              MenuProps={{
                classes: {
                  paper: styles["service-select-paper"],
                },
              }}
            >
              {type === "service"
                ? services.map((sv) => {
                    return (
                      <MenuItem
                        value={sv.service}
                        key={nanoid()}
                        className={styles["service-select-item"]}
                      >
                        {getFormattedServiceName(sv.service)}
                      </MenuItem>
                    );
                  })
                : CUSTOM_TYPES.map((ct) => {
                    return (
                      <MenuItem
                        value={ct.value}
                        key={nanoid()}
                        className={styles["service-select-item"]}
                      >
                        {ct.label}
                      </MenuItem>
                    );
                  })}
            </Select>
          </div>
        )}
        {!start && (
          <span
            role="button"
            className={styles["delete-row-btn"]}
            onClick={removeRow}
          >
            <AiOutlineDelete className={styles["delete-row-icon"]} />
          </span>
        )}{" "}
      </div>
    );
  };
  return (
    <div className={styles["container"]}>
      <Button
        variant="contained"
        color="primary"
        className={styles["new-issue-btn"]}
        onClick={toggleDrawer}
      >
        New Issues Type <HiPlus className={styles["plus-icon"]} />
      </Button>
      {isOpen && (
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={closeDrawer}
          hideBackdrop
          className={styles["drawer"]}
        >
          <div className={styles["header"]}>
            <h6>Define New Issue Type</h6>
            <span
              className={styles["close-btn"]}
              onClick={closeDrawer}
              role="button"
            >
              <img
                src={`${ICON_BASE_PATH}/${ICONS["close-circle"]}`}
                alt="close"
              />
            </span>
          </div>

          <div className={styles["form-content"]}>
            <form className={styles["form"]}>
              <div className={cx(styles["form-item"], styles["name-item"])}>
                <TextFormField
                  name="name"
                  label="Name this incident type"
                  placeholder="Give a unique name"
                  register={register}
                  error={!!errors.name}
                  errorText={errors.name?.message as string}
                />
              </div>
              <div className={cx(styles["conditions-container"])}>
                <p>Define outlier conditions</p>

                <div className={styles["time-select"]}>
                  <label>For the next:</label>
                  <Select
                    placeholder="Choose a timeframe"
                    defaultValue={"5m"}
                    variant="standard"
                    {...register("time")}
                  >
                    {TIME_FRAMES.map((timeFrame) => (
                      <MenuItem value={timeFrame.value} key={nanoid()}>
                        {timeFrame.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={styles["conditions-container"]}>
                  <ConditionRow start={true} />
                  {[...Array(rows)].map((_, i) => {
                    return <ConditionRow key={nanoid()} start={false} />;
                  })}
                </div>
                <p
                  className={styles["add-condition-btn"]}
                  role="button"
                  onClick={addRow}
                >
                  + Add condition
                </p>
              </div>
              <Button variant="contained"> Apply and save</Button>
            </form>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default CreateNewIssueDrawer;
