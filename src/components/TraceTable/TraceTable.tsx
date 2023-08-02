import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PaginationX from "components/PaginationX";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { type TraceMetadataDetail } from "utils/issues/types";
import { TRACES_PAGE_SIZE } from "utils/scenarios/constants";
import { GET_SCENARIO_TRACES_ENDPOINT } from "utils/scenarios/endpoints";

import styles from "./TraceTable.module.scss";
import { INCIDENT_COLUMNS } from "./TraceTable.utils";

interface TracesStateDetail {
  trace_det_list: TraceMetadataDetail[];
  total_records: number;
}

interface TraceTableProps {
  updateChatTrace: (trace: TraceMetadataDetail) => void;
  updateSelectedTrace: (trace: TraceMetadataDetail) => void;
}

const TraceTable = ({
  updateChatTrace,
  updateSelectedTrace,
}: TraceTableProps) => {
  const router = useRouter();
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const scenario = router.query.issue;
  const page = parseInt((router.query.page as string) ?? 1);
  const {
    data: traces,
    fetchData: fetchTraces,
    setData: setTraces,
  } = useFetch<TracesStateDetail>("");

  useEffect(() => {
    if (selectedCluster) {
      setTraces(null);
      const offset = (page - 1) * TRACES_PAGE_SIZE;
      const endpoint = GET_SCENARIO_TRACES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{scenario_id}", scenario as string)
        .replace("{limit}", TRACES_PAGE_SIZE.toString())
        .replace("{offset}", offset.toString());
      fetchTraces(endpoint);
    }
  }, [selectedCluster, renderTrigger, router.query]);

  useEffect(() => {
    if (traces) {
      updateChatTrace(traces.trace_det_list[0]);
    }
  }, [traces]);

  const table = useReactTable({
    columns: INCIDENT_COLUMNS,
    data: traces?.trace_det_list ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>Traces:</h5>
      </div>
      {traces ? (
        <div className={styles["table-container"]}>
          <TableX
            table={table}
            data={traces?.trace_det_list ?? []}
            headerClassName={styles["table-header"]}
            rowClassName={styles["table-row"]}
            onRowClick={(row) => {
              updateSelectedTrace(row);
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  trace: row.incident_id,
                },
              });
            }}
          />
          <div className={styles["pagination-container"]}>
            <PaginationX
              itemsPerPage={TRACES_PAGE_SIZE}
              totalItems={traces.total_records}
            />
          </div>
        </div>
      ) : (
        <CustomSkeleton
          len={10}
          containerClass={styles["skeleton-container"]}
          skeletonClass={styles.skeleton}
        />
      )}
    </div>
  );
};

export default TraceTable;
