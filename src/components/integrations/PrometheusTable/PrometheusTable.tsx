import { type ColumnSort } from "@tanstack/react-table";
import CustomSkeleton from "components/custom/CustomSkeleton";
import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/helpers/TableFilter";
import TableX from "components/themeX/TableX";
import ZkLink from "components/themeX/ZkLink";
import {
  useDeletePrometheusIntegrationMutation,
  useLazyListPromIntegrationsQuery,
  useUpdatePrometheusStatusMutation,
} from "fetchers/integrations/prometheusSlice";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { dispatchSnackbar } from "utils/generic/functions";
import { type APIResponse } from "utils/generic/types";
import { TEST_SAVED_PROM_CONNECTION_ENDPOINT } from "utils/integrations/endpoints";
import {
  type IntegrationStatusResponseType,
  type PrometheusListType,
} from "utils/integrations/types";
import raxios from "utils/raxios";

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
  // GET PROMETHEUS INTEGRATIONS
  const [getIntegrations, { data, isFetching, isError }] =
    useLazyListPromIntegrationsQuery();
  // UPDATE PROMETHEUS INTEGRATION
  const [
    updateIntegration,
    { isError: updateError, isSuccess: updateSuccess },
  ] = useUpdatePrometheusStatusMutation();
  // DELETE PROMETHEUS INTEGRATION
  const [
    deleteIntegration,
    { isError: deleteError, isSuccess: deleteSuccess },
  ] = useDeletePrometheusIntegrationMutation();
  const { selectedCluster } = useSelector(clusterSelector);
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: string;
    action: "update" | "delete" | "deleting" | "testing";
  } | null>(null);
  const getData = () => {
    if (selectedCluster) {
      getIntegrations();
    }
  };
  useEffect(() => {
    if (selectedCluster) {
      getData();
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (isError) {
      dispatchSnackbar("error", "Failed to fetch data sources");
    }
    if (updateError) {
      dispatchSnackbar("error", "Failed to update data source");
    }
    if (updateSuccess) {
      dispatchSnackbar("success", "Data source updated successfully");
    }
    if (deleteSuccess) {
      dispatchSnackbar("success", "Data source deleted successfully");
    }
    if (deleteError) {
      dispatchSnackbar("error", "Failed to delete data source");
    }
  }, [isError, updateError, updateSuccess, deleteError, deleteSuccess]);

  const handleUpdate = async (row: PrometheusListType) => {
    const { id, disabled } = row;
    setSelectedIntegration({
      id,
      action: "update",
    });
    const integ = data!.find((i) => i.id === id) as PrometheusListType;
    await updateIntegration({
      body: { ...integ, disabled: !disabled },
    });
    setSelectedIntegration(null);
  };

  const handleDelete = async () => {
    if (!selectedIntegration || selectedIntegration.action !== "delete") {
      return;
    }
    setSelectedIntegration({
      id: selectedIntegration.id,
      action: "deleting",
    });
    await deleteIntegration(selectedIntegration.id);
    setSelectedIntegration(null);
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
      const rdata = await raxios.get<
        APIResponse<IntegrationStatusResponseType>
      >(endpoint);
      const status = rdata.data.payload.integration_status;
      const isSuccess = status.connection_status === "success";
      dispatchSnackbar(
        isSuccess ? "success" : "error",
        isSuccess
          ? `Connection to metric server successful.`
          : "Connection test failed."
      );
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
        onRefresh={() => {
          getData();
        }}
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
        {isFetching ? (
          <CustomSkeleton len={8} />
        ) : (
          <TableX
            columns={columns}
            data={data ?? []}
            sortBy={sortBy}
            onSortingChange={setSortBy}
          />
        )}
      </div>
      <div className={styles.pagination}>
        {/* <PaginationX itemsPerPage={INTEGRATIONS_PAGE_SIZE} totalItems={25} /> */}
      </div>
    </div>
  );
};

export default PrometheusTable;
