import { type ColumnSort } from "@tanstack/react-table";
import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/helpers/TableFilter";
import TableX from "components/themeX/TableX";
import ZkLink from "components/themeX/ZkLink";
import { useFetch } from "hooks/useFetch";
import { useTrigger } from "hooks/useTrigger";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { dispatchSnackbar } from "utils/generic/functions";
import {
  CREATE_INTEGRATION_ENDPOINT,
  TEST_SAVED_PROM_CONNECTION_ENDPOINT,
} from "utils/integrations/endpoints";
import { type PrometheusListType } from "utils/integrations/types";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";

import styles from "./PrometheusTable.module.scss";
import {
  getPromColumns,
  PROM_SORT_OPTIONS,
  PromDeleteDialog,
} from "./PrometheusTable.utils";

const DEFAULT_SORT = {
  id: PROM_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROM_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const PrometheusTable = () => {
  const { data, fetchData, error, setData } =
    useFetch<PrometheusListType[]>("integrations");
  const { selectedCluster } = useSelector(clusterSelector);
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const { trigger, changeTrigger } = useTrigger();
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: string;
    action: "update" | "delete" | "deleting" | "testing";
  } | null>(null);

  const getData = () => {
    setData(null);
    if (selectedCluster) {
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      );
      fetchData(endpoint);
    }
  };

  useEffect(() => {
    if (selectedCluster && !error) {
      getData();
    }
    if (error) {
      setSelectedIntegration(null);
    }
  }, [selectedCluster, trigger, error]);

  const handleUpdate = async (row: PrometheusListType) => {
    const { id, disabled } = row;
    setSelectedIntegration({
      id,
      action: "update",
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
          disabled: !disabled,
        }
      );
      getData();
      dispatchSnackbar(
        "success",
        `Data source ${disabled ? "enabled" : "disabled"} successfully`
      );
    } catch (err) {
      sendError(err);
      dispatchSnackbar("error", "Failed to update status");
    } finally {
      setSelectedIntegration(null);
    }
  };
  const handleDelete = async () => {
    if (!selectedIntegration || selectedIntegration.action !== "delete") {
      return;
    }
    setSelectedIntegration({
      id: selectedIntegration.id,
      action: "deleting",
    });
    const integ = data!.find((i) => i.id === selectedIntegration.id);
    try {
      await raxios.post(
        CREATE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          selectedCluster as string
        ),
        {
          ...integ,
          deleted: true,
        }
      );
      getData();
      dispatchSnackbar("success", "Data source deleted successfully");
    } catch (err) {
      sendError(err);
      dispatchSnackbar("error", "Failed to delete data source");
    } finally {
      setSelectedIntegration(null);
    }
  };
  const clearSelectedIntegration = () => {
    setSelectedIntegration(null);
  };
  const handleTestConnection = async (row: PrometheusListType) => {
    setSelectedIntegration({
      id: row.id,
      action: "testing",
    });
    try {
      const endpoint = TEST_SAVED_PROM_CONNECTION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster!
      ).replace("{prom_id}", row.id);
      await raxios.get(endpoint);
     dispatchSnackbar("success", "Connection successful.");
      // const status = rdata.data.payload.status;
      // if (status > 199 && status < 300) {
      //   dispatchSnackbar("success", "Connection successful.");
      // } else {
      //   dispatchSnackbar(
      //     "error",
      //     "Connection failed, please check the connection parameters and try again."
      //   );
      // }
    } catch {
      dispatchSnackbar("error", "Connection test failed.");
    } finally {
      setSelectedIntegration(null);
    }
  };

  const columns = getPromColumns({
    onUpdate: handleUpdate,
    onDelete: (row) => {
      setSelectedIntegration({
        id: row.id,
        action: "delete",
      });
    },
    onTest: handleTestConnection,
    selectedIntegration: selectedIntegration?.id ?? null,
  });

  return (
    <div>
      <PageHeader
        title={"Prometheus sources"}
        htmlTitle="Prometheus sources"
        showRange={false}
        showRefresh={true}
        showBreadcrumb={true}
        onRefresh={changeTrigger}
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
        rightExtras={[
          <ZkLink href="/integrations/prometheus/create" key="new-prom">
            <AddNewBtn text="Add new data source" key="prom-new" />
          </ZkLink>,
        ]}
      />
      {selectedIntegration?.action === "delete" && (
        <PromDeleteDialog
          onClose={clearSelectedIntegration}
          onSuccess={handleDelete}
        />
      )}
      <div className={styles.table}>
        <TableX
          columns={columns}
          data={data ?? null}
          sortBy={sortBy}
          onSortingChange={setSortBy}
        />
      </div>
      <div className={styles.pagination}>
        {/* <PaginationX itemsPerPage={INTEGRATIONS_PAGE_SIZE} totalItems={25} /> */}
      </div>
    </div>
  );
};

export default PrometheusTable;
