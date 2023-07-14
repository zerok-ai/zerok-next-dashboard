import { Button, Checkbox, Menu, MenuItem, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { IssueDetail, ServiceDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";

import cssVars from "styles/variables.module.scss";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { DEFAULT_COL_WIDTH, SPACE_TOKEN } from "utils/constants";
import {
  getFormattedServiceName,
  getNamespace,
  getTitleFromIssue,
} from "utils/functions";
import { nanoid } from "@reduxjs/toolkit";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import ChipX from "components/themeX/ChipX";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";

const ServicesMenu = ({
  serviceList,
}: {
  serviceList: ServiceDetail[] | null;
}) => {
  const router = useRouter();
  const { query } = router;
  const { services } = query;

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

const helper = createColumnHelper<IssueDetail>();

export const getIssueColumns = () => {
  return [
    helper.accessor("issue_title", {
      header: "Incident",
      size: DEFAULT_COL_WIDTH * 6,
      cell: (info) => {
        const { issue_title, issue_hash, source, destination, incidents } =
          info.row.original;
        return (
          <div className={styles["issue-container"]}>
            <div className={styles["issue-title-container"]}>
              <Link
                href={`/issues/${issue_hash}/${incidents[0]}`}
                className={"hover-link"}
              >
                <a className={styles["issue-title"]}>
                  {getTitleFromIssue(issue_title)}
                </a>
              </Link>
            </div>
            <div className={styles["issue-path"]}>
              <ChipX label={source} />{" "}
              <AiOutlineArrowRight
                className={styles["issue-path-arrow-icon"]}
              />{" "}
              <ChipX label={destination} />
            </div>
          </div>
        );
      },
    }),
    helper.accessor("last_seen", {
      header: "Last seen",
      size: DEFAULT_COL_WIDTH * 2.4,
      cell: (info) => {
        const { last_seen } = info.row.original;
        return (
          <div className={styles["issue-time-container"]}>
            {getFormattedTime(last_seen)}
          </div>
        );
      },
    }),
    helper.accessor("first_seen", {
      header: "First seen",
      size: DEFAULT_COL_WIDTH * 1.5,
      cell: (info) => {
        const { first_seen } = info.row.original;
        return (
          <div className={styles["issue-time-container"]}>
            {getRelativeTime(first_seen)}
          </div>
        );
      },
    }),
    // Velocity
    helper.accessor("velocity", {
      header: "Velocity",
      size: DEFAULT_COL_WIDTH / 2,
    }),
    // Total events
    helper.accessor("total_count", {
      header: "Total events",
      size: DEFAULT_COL_WIDTH * 1.2,
    }),
  ];
};
