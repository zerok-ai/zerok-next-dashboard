// import { type SortingState } from "@tanstack/react-table";
import { Drawer } from "@mui/material";
import { type ColumnSort } from "@tanstack/react-table";
import cx from "classnames";
import TableFilter from "components/helpers/TableFilter";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { chatSelector } from "redux/chat";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { type TraceMetadataDetail } from "utils/issues/types";
import { TRACES_PAGE_SIZE } from "utils/scenarios/constants";
import { GET_SCENARIO_TRACES_ENDPOINT } from "utils/scenarios/endpoints";

import styles from "./TraceTable.module.scss";
import { getTraceColumns, INCIDENT_COL_FILTERS } from "./TraceTable.utils";

interface TracesStateDetail {
  trace_det_list: TraceMetadataDetail[];
  total_records: number;
}

const transformTraces = (data: TracesStateDetail) => {
  const newTraces = data;
  newTraces.trace_det_list = data.trace_det_list.filter((trace) => {
    return !trace.entry_service.includes("zk-client");
  });

  return newTraces;
};

const DEFAULT_SORT: ColumnSort = {
  id: INCIDENT_COL_FILTERS[0].value.split(":")[0],
  desc: INCIDENT_COL_FILTERS[0].value.split(":")[1] === "desc",
};

interface TraceTableProps {
  visible: boolean;
  onClose: () => void;
}

const TraceTable = ({ visible, onClose }: TraceTableProps) => {
  if (!visible) return null;
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const scenario = router.query.issue;
  const issue_id = router.query.issue_id;
  const range = (router.query.range as string) ?? DEFAULT_TIME_RANGE;
  const { likelyCause } = useSelector(chatSelector);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const {
    data: traces,
    fetchData: fetchTraces,
    setData: setTraces,
  } = useFetch<TracesStateDetail>("", null, transformTraces);
  useEffect(() => {
    if (selectedCluster && scenario && issue_id) {
      setTraces(null);
      const offset = (page - 1) * TRACES_PAGE_SIZE;
      const endpoint = GET_SCENARIO_TRACES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{scenario_id}", scenario as string)
        .replace("{issue_hash}", issue_id as string)
        .replace("{limit}", TRACES_PAGE_SIZE.toString())
        .replace("{offset}", offset.toString())
        .replace("{range}", range);
      fetchTraces(endpoint);
    }
  }, [selectedCluster, page]);

  useEffect(() => {
    onClose();
  }, [router]);

  const columns = getTraceColumns({
    chatTrace: likelyCause!.incidentId,
    currentTrace: router.query.trace as string,
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrop} role="dialog" onClick={onClose}></div>
      <Drawer
        onClose={onClose}
        className={styles.drawer}
        transitionDuration={0}
        variant="persistent"
        open={true}
        sx={{
          "& .MuiDrawer-root": {
            position: "absolute",
          },
          "& .MuiPaper-root": {
            position: "absolute",
          },
        }}
        anchor="right"
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <h5>
              <HiOutlineMenu
                onClick={() => {
                  onClose();
                }}
              />{" "}
              Requests:
            </h5>
            <div className={styles["header-actions"]}>
              <TableFilter
                sortBy={sortBy[0]}
                options={INCIDENT_COL_FILTERS}
                onChange={(va) => {
                  setSortBy([va]);
                }}
                size="small"
              />
              <HiOutlineX className={styles["close-icon"]} onClick={onClose} />
            </div>
          </div>
          <div className={styles["table-container"]}>
            <TableX
              columns={columns}
              sortBy={sortBy}
              onSortingChange={setSortBy}
              data={traces?.trace_det_list ?? null}
              headerClassName={styles["table-header"]}
              rowClassName={cx(styles["table-row"])}
              bodyClassName={styles["table-body"]}
              onRowClick={(row) => {
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
                totalItems={traces?.total_records ?? TRACES_PAGE_SIZE}
                externalCurrentPage={page}
                onJump={(page: number) => {
                  setPage(page);
                }}
                onNext={() => {
                  setPage(page + 1);
                }}
                onPrev={() => {
                  setPage(page - 1);
                }}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default TraceTable;
