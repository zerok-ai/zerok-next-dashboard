import { type SortingState } from "@tanstack/react-table";
import ValidClusterWrapper from "components/clusters/ValidClusterWrapper";
import CustomSkeleton from "components/custom/CustomSkeleton";
import DialogX from "components/themeX/DialogX";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import ZkPrivateRoute from "components/ZkPrivateRoute";
import {
  useDeleteProbeMutation,
  useLazyGetProbesQuery,
  useUpdateProbeMutation,
} from "fetchers/probes/probeSlice";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { dispatchSnackbar, isClusterHealthy } from "utils/generic/functions";
import { PROBE_PAGE_SIZE } from "utils/scenarios/constants";
import { type ScenarioDetailType } from "utils/scenarios/types";
import { PROBE_SORT_OPTIONS } from "utils/tables/constants";

import ProbesListPageHeader from "./helpers/ProbesListPageHeader";
import styles from "./ProbesListPage.module.scss";
import { probeListColumns } from "./ProbesListPage.utils";

export const DEFAULT_SORT = {
  id: PROBE_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROBE_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const Probe = () => {
  const { selectedCluster, clusters } = useSelector(clusterSelector);
  // GET PROBES
  const [getProbes, { data: probes, isError, isFetching }] =
    useLazyGetProbesQuery();
  // DELETE PROBE
  const [deleteProbe, { isError: deleteError, isSuccess: deleteSuccess }] =
    useDeleteProbeMutation();
  // UPDATE PROBE STATUS
  const [updateProbe, { isError: updateError, isSuccess: updateSuccess }] =
    useUpdateProbeMutation();

  const [selectedProbe, setSelectedProbe] = useState<null | {
    scenario_id: string;
    action: "update" | "delete" | "deleting";
  }>(null);
  const [sortBy, setSortBy] = useState<SortingState>([DEFAULT_SORT]);
  const router = useRouter();
  const page = router.query.page ?? "1";
  const range = router.query.range ?? DEFAULT_TIME_RANGE;
  const resetSelectedProbe = () => {
    setSelectedProbe(null);
  };

  const fetchProbes = () => {
    const limit = PROBE_PAGE_SIZE;
    const offset = (parseInt(page as string) - 1) * PROBE_PAGE_SIZE;
    getProbes({
      limit,
      offset,
      range: range as string,
    });
  };

  useEffect(() => {
    if (selectedCluster) {
      const cluster = clusters.find((c) => c.id === selectedCluster);
      if (cluster && isClusterHealthy(cluster)) {
        fetchProbes();
      }
    }
  }, [selectedCluster, router]);

  const handleSwitchChange = async (scenario: ScenarioDetailType) => {
    const scenario_id = scenario.scenario.scenario_id;
    const isEnabled = !scenario.disabled_at;
    setSelectedProbe({ scenario_id, action: "update" });
    updateProbe({
      id: scenario_id,
      body: {
        action: !isEnabled ? "enable" : "disable",
      },
    });
    resetSelectedProbe();
  };

  const handleDelete = async () => {
    if (!selectedProbe || selectedProbe.action !== "delete") return;
    const scenario_id = selectedProbe.scenario_id;
    setSelectedProbe({ scenario_id, action: "deleting" });
    await deleteProbe(scenario_id);
    resetSelectedProbe();
  };

  const columns = probeListColumns({
    selectedProbe: selectedProbe?.scenario_id ?? null,
    onUpdateProbeStatus: handleSwitchChange,
    onDeleteProbe: (scenario_id) => {
      setSelectedProbe({ scenario_id, action: "delete" });
    },
  });

  useEffect(() => {
    if (deleteSuccess) {
      dispatchSnackbar("success", "Probe deleted successfully");
    }
    if (deleteError) {
      dispatchSnackbar("error", "Failed to delete probe");
    }
    if (updateSuccess) {
      dispatchSnackbar("success", "Probe updated successfully");
    }
    if (updateError) {
      dispatchSnackbar("error", "Failed to update probe");
    }
  }, [deleteSuccess, deleteError, updateError, updateSuccess]);

  const deleteDialog = useMemo(() => {
    return (
      <DialogX
        isOpen={!!(selectedProbe && selectedProbe.action === "delete")}
        title="Delete Probe"
        successText="Delete"
        cancelText="Cancel"
        onClose={resetSelectedProbe}
        onSuccess={handleDelete}
        onCancel={resetSelectedProbe}
      >
        <span>Are you sure you want to delete this probe?</span> <br />
        <em>This action cannot be undone.</em>
      </DialogX>
    );
  }, [selectedProbe]);

  return (
    <div className={styles.container}>
      {deleteDialog}
      {/* Headers and sort */}
      <ProbesListPageHeader
        onRefresh={fetchProbes}
        sort={sortBy}
        updateSort={setSortBy}
      />
      <ValidClusterWrapper>
        <div className={styles.table}>
          {!isFetching ? (
            <TableX
              data={probes?.scenarios ?? []}
              columns={columns}
              sortBy={sortBy}
              onSortingChange={setSortBy}
            />
          ) : (
            <CustomSkeleton len={8} />
          )}
        </div>
        <div className={styles["pagination-container"]}>
          <PaginationX
            totalItems={probes?.total_rows ?? 0}
            itemsPerPage={PROBE_PAGE_SIZE}
          />
        </div>
      </ValidClusterWrapper>
      {isError && <p>Could not fetch scenarios, please try again later.</p>}
    </div>
  );
};

Probe.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <ZkPrivateRoute isClusterRoute={true}>
      <Head>
        <title>ZeroK Dashboard | Probes</title>
      </Head>
      {page}
    </ZkPrivateRoute>
  );
};

export default Probe;
