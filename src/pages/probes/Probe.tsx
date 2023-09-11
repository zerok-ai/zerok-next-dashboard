import { Button, IconButton, Skeleton, Switch, Tooltip } from "@mui/material";
import { createColumnHelper, type SortingState } from "@tanstack/react-table";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/helpers/TableFilter";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/maps/PrivateRoute";
import ChipX from "components/themeX/ChipX";
import DialogX from "components/themeX/DialogX";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import TooltipX from "components/themeX/TooltipX";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_COL_WIDTH, DEFAULT_TIME_RANGE } from "utils/constants";
import {
  getFormattedTimeFromEpoc,
  getRelativeTimeFromEpoc,
} from "utils/dateHelpers";
import {
  getFormattedServiceName,
  getNamespace,
  trimString,
} from "utils/functions";
import raxios from "utils/raxios";
import { PROBE_PAGE_SIZE } from "utils/scenarios/constants";
import {
  DELETE_PROBE_ENDPOINT,
  GET_SCENARIO_DETAILS_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
  UPDATE_PROBE_STATUS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { getScenarioString } from "utils/scenarios/functions";
import {
  type ScenarioDetail,
  type ScenarioDetailType,
} from "utils/scenarios/types";
import { PROBE_SORT_OPTIONS } from "utils/tables/sort";

import styles from "./Probe.module.scss";

const DEFAULT_SORT = {
  id: PROBE_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROBE_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const Probe = () => {
  const [scenarios, setScenarios] = useState<ScenarioDetailType[] | null>(null);
  const [totalScenarios, setTotalScenarios] = useState<number>(0);
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const [selectedProbe, setSelectedProbe] = useState<null | {
    scenario_id: string;
    loading: boolean;
    deleting: boolean;
  }>(null);
  const [sortBy, setSortBy] = useState<SortingState>([DEFAULT_SORT]);
  const router = useRouter();
  const range = router.query.range ?? DEFAULT_TIME_RANGE;
  const page = router.query.page ?? "1";
  const resetSelectedProbe = () => {
    setSelectedProbe(null);
  };
  const getData = async () => {
    try {
      const endpoint = LIST_SCENARIOS_ENDPOINT.replace(
        "{limit}",
        PROBE_PAGE_SIZE.toString()
      ).replace(
        "{offset}",
        ((parseInt(page as string) - 1) * PROBE_PAGE_SIZE).toString()
      );
      const rdata = await raxios.get(endpoint, {
        headers: {
          "Cluster-Id": selectedCluster as string,
        },
      });
      setTotalScenarios(rdata.data.payload.total_rows);
      const allScenarios = rdata.data.payload.scenarios as ScenarioDetailType[];
      const idList = allScenarios.map((s) => s.scenario.scenario_id);
      const sdata = await raxios.get(
        GET_SCENARIO_DETAILS_ENDPOINT.replace(
          "{scenario_id_list}",
          idList.join(",")
        )
          .replace("{cluster_id}", selectedCluster as string)
          .replace("{range}", range as string)
      );
      const scenarioMetadata = sdata.data.payload.scenarios as ScenarioDetail[];
      const finalSlist = allScenarios.map((sd) => {
        const scen = scenarioMetadata.find(
          (s) => s.scenario_id === sd.scenario.scenario_id
        );
        if (scen) {
          return { ...sd, ...scen };
        }
        return sd;
      });
      setScenarios(finalSlist);
    } catch (err) {
      console.log({ err });
    } finally {
      resetSelectedProbe();
    }
  };
  useEffect(() => {
    if (selectedCluster) {
      setScenarios(null);
      getData();
    }
  }, [selectedCluster, router, renderTrigger]);

  const handleSwitchChange = async (scenario_id: string, enable: boolean) => {
    setSelectedProbe({ scenario_id, loading: true, deleting: false });
    try {
      const endpoint = UPDATE_PROBE_STATUS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      ).replace("{scenario_id}", scenario_id);
      await raxios.put(endpoint, {
        action: enable ? "enable" : "disable",
      });
    } catch (err) {
      console.log({ err });
    } finally {
      getData();
    }
  };

  const columnSkeleton = useMemo(() => {
    return <Skeleton variant="rectangular" width="100%" height={20} />;
  }, []);

  const handleDelete = async () => {
    if (!selectedProbe?.scenario_id) {
      return;
    }
    const scenario_id = selectedProbe.scenario_id;
    try {
      const endpoint = DELETE_PROBE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      ).replace("{scenario_id}", scenario_id);
      await raxios.delete(endpoint);
    } catch (err) {
      console.log({ err });
    } finally {
      getData();
    }
  };

  const helper = createColumnHelper<ScenarioDetailType>();

  const columns = [
    helper.accessor("scenario.scenario_title", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 7,
      cell: (info) => {
        const ruleString = getScenarioString(info.row.original.scenario);
        if (
          selectedProbe?.scenario_id === info.row.original.scenario.scenario_id
        ) {
          return columnSkeleton;
        }
        const { scenario, disabled_at } = info.row.original;
        const { scenario_title, scenario_type } = scenario;
        return (
          <div className={styles["scenario-title-container"]}>
            {
              <Fragment>
                <TooltipX title={ruleString}>
                  <span
                    className={cx(
                      styles["scenario-title"],
                      disabled_at && styles.disabled
                    )}
                  >
                    {trimString(scenario_title, 100)}
                  </span>
                </TooltipX>
                <div className={styles["scenario-title-chips"]}>
                  {scenario_type === "SYSTEM" && <ChipX label="System" />}
                  {disabled_at && <ChipX label="Disabled" />}
                </div>
              </Fragment>
            }
          </div>
        );
      },
    }),
    helper.display({
      header: "Created by",
      size: DEFAULT_COL_WIDTH,
      cell: (info) => {
        if (
          selectedProbe?.scenario_id === info.row.original.scenario.scenario_id
        ) {
          return columnSkeleton;
        }
        return (
          <div className={styles.source}>
            <img src={`/images/brand/zerok_source_logo.png`} alt="zerok_logo" />
            <span
              className={cx(info.row.original.disabled_at && styles.disabled)}
            >
              ZeroK
            </span>
          </div>
        );
      },
    }),
    helper.accessor("created_at", {
      header: "Created",
      size: DEFAULT_COL_WIDTH * 1.5,
      cell: (info) => {
        const { created_at } = info.row.original;
        if (
          selectedProbe?.scenario_id === info.row.original.scenario.scenario_id
        ) {
          return columnSkeleton;
        }
        return (
          <TooltipX title={getFormattedTimeFromEpoc(created_at) as string}>
            <span
              className={cx(info.row.original.disabled_at && styles.disabled)}
            >
              {created_at ? getRelativeTimeFromEpoc(created_at) : `-`}
            </span>
          </TooltipX>
        );
      },
    }),
    helper.accessor("scenario.sources", {
      header: "Impacted services",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        const { sources, scenario_id } = info.row.original.scenario;
        if (selectedProbe?.scenario_id === scenario_id) {
          return columnSkeleton;
        }
        if (!sources) {
          const scenario = scenarios?.find(
            (s) => s.scenario.scenario_id === scenario_id
          );
          let sourceString = ``;
          const keys = Object.keys(scenario!.scenario.workloads);
          keys.forEach((k, idx) => {
            const workload = scenario!.scenario.workloads[k];
            const comma = idx === keys.length - 1 ? ` ` : `, `;
            if (workload?.service === "*/*") {
              sourceString += `All ${workload?.protocol} services${comma}`;
            } else {
              sourceString += `${workload.service}${comma}`;
            }
          });
          return (
            <TooltipX title={sourceString}>
              <span
                className={cx(info.row.original.disabled_at && styles.disabled)}
              >
                {" "}
                {trimString(sourceString, 45)}{" "}
              </span>
            </TooltipX>
          );
        }
        let str = ``;
        sources.forEach((s, idx) => {
          if (!s.length) {
            return;
          }
          str += `${getNamespace(s)}/${getFormattedServiceName(s)} ${
            idx === sources.length - 1 ? `` : `,`
          } `;
        });
        return (
          <TooltipX title={str}>
            <span
              className={cx(info.row.original.disabled_at && styles.disabled)}
            >
              {trimString(str, 60)}
            </span>
          </TooltipX>
        );
      },
    }),
    helper.display({
      header: "Actions",
      size: 70,
      cell: (info) => {
        if (
          selectedProbe?.scenario_id === info.row.original.scenario.scenario_id
        ) {
          return columnSkeleton;
        }
        if (info.row.original.scenario.scenario_type === "SYSTEM") {
          return null;
        }
        return (
          <div className={styles["probe-actions"]}>
            <Fragment>
              <Tooltip
                arrow
                placement="top"
                title={
                  !info.row.original.disabled_at
                    ? "Disable probe"
                    : "Enable probe"
                }
              >
                <Switch
                  disabled={!!selectedProbe?.scenario_id}
                  name="probe-toggle-switch"
                  size="small"
                  defaultChecked={!info.row.original.disabled_at}
                  color="primary"
                  onChange={() => {
                    handleSwitchChange(
                      info.row.original.scenario.scenario_id,
                      !!info.row.original.disabled_at
                    );
                  }}
                />
              </Tooltip>
            </Fragment>
            {/* Delete */}
            <TooltipX title="Delete probe" disabled={selectedProbe?.loading}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedProbe({
                      loading: true,
                      scenario_id: info.row.original.scenario.scenario_id,
                      deleting: true,
                    });
                  }}
                >
                  <HiOutlineTrash />
                </IconButton>
              </span>
            </TooltipX>
          </div>
        );
      },
    }),
  ];

  const leftExtras = useMemo(() => {
    return [
      <TableFilter
        key={"probe-table-filter"}
        sortBy={sortBy[0]}
        options={PROBE_SORT_OPTIONS}
        onChange={(val) => {
          setSortBy([val]);
        }}
      />,
    ];
  }, [sortBy]);

  const rightExtras = useMemo(() => {
    return [
      <Link href="/probes/create" key={"new-probe-btn"}>
        <Button
          className={styles["new-probe-btn"]}
          variant="contained"
          size="medium"
        >
          New Probe <HiOutlinePlus />
        </Button>
      </Link>,
    ];
  }, []);
  return (
    <div className={styles.container}>
      <PageHeader
        title="Probes"
        showRange={false}
        showRefresh
        leftExtras={leftExtras}
        rightExtras={rightExtras}
        // alignExtras="right"
      />
      <DialogX
        isOpen={!!(selectedProbe && selectedProbe.deleting)}
        title="Delete Probe"
        successText="Delete"
        cancelText="Cancel"
        onClose={() => {
          resetSelectedProbe();
        }}
        onSuccess={handleDelete}
        onCancel={() => {
          resetSelectedProbe();
        }}
      >
        <span>Are you sure you want to delete this probe?</span> <br />
        <em>This action cannot be undone.</em>
      </DialogX>
      <div className={styles.table}>
        {scenarios ? (
          <TableX
            data={scenarios ?? null}
            columns={columns}
            sortBy={sortBy}
            onSortingChange={setSortBy}
          />
        ) : (
          <CustomSkeleton len={8} />
        )}
      </div>
      <div className={styles.pagination}>
        <PaginationX
          totalItems={totalScenarios ?? PROBE_PAGE_SIZE}
          itemsPerPage={PROBE_PAGE_SIZE}
        />
      </div>
    </div>
  );
};

Probe.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Probes</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Probe;
