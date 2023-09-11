import { Button } from "@mui/material";
import cx from "classnames";
import ChipX from "components/themeX/ChipX";
import { useRouter } from "next/router";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { type IntegrationListType } from "utils/integrations/types";

import styles from "./IntegrationCard.module.scss";

interface IntegrationCardProps {
  integration: IntegrationListType;
}

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const { name, label, logo, description, integrated } = integration;
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
    router.push(`/integrations/prometheus/${page}`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["name-container"]}>
          <h6>{label}</h6>
          <ChipX label={<ChipLabel />} upperCase={false} color={"secondary"} />
        </div>
        <div className={styles["logo-container"]}>
          <img src={logo} alt={name} />
        </div>
      </div>
      <div className={styles.content}>
        <p>
          {description} <br />
        </p>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              handleRoute("list");
            }}
            disabled={!integrated}
            variant={"contained"}
            color={!integrated ? "primary" : "secondary"}
            // size="small"
            className={styles["action-button"]}
          >
            {integrated && (
              <HiOutlineCog6Tooth className={styles["action-icon"]} />
            )}
            {integrated ? "Manage" : "Coming soon"}
          </Button>
          {/* New */}
          {integrated && (
            <Button
              // variant={"normal"}
              color={"primary"}
              // size="small"
              className={styles["action-button"]}
              onClick={() => {
                handleRoute("create");
              }}
            >
              <HiOutlinePlus className={styles["action-icon"]} />
              {"Add new"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
