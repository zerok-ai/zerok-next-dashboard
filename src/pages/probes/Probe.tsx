import { Button, IconButton, Switch, Tooltip } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_COL_WIDTH, DEFAULT_TIME_RANGE } from "utils/constants";
import { getFormattedTime } from "utils/dateHelpers";
import {
  getFormattedServiceName,
  getNamespace,
  trimString,
} from "utils/functions";
import raxios from "utils/raxios";
import { PROBE_PAGE_SIZE } from "utils/scenarios/constants";
import {
  GET_SCENARIO_DETAILS_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./Probe.module.scss";

const Probe = () => {
  const [scenarios, setScenarios] = useState<ScenarioDetail[] | null>(null);
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const router = useRouter();
  const range = router.query.range ?? DEFAULT_TIME_RANGE;
  const getData = async () => {
    try {
      const rdata = await raxios.get(LIST_SCENARIOS_ENDPOINT, {
        headers: {
          "Cluster-Id": selectedCluster as string,
        },
      });
      const allScenarios = rdata.data.payload.scenarios as ScenarioDetail[];
      const idList = allScenarios.map((s) => s.scenario_id);
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
          (s) => s.scenario_id === sd.scenario_id
        );
        if (scen) {
          return { ...sd, ...scen };
        }
        return sd;
      });
      setScenarios(finalSlist);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    if (selectedCluster) {
      setScenarios(null);
      getData();
    }
  }, [selectedCluster, router, renderTrigger]);

  const handleSwitchChange = async (scenario_id: string) => {
    console.log("do some stuff");
    getData();
  };

  const helper = createColumnHelper<ScenarioDetail>();

  const columns = [
    helper.accessor("scenario_title", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        return (
          <span className={styles["scenario-title"]}>{info.getValue()}</span>
        );
      },
    }),
    helper.display({
      header: "Created by",
      size: DEFAULT_COL_WIDTH / 2,
      cell: () => {
        return (
          <div className={styles.source}>
            <img src={`/images/brand/zerok_source_logo.svg`} alt="zerok_logo" />
            <span>ZeroK</span>
          </div>
        );
      },
    }),
    helper.accessor("first_seen", {
      header: "Created on",
      size: DEFAULT_COL_WIDTH,
      cell: (info) => {
        const { first_seen } = info.row.original;
        return (
          <span>{first_seen ? getFormattedTime(info.getValue()) : `-`}</span>
        );
      },
    }),
    helper.accessor("sources", {
      header: "Impacted services",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        const { sources, scenario_id } = info.row.original;
        if (!sources) {
          const scenario = scenarios?.find(
            (s) => s.scenario_id === scenario_id
          );
          let sourceString = ``;
          const keys = Object.keys(scenario!.workloads);
          keys.forEach((k, idx) => {
            const workload = scenario!.workloads[k];
            if (workload?.service === "*/*") {
              sourceString += `All ${workload?.protocol} services`;
            } else {
              sourceString += `${workload.service}`;
            }
          });
          return <span> {sourceString} </span>;
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
            <span>{trimString(str, 60)}</span>
          </TooltipX>
        );
      },
    }),
    helper.display({
      header: "Actions",
      size: DEFAULT_COL_WIDTH / 2,
      cell: (info) => {
        return (
          <div className={styles["probe-actions"]}>
            <Fragment>
              <Tooltip
                arrow
                placement="top"
                title={
                  info.row.original.enabled ? "Disable probe" : "Enable probe"
                }
              >
                <Switch
                  defaultChecked={info.row.original.enabled}
                  color="primary"
                  onChange={() => {
                    handleSwitchChange(info.row.original.scenario_id);
                  }}
                />
              </Tooltip>
            </Fragment>
            {/* Delete */}
            <Tooltip placement="top" title="Delete probe">
              <IconButton size="small">
                <HiOutlineTrash />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: scenarios ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const extras = [
    <Link href="/probes/create" key={nanoid()}>
      <Button className={styles["new-probe-btn"]} variant="contained">
        New Probe <HiOutlinePlus />
      </Button>
    </Link>,
  ];
  return (
    <div className={styles.container}>
      <PageHeader
        title="Probes"
        showRange={false}
        showRefresh
        extras={extras}
        alignExtras="right"
      />
      <div className={styles.table}>
        {scenarios ? (
          <TableX table={table} data={scenarios ?? []} />
        ) : (
          <CustomSkeleton len={8} />
        )}
      </div>
      <div className={styles.pagination}>
        <PaginationX totalItems={100} itemsPerPage={PROBE_PAGE_SIZE} />
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
