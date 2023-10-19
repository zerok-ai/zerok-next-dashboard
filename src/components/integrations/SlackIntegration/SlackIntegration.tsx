import { LoadingButton } from "@mui/lab";
// import { Button } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { useEffect } from "react";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime } from "utils/dateHelpers";
import { BRAND_LOGOS } from "utils/images";
import {
  DISABLE_SLACK_WORKSPACE_ENDPOINT,
  GET_SLACK_WORKSPACE_ENDPOINT,
  INITIATE_SLACK_WORKSPACE_ENDPOINT,
} from "utils/integrations/endpoints";
import { type SlackListType } from "utils/integrations/types";
import raxios from "utils/raxios";

import styles from "./SlackIntegration.module.scss";

const SlackIntegration = () => {
  const helper = createColumnHelper<SlackListType>();
  const { data: workSpace, fetchData: fetchWorkspace } =
    useFetch<SlackListType>("");
  useEffect(() => {
    fetchWorkspace(GET_SLACK_WORKSPACE_ENDPOINT);
  }, []);
  const { status: disableStatus, setStatus: setDisableStatus } = useStatus();
  const { status: enableStatus, setStatus: setEnableStatus } = useStatus();

  const disableWorkspace = async () => {
    setDisableStatus({ loading: true, error: null });
    try {
      await raxios.post(DISABLE_SLACK_WORKSPACE_ENDPOINT);
      fetchWorkspace(GET_SLACK_WORKSPACE_ENDPOINT);
    } catch (err) {
      console.log({ err });
      setDisableStatus((old) => ({
        ...old,
        error:
          "Could not disable workspace, please try again or contact support",
      }));
    } finally {
      setDisableStatus((old) => ({ ...old, loading: false }));
    }
  };

  const initializeWorkspace = async () => {
    setEnableStatus({ loading: true, error: null });
    try {
      const rdata = await raxios.post(INITIATE_SLACK_WORKSPACE_ENDPOINT);
      window.location = rdata.request.responseURL;
      fetchWorkspace(GET_SLACK_WORKSPACE_ENDPOINT);
    } catch (err) {
      console.log({ err });
      setEnableStatus((old) => ({
        ...old,
        error:
          "Could not disable workspace, please try again or contact support",
      }));
    } finally {
      setEnableStatus((old) => ({ ...old, loading: false }));
    }
  };

  const columns = [
    helper.accessor("slack_workspace", {
      header: "Workspace",
      size: DEFAULT_COL_WIDTH * 2,
    }),
    helper.accessor("created_at", {
      header: "Created",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (cell) => {
        return (
          <span>
            {getFormattedTime(
              cell.row.original.created_at ?? Date.now().toString()
            )}
          </span>
        );
      },
    }),
    helper.accessor("updated_at", {
      header: "Updated",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (cell) => {
        return (
          <span>
            {getFormattedTime(
              cell.row.original.updated_at ?? Date.now().toString()
            )}
          </span>
        );
      },
    }),
    helper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH * 1,
      cell: () => {
        return (
          <LoadingButton
            variant="contained"
            color="error"
            size="small"
            className={styles["disconnect-btn"]}
            onClick={disableWorkspace}
            loading={disableStatus.loading}
          >
            Disconnect
          </LoadingButton>
        );
      },
    }),
  ];
  return (
    <div className={styles.container}>
      {/* Page header */}
      <PageHeader
        title="Slack Integration"
        htmlTitle="Slack Integration"
        showRange={false}
        showRefresh={false}
        showBreadcrumb={true}
      />
      {/* Card */}
      <div className={styles["card-container"]}>
        <div className={styles.header}>
          <div className={styles["header-left"]}>
            <img src={BRAND_LOGOS.SLACK} alt="slack" />
            {/* Title */}
            <h4>Workspaces</h4>
          </div>
          {/* <Button variant="contained" color="secondary" size="medium">
            {" "}
            Integration Guide
          </Button> */}
        </div>
        {/* content */}
        <div className={styles.content}>
          <p>
            {" "}
            Connect your slack workspace to your ZeroK account. Once a workspace
            has been authorized, you can create a channel in slack and invite
            the bot to it. The bot will then be able to send messages to the
            channel.
          </p>
          <div className={styles.table}>
            <TableX
              skeletonCount={2}
              columns={columns}
              data={
                !workSpace ? null : workSpace.slack_workspace ? [workSpace] : []
              }
              noDataMessage="No workspaces installed"
            />
          </div>
          {workSpace && !workSpace.slack_workspace && (
            <LoadingButton
              variant="contained"
              onClick={initializeWorkspace}
              loading={enableStatus.loading}
            >
              Connect workspace
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlackIntegration;
