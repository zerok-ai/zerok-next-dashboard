import { Button, Checkbox, Menu, MenuItem } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import {
  LIST_SERVICES_ENDPOINT,
  LIST_SERVICES_ENDPOINT_V2,
} from "utils/endpoints";
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

const filterServices = (services: ServiceDetail[]) => {
  return services.filter(
    (sv) => !IGNORED_SERVICES_PREFIXES.includes(getNamespace(sv.service))
  );
};

const ServicesMenu = () => {
  const router = useRouter();
  const { query } = router;
  const { services } = query;
  const { selectedCluster } = useSelector(clusterSelector);
  const {
    loading,
    error,
    data: servicesList,
    fetchData: fetchServices,
  } = useFetch<ServiceDetail[]>("results");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedServices((prev) => [...prev, name]);
    } else {
      setSelectedServices((old) => old.filter((sv) => sv !== name));
    }
  };

  const handleApply = () => {
    const selectedServicesString = encodeURIComponent(
      selectedServices.join(",")
    );
    router.push({
      pathname: "/issues",
      query: {
        ...query,
        services: selectedServicesString,
      },
    });
    closeMenu();
  };

  useEffect(() => {
    if (selectedCluster) {
      fetchServices(LIST_SERVICES_ENDPOINT_V2.replace("{id}", selectedCluster));
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (services) {
      setSelectedServices(decodeURIComponent(services as string).split(","));
    } else setSelectedServices([]);
  }, [services]);

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
        onClose={closeMenu}
        sx={{
          "& .MuiMenu-paper": {
            width: "300px",
            maxHeight: "300px",
            background: cssVars.grey900,
            marginTop: `${1 * SPACE_TOKEN}px`,
            borderRadius: `${SPACE_TOKEN}px}`,
          },
          "& .MuiMenu-list": {
            height: "280px",
            overflowY: "scroll",
            background: cssVars.grey900,
            borderRadius: `${SPACE_TOKEN}px}`,
            border: `1px solid ${cssVars.grey700}`,
          },
        }}
      >
        <div className={styles["services-container"]}>
          <div className={styles["services-list"]}>
            {servicesList?.map((service) => {
              return (
                <MenuItem
                  className={styles["services-menu-item"]}
                  key={nanoid()}
                  id={service.service}
                >
                  <Checkbox
                    onChange={(e) => handleCheckBox(e, service.service)}
                    defaultChecked={selectedServices.includes(service.service)}
                  />{" "}
                  {getNamespace(service.service)}/
                  {getFormattedServiceName(service.service)}
                </MenuItem>
              );
            })}
          </div>
          <div className={styles["services-action-container"]}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              className={styles["services-action-btn"]}
              onClick={handleApply}
              disabled={selectedServices.length === 0}
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