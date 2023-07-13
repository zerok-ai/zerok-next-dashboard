import { useFetch } from "hooks/useFetch";
import styles from "./PodTable.module.scss";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import PodSystemDrawer from "components/PodSystemDrawer";

interface PodTableProps {
  service: string;
}

const PodTable = ({ service }: PodTableProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const { loading, error, data, fetchData } = useFetch<PodDetail[]>(`results`);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const closeDetailDrawer = () => setSelectedPod(null);
  const fetchPodDetails = () => {
    if (service && selectedCluster && !loading) {
      const namespace = getNamespace(service);
      const serviceName = getFormattedServiceName(service).split("-")[0];
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
  }, [service]);

  const helper = createColumnHelper<PodDetail>();

  const columns = [
    helper.accessor("pod", {
      header: "Pod Name",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (row) => {
        return (
          <p
            role="button"
            className={styles["service-pod"]}
            onClick={() => setSelectedPod(row.row.original.pod)}
          >
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
      {selectedPod && data && (
        <PodSystemDrawer
          pod={selectedPod}
          onClose={closeDetailDrawer}
          namespace={getNamespace(service)}
        ></PodSystemDrawer>
      )}
    </div>
  );
};

export default memo(PodTable);
