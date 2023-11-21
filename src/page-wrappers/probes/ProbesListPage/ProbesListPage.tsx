import { type SortingState } from "@tanstack/react-table";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DialogX from "components/themeX/DialogX";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { showSnackbar } from "redux/snackbar";
import { useDispatch, useSelector } from "redux/store";
import raxios from "utils/raxios";
import { PROBE_PAGE_SIZE } from "utils/scenarios/constants";
import {
  DELETE_PROBE_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
  UPDATE_PROBE_STATUS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { type ScenarioDetailType } from "utils/scenarios/types";
import { sendError } from "utils/sentry";
import { PROBE_SORT_OPTIONS } from "utils/tables/constants";

import ProbesListPageHeader from "./helpers/ProbesListPageHeader";
import styles from "./ProbesListPage.module.scss";
import { probeListColumns } from "./ProbesListPage.utils";

export const DEFAULT_SORT = {
  id: PROBE_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROBE_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const Probe = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const dispatch = useDispatch();
  const {
    data: scenarios,
    fetchData: fetchScenarios,
    setData: setScenarios,
    error: scenariosError,
  } = useFetch<ScenarioDetailType[]>("scenarios");
  const [selectedProbe, setSelectedProbe] = useState<null | {
    scenario_id: string;
    action: "update" | "delete" | "deleting";
  }>(null);
  const [sortBy, setSortBy] = useState<SortingState>([DEFAULT_SORT]);
  const router = useRouter();
  const page = router.query.page ?? "1";
  const resetSelectedProbe = () => {
    setSelectedProbe(null);
  };

  const getScenarios = async () => {
    setScenarios(null);
    const endpoint = LIST_SCENARIOS_ENDPOINT.replace(
      "{limit}",
      PROBE_PAGE_SIZE.toString()
    )
      .replace(
        "{offset}",
        ((parseInt(page as string) - 1) * PROBE_PAGE_SIZE).toString()
      )
      .replace("{cluster_id}", selectedCluster!);
    fetchScenarios(endpoint);
  };

  useEffect(() => {
    if (selectedCluster) {
      setScenarios(null);
      getScenarios();
    }
  }, [selectedCluster, router]);

  const handleSwitchChange = async (scenario: ScenarioDetailType) => {
    const scenario_id = scenario.scenario.scenario_id;
    const isEnabled = !scenario.disabled_at;
    setSelectedProbe({ scenario_id, action: "update" });
    try {
      const endpoint = UPDATE_PROBE_STATUS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      ).replace("{scenario_id}", scenario_id);
      await raxios.put(endpoint, {
        action: !isEnabled ? "enable" : "disable",
      });
      dispatch(
        showSnackbar({
          message: `Probe ${!isEnabled ? "enabled" : "disabled"} successfully`,
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showSnackbar({
          message: `Failed to ${!isEnabled ? "enable" : "disable"} probe`,
          type: "error",
        })
      );
    } finally {
      resetSelectedProbe();
      getScenarios();
    }
  };

  const handleDelete = async () => {
    if (!selectedProbe || selectedProbe.action !== "delete") return;
    const scenario_id = selectedProbe.scenario_id;
    setSelectedProbe({ scenario_id, action: "deleting" });
    try {
      const endpoint = DELETE_PROBE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      ).replace("{scenario_id}", scenario_id);
      await raxios.delete(endpoint);
      dispatch(
        showSnackbar({
          message: `Probe deleted successfully`,
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showSnackbar({
          message: `Failed to delete probe`,
          type: "error",
        })
      );
      sendError(err);
    } finally {
      getScenarios();
      resetSelectedProbe();
    }
  };

  const columns = probeListColumns({
    selectedProbe: selectedProbe?.scenario_id ?? null,
    onUpdateProbeStatus: handleSwitchChange,
    onDeleteProbe: (scenario_id) => {
      setSelectedProbe({ scenario_id, action: "delete" });
    },
  });

  return (
    <div className={styles.container}>
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
      {/* Headers and sort */}
      <ProbesListPageHeader
        onRefresh={getScenarios}
        sort={sortBy}
        updateSort={setSortBy}
      />
      {!scenariosError ? (
        <div className={styles.table}>
          <TableX
            data={scenarios ?? null}
            columns={columns}
            sortBy={sortBy}
            onSortingChange={setSortBy}
          />
        </div>
      ) : (
        <p>Could not fetch scenarios, please try again later.</p>
      )}
    </div>
  );
};

Probe.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Probes</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Probe;
