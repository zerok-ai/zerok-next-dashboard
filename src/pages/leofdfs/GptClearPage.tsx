import { Button } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import Head from "next/head";
import { showSnackbar } from "redux/snackbar";
import { useDispatch, useSelector } from "redux/store";
import raxios from "utils/raxios";

import styles from "./GptClearPage.module.scss";

const GptClearPage = () => {
  const dispatch = useDispatch();
  const { selectedCluster } = useSelector((state) => state.cluster);
  const clearReporting = async () => {
    try {
      await raxios.post(`/v1/c/${selectedCluster!}/gpt/clearReporting`);
      dispatch(showSnackbar({ message: "Reporting cleared", type: "success" }));
    } catch (err) {
      dispatch(
        showSnackbar({ message: "Error clearing reporting", type: "error" })
      );
    }
  };

  const clearIssueData = async () => {
    try {
      await raxios.post(`/v1/c/${selectedCluster!}/gpt/clearAllIssueData`);
      dispatch(
        showSnackbar({ message: "Issue data cleared", type: "success" })
      );
    } catch (err) {
      dispatch(
        showSnackbar({ message: "Error clearing issue data", type: "error" })
      );
    }
  };

  const triggerTask = async () => {
    try {
      await raxios.post(`/v1/c/${selectedCluster!}/gpt/triggerTask`);
      dispatch(showSnackbar({ message: "Task triggered", type: "success" }));
    } catch (err) {
      dispatch(
        showSnackbar({ message: "Error triggering task", type: "error" })
      );
    }
  };
  return (
    <div>
      <PageHeader title="Clear GPT" showRange={false} showRefresh={false} />
      <div className={styles.container}>
        <Button variant="contained" onClick={clearReporting}>
          Clear Reporting
        </Button>
        <Button variant="contained" color="secondary" onClick={clearIssueData}>
          Clear Issue Data
        </Button>
        <Button variant="contained" onClick={triggerTask}>
          Trigger Task
        </Button>
      </div>
    </div>
  );
};

GptClearPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Clear GPT</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default GptClearPage;
