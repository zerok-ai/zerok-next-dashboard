import { useFetch } from "hooks/useFetch";
import styles from "./PodTable.module.scss";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import { GET_SERVICE_PODS_ENDPOINT } from "utils/endpoints";
import { PodDetail } from "utils/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Chip, Skeleton } from "@mui/material";
import TagX from "components/themeX/TagX";
import { getRelativeTime } from "utils/dateHelpers";
import TableX from "components/themeX/TableX";
import { DEFAULT_COL_WIDTH } from "utils/constants";

interface PodTableProps {
  service: string;
}

const PodTable = ({ service }: PodTableProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const { loading, error, data, fetchData } = useFetch<PodDetail[]>(`results`);
  const memo = useMemo(() => {
    return { service };
  }, [service]);
  const fetchPodDetails = () => {
    if (memo.service && selectedCluster) {
      const namespace = getNamespace(memo.service);
      const serviceName = getFormattedServiceName(memo.service).split("-")[0];
      const endpoint = GET_SERVICE_PODS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{namespace}", namespace)
        .replace("{service_name}", serviceName);
      fetchData(endpoint);
    }
  };
  useEffect(() => {
    fetchPodDetails();
  }, [memo]);

  const helper = createColumnHelper<PodDetail>();

  const columns = [
    helper.accessor("pod", {
      header: "Pod Name",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (row) => {
        return (
          <p role="button" className={styles["service-pod"]}>
            {row.getValue()}
          </p>
        );
      },
    }),
    helper.accessor("service", {
      header: "Service",
      size: DEFAULT_COL_WIDTH * 3,
    }),
    helper.accessor("containers", {
      header: "Containers",
      size: DEFAULT_COL_WIDTH * 0.4,
    }),
    helper.accessor("start_time", {
      header: "Age",
      size: DEFAULT_COL_WIDTH,
      cell: (row) => {
        return <span>{getRelativeTime(row.getValue())}</span>;
      },
    }),
    helper.accessor("status", {
      header: "Status",
      cell: (row) => {
        return (
          <Chip
            label={row.getValue().phase}
            variant="outlined"
            color="primary"
            size="small"
          />
        );
      },
    }),
  ];

  const TableSkeleton = () => {
    return [1, 2, 3, 4, 5].map(() => {
      return (
        <Skeleton variant="rectangular" className={styles["skeleton-row"]} />
      );
    });
  };

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles["container"]}>
      {!data ? <TableSkeleton /> : <TableX data={data} table={table} />}
    </div>
  );
};

export default memo(PodTable);
