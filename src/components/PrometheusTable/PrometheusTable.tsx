import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import TooltipX from "components/themeX/TooltipX";
import { useFetch } from "hooks/useFetch";
import { useEffect } from "react";
import { HiOutlineTrash, HiWrenchScrewdriver } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { getFormattedTime } from "utils/dateHelpers";
import { type PrometheusListType } from "utils/integrations/types";

import styles from "./PrometheusTable.module.scss";

const PrometheusTable = () => {
  const { data, fetchData } = useFetch<PrometheusListType[]>("clusters");
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);

  useEffect(() => {
    if (selectedCluster) {
      fetchData(`/prometheus.json`);
    }
  }, [selectedCluster, renderTrigger]);
  const helper = createColumnHelper<PrometheusListType>();
  const columns = [
    helper.accessor("host", {
      header: "Host",
    }),
    helper.accessor("cluster", {
      header: "Cluster",
    }),
    helper.accessor("integration_date", {
      header: "Integration Date",
      cell: (row) => {
        return getFormattedTime(row.getValue());
      },
    }),
    helper.display({
      header: "Actions",
      cell: (row) => {
        return (
          <div className={styles.actions}>
            <TooltipX title="Edit cluster">
              <IconButton size="small">
                <HiWrenchScrewdriver className={styles["action-icon"]} />
              </IconButton>
            </TooltipX>
            <TooltipX title="Delete cluster">
              <IconButton size="small">
                <HiOutlineTrash className={styles["action-icon"]} />
              </IconButton>
            </TooltipX>
          </div>
        );
      },
    }),
  ];
  return (
    <div>
      <PageHeader
        title={"Prometheus clusters"}
        htmlTitle="Prometheus clusters"
        showRange={false}
        showRefresh={true}
      />
      <TableX columns={columns} data={data ?? null} />
    </div>
  );
};

export default PrometheusTable;
