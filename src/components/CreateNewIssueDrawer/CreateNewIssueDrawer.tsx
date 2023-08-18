import { Button, MenuItem, OutlinedInput, Select } from "@mui/material";
import cx from "classnames";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { getFormattedServiceName } from "utils/functions";
import { type ServiceDetail } from "utils/types";

import styles from "./CreateNewIssueDrawer.module.scss";
import {
  CONDITIONS,
  CUSTOM_TYPES,
  EQUALS,
  PROTOCOLS,
} from "./CreateNewIssueDrawer.utils";

const CreateNewIssueDrawer = () => {
  const { data: services, fetchData: fetchServices } =
    useFetch<ServiceDetail[]>("services");
  const { selectedCluster } = useSelector(clusterSelector);

  useEffect(() => {
    if (selectedCluster) {
      fetchServices(LIST_SERVICES_ENDPOINT.replace("{id}", selectedCluster));
    }
  }, [selectedCluster]);
  const { register } = useForm();

  const [rows, setRows] = useState(0);

  const addRow = () => {
    setRows((old) => old + 1);
  };

  const removeRow = () => {
    setRows((old) => old - 1);
  };

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
                <MenuItem value={condition.value} key={nanoid()}>
                  {condition.label}
                </MenuItem>
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
            MenuProps={{ style: { maxHeight: 300 } }}
            onChange={(va) => {
              setType(va.target.value);
            }}
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
              <MenuItem value={equal.value} key={nanoid()}>
                {equal.label}
              </MenuItem>
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
    <div className={styles.container}>
      <div className={styles["form-content"]}>
        <form className={styles.form}>
          <div className={cx(styles["form-item"], styles["name-item"])}>
            <OutlinedInput
              placeholder="Give this issue a unique name"
              {...register("name")}
            />
          </div>
          <div className={cx(styles["conditions-container"])}>
            <p>Define outlier conditions</p>

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
            <div className={styles["group-container"]}>
              <label>Group by:</label>
              <Select
                placeholder="Choose group by metric"
                variant="standard"
                className={styles["group-select"]}
                defaultValue={PROTOCOLS[0].value}
                {...register("group_by")}
              >
                {PROTOCOLS.map((prt) => (
                  <MenuItem value={prt.value} key={nanoid()}>
                    {prt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <Button variant="contained"> Investigate</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewIssueDrawer;
