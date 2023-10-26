import { Button } from "@mui/material";
import cx from "classnames";
import ChipX from "components/themeX/ChipX";
import { useRouter } from "next/router";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { openClusterModal } from "redux/cluster";
import { useDispatch } from "redux/store";
import { type IntegrationListType } from "utils/integrations/types";

import styles from "./IntegrationCard.module.scss";

interface IntegrationCardProps {
  integration: IntegrationListType;
  border: boolean;
}

const IntegrationCard = ({ integration, border }: IntegrationCardProps) => {
  const {
    name,
    label,
    logo,
    description,
    integrated,
    triggerClusterModal,
    disabledText,
    mandatory,
    // helperText,
    disableManage,
    disableAddNew,
  } = integration;
  const dispatch = useDispatch();
  const router = useRouter();
  const ChipLabel = () => {
    return (
      <span className={styles["chip-label"]}>
        <span
          className={cx(
            integrated ? styles["status-success"] : styles["status-inactive"]
          )}
        ></span>
        <span> {integrated ? "Connected" : "Inactive"} </span>
      </span>
    );
  };
  const handleRoute = (page: string) => {
    router.push(`/integrations/${name}/${page}`);
  };
  return (
    <div className={cx(styles.container, border && styles.border)}>
      {/* image / logo */}
      <div className={styles["logo-container"]}>
        <img src={logo} alt={name} />
      </div>
      {/* content */}
      <div className={styles.content}>
        <div className={styles["content-top-row"]}>
          <h5>{label}</h5>
          <div className={styles["badge-container"]}>
            <ChipX
              label={<ChipLabel />}
              upperCase={false}
              color={"secondary"}
            />
            {mandatory && <ChipX label={"Mandatory"} upperCase={false} />}
          </div>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      {/* actions */}
      <div className={styles.actions}>
        {!disableManage && (
          <div>
            <Button
              onClick={() => {
                handleRoute("list");
              }}
              disabled={!integrated}
              variant={"contained"}
              color={!integrated ? "primary" : "secondary"}
              size="small"
              className={styles["action-button"]}
            >
              {integrated && (
                <HiOutlineCog6Tooth className={styles["action-icon"]} />
              )}
              {integrated ? "Manage" : disabledText}
            </Button>
            {/* {helperText && <small>{helperText}</small>} */}
          </div>
        )}
        {/* New */}
        {integrated && !disableAddNew && (
          <Button
            color={"primary"}
            size="small"
            className={styles["action-button"]}
            onClick={() => {
              if (!triggerClusterModal) {
                handleRoute("create");
              } else {
                dispatch(openClusterModal());
              }
            }}
          >
            <HiOutlinePlus className={styles["action-icon"]} />
            {"Add new"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
