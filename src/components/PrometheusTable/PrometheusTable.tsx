import { IconButton, Skeleton, Switch } from "@mui/material";
import { type ColumnSort, createColumnHelper } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/TableFilter";
import ChipX from "components/themeX/ChipX";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import TooltipX from "components/themeX/TooltipX";
import { useFetch } from "hooks/useFetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineTrash, HiWrenchScrewdriver } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { getRelativeTime } from "utils/dateHelpers";
import { INTEGRATIONS_PAGE_SIZE } from "utils/integrations/constants";
import { CREATE_INTEGRATION_ENDPOINT } from "utils/integrations/endpoints";
import { type PrometheusListType } from "utils/integrations/types";
import raxios from "utils/raxios";

import styles from "./PrometheusTable.module.scss";
import { PROM_SORT_OPTIONS } from "./PrometheusTable.utils";

const DEFAULT_SORT = {
  id: PROM_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROM_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const PrometheusTable = () => {
  const { data, fetchData, error } = useFetch<PrometheusListType[]>("clusters");
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: number;
    action: "disable" | "delete";
  } | null>(null);
  const router = useRouter();
  const { name } = router.query;
  useEffect(() => {
    if (selectedCluster) {
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      );
      console.log({ endpoint });
      fetchData(`/prometheus.json`);
    }
    if (error) {
      setSelectedIntegration(null);
    }
  }, [selectedCluster, renderTrigger, error]);
  const helper = createColumnHelper<PrometheusListType>();
  const columns = [
    helper.accessor("id", {
      header: "ID",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{cell.getValue()}</span>;
      },
    }),
    helper.accessor("url", {
      header: "Host",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{cell.getValue()}</span>;
      },
    }),
    helper.accessor("cluster_id", {
      header: "Cluster",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{cell.getValue()}</span>;
      },
    }),
    helper.accessor("level", {
      header: "Level",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <ChipX label={cell.getValue()} />;
      },
    }),
    helper.accessor("created_at", {
      header: "Created",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{getRelativeTime(cell.getValue())}</span>;
      },
    }),
    helper.accessor("updated_at", {
      header: "Updated",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{getRelativeTime(cell.getValue())}</span>;
      },
    }),
    helper.display({
      header: "Actions",
      cell: (row) => {
        if (row.row.original.id === selectedIntegration?.id) {
          return <Skeleton width="100%" />;
        }
        return (
          <div className={styles.actions}>
            <TooltipX title="Disable integration">
              <Switch
                checked={!row.row.original.disabled}
                size="small"
                className={styles["action-switch"]}
                onChange={(e, checked) => {
                  handleSwitch(row.row.original.id, checked);
                }}
              />
            </TooltipX>
            <TooltipX title="Edit integration">
              <Link
                href={`/integrations/${name as string}/edit?id=${
                  row.row.original.id
                }`}
              >
                <IconButton size="small">
                  <HiWrenchScrewdriver className={styles["action-icon"]} />
                </IconButton>
              </Link>
            </TooltipX>
            <TooltipX title="Delete integration">
              <IconButton size="small">
                <HiOutlineTrash className={styles["action-icon"]} />
              </IconButton>
            </TooltipX>
          </div>
        );
      },
    }),
  ];
  const handleSwitch = async (id: number, enabled: boolean) => {
    setSelectedIntegration({
      id,
      action: "disable",
    });
    const integ = data!.find((i) => i.id === id);
    try {
      await raxios.post(
        CREATE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          selectedCluster as string
        ),
        {
          ...integ,
          disabled: !enabled,
        }
      );
    } catch (err) {
      setSelectedIntegration(null);
      console.log({ err });
    }
  };
  return (
    <div>
      <PageHeader
        title={"Prometheus clusters"}
        htmlTitle="Prometheus integrations"
        showRange={false}
        showRefresh={true}
        leftExtras={[
          <TableFilter
            sortBy={sortBy[0]}
            key="table-sort"
            onChange={(val) => {
              setSortBy([val]);
            }}
            options={PROM_SORT_OPTIONS}
          />,
        ]}
      />
      <div className={styles.table}>
        <TableX
          columns={columns}
          data={data ?? null}
          sortBy={sortBy}
          onSortingChange={setSortBy}
        />
      </div>
      <div className={styles.pagination}>
        <PaginationX itemsPerPage={INTEGRATIONS_PAGE_SIZE} totalItems={25} />
      </div>
    </div>
  );
};

export default PrometheusTable;
