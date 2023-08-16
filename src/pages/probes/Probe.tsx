import { Button } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TableX from "components/themeX/TableX";
import { nanoid } from "nanoid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
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
    const rdata = await raxios.get(LIST_SCENARIOS_ENDPOINT, {
      headers: {
        "Cluster-Id": selectedCluster as string,
      },
    });
    const slist = rdata.data.payload.scenarios as ScenarioDetail[];
    const idList = slist.map((s) => s.scenario_id);
    const sdata = await raxios.get(
      GET_SCENARIO_DETAILS_ENDPOINT.replace(
        "{scenario_id_list}",
        idList.join(",")
      )
        .replace("{cluster_id}", selectedCluster as string)
        .replace("{range}", range as string)
    );
    const sdlist = sdata.data.payload.scenarios as ScenarioDetail[];
    const finalSlist = sdlist.map((sd) => {
      const scen = slist.find((s) => s.scenario_id === sd.scenario_id);
      return { ...sd, ...scen };
    });
    setScenarios(finalSlist);
  };
  useEffect(() => {
    if (selectedCluster) {
      setScenarios(null);
      getData();
    }
  }, [selectedCluster, router, renderTrigger]);

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
        return <span>{getFormattedTime(info.getValue())}</span>;
      },
    }),
    helper.accessor("sources", {
      header: "Impacted services",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        const { sources } = info.row.original;
        let str = ``;
        sources.forEach((s, idx) => {
          str += `${getNamespace(s)}/${getFormattedServiceName(s)} ${
            idx === sources.length - 1 ? `` : `,`
          } `;
        });
        return <span>{trimString(str, 60)}</span>;
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
        showRange
        showRefresh
        extras={extras}
        alignExtras="right"
      />
      {scenarios ? (
        <TableX table={table} data={scenarios ?? []} />
      ) : (
        <CustomSkeleton len={8} />
      )}
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
