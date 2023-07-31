import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { type TraceMetadataDetail } from "utils/issues/types";

import styles from "./TraceTable.module.scss";
import { INCIDENT_COLUMNS } from "./TraceTable.utils";

const TraceTable = () => {
  const router = useRouter();
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  // const scenario =
  // router.query.scenario ?? "55661a0e-25cb-5a1c-94cd-fad172b0caa2";
  const { data: traces, fetchData: fetchTraces } =
    useFetch<TraceMetadataDetail[]>("traces");

  useEffect(() => {
    if (selectedCluster) {
      fetchTraces("/incident_ids.json");
    }
  }, [selectedCluster, renderTrigger]);

  const table = useReactTable({
    columns: INCIDENT_COLUMNS,
    data: traces ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>Traces:</h5>
      </div>
      <div className={styles["table-container"]}>
        <TableX
          table={table}
          data={traces ?? []}
          headerClassName={styles["table-header"]}
          rowClassName={styles["table-row"]}
          onRowClick={(row) => {
            router.push({
              pathname: router.pathname,
              query: { ...router.query, trace: row.id },
            });
          }}
        />
      </div>
    </div>
  );
};

export default TraceTable;
