import { Button } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime } from "utils/dateHelpers";
import { BRAND_LOGOS } from "utils/images";
import { type SlackListType } from "utils/integrations/types";

import styles from "./SlackIntegration.module.scss";

const SlackIntegration = () => {
  const helper = createColumnHelper<SlackListType>();
  const data = [
    {
      name: "ZeroKelvin",
      created_at: "2021-09-09T12:00:00.000Z",
    },
  ];
  const columns = [
    helper.accessor("name", {
      header: "Workspace",
      size: DEFAULT_COL_WIDTH * 5,
    }),
    helper.accessor("created_at", {
      header: "Created",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (cell) => {
        return <span>{getFormattedTime(cell.row.original.created_at)}</span>;
      },
    }),
    helper.display({
      header: "Actions",
      size: DEFAULT_COL_WIDTH * 1,
      cell: (cell) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
            className={styles["disconnect-btn"]}
          >
            Disconnect
          </Button>
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
          <Button variant="contained" color="secondary" size="medium">
            {" "}
            Integration Guide
          </Button>
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
            <TableX columns={columns} data={data} />
          </div>
          <Button variant="contained">Connect workspace</Button>
        </div>
      </div>
    </div>
  );
};

export default SlackIntegration;
