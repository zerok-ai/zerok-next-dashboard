import { Chip, Skeleton } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PodSystemDrawer from "components/PodSystemDrawer";
import TableX from "components/themeX/TableX";
import { nanoid } from "nanoid";
import { memo, useState } from "react";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getRelativeTime } from "utils/dateHelpers";
import { getNamespace } from "utils/functions";
import { type PodDetail } from "utils/types";

import styles from "./PodTable.module.scss";

interface PodTableProps {
  pods: PodDetail[] | null;
  service: string;
}

const PodTable = ({ pods, service }: PodTableProps) => {
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const closeDetailDrawer = () => {
    setSelectedPod(null);
  };

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
            onClick={() => {
              setSelectedPod(row.row.original.pod);
            }}
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
        <Skeleton
          variant="rectangular"
          className={styles["skeleton-row"]}
          key={nanoid()}
        />
      );
    });
  };

  const table = useReactTable({
    columns,
    data: pods ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      {!pods ? <TableSkeleton /> : <TableX data={pods} table={table} />}
      {selectedPod && pods && (
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
