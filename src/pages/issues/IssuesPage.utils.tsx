import { Button, Checkbox, Menu, MenuItem, Skeleton } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SERVICES_ENDPOINT_V2 } from "utils/endpoints";
import { ServiceDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";

import cssVars from "styles/variables.module.scss";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { IGNORED_SERVICES_PREFIXES, SPACE_TOKEN } from "utils/constants";
import {
  filterByIgnoredService,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
import { nanoid } from "@reduxjs/toolkit";

const ServicesMenu = ({
  serviceList,
}: {
  serviceList: ServiceDetail[] | null;
}) => {
  const router = useRouter();
  const { query } = router;
  const { services } = query;
  const { selectedCluster } = useSelector(clusterSelector);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleCheckBox = (name: string) => {
    const checked = selectedServices.includes(name);
    if (checked) {
      setSelectedServices((old) => old.filter((sv) => sv !== name));
    } else {
      setSelectedServices((prev) => [...prev, name]);
    }
  };

  const handleApply = () => {
    if (selectedServices.length) {
      const selectedServicesString = encodeURIComponent(
        selectedServices
          .map((sv) => {
            try {
              const svc = JSON.parse(sv);
              if (Array.isArray(svc)) {
                return [...svc];
              } else return sv;
            } catch (err) {
              return sv;
            }
          })
          .join(",")
      );
      router.push({
        pathname: "/issues",
        query: {
          ...query,
          services: selectedServicesString,
        },
      });
    } else {
      const newQuery = { ...query };
      delete newQuery.services;
      router.push({
        pathname: "/issues",
        query: {
          ...newQuery,
        },
      });
    }
    closeMenu();
  };

  useEffect(() => {
    if (services) {
      setSelectedServices(decodeURIComponent(services as string).split(","));
    } else setSelectedServices([]);
  }, [services]);

  const skeletons = new Array(8).fill("skeleton");

  return (
    <Fragment>
      <Button
        onClick={handleMenuClick}
        variant="outlined"
        color="secondary"
        className={styles["services-menu-btn"]}
      >
        Filter by services{" "}
        <span className={styles["services-select-icon"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["caret-down"]}`}
            alt="select_icon"
          />
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        id="service-select-menu"
        className={styles["services-menu"]}
        onClose={closeMenu}
        sx={{
          "& .MuiMenu-paper": {
            width: "300px",
            background: cssVars.grey900,
            marginTop: `${1 * SPACE_TOKEN}px`,
            borderRadius: `${SPACE_TOKEN}px}`,
          },
          "& .MuiMenu-list": {
            overflowY: "scroll",
            background: cssVars.grey900,
            borderRadius: `${SPACE_TOKEN}px}`,
            border: `1px solid ${cssVars.grey700}`,
          },
        }}
      >
        <div className={styles["services-container"]}>
          <div className={styles["services-list"]}>
            {serviceList ? (
              serviceList.map((service) => {
                return (
                  <MenuItem
                    className={styles["services-menu-item"]}
                    key={nanoid()}
                    id={service.service}
                    onClick={() => handleCheckBox(service.service)}
                  >
                    <Checkbox
                      // onChange={(e) => handleCheckBox(service.service)}
                      defaultChecked={selectedServices.includes(
                        service.service
                      )}
                    />{" "}
                    {getNamespace(service.service)}/
                    {getFormattedServiceName(service.service)}
                  </MenuItem>
                );
              })
            ) : (
              <div className={styles["services-skeleton-container"]}>
                {skeletons.map((sk) => {
                  return (
                    <Skeleton
                      key={nanoid()}
                      variant="rectangular"
                      className={styles["services-skeleton"]}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className={styles["services-action-container"]}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              className={styles["services-action-btn"]}
              onClick={handleApply}
              disabled={!selectedServices.length && !serviceList?.length}
            >
              Apply
            </Button>
          </div>
        </div>
      </Menu>
    </Fragment>
  );
};

export default ServicesMenu;
