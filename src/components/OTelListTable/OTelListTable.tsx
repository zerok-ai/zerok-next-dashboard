import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import dayjs from "dayjs";
import { Fragment } from "react";
import { useSelector } from "redux/store";
import { type OtelIntegrationListType } from "utils/integrations/types";

import { OTEL_COLUMNS } from "./OTelListTable.utils";

// import styles from "./OTelListTable.module.scss";

const OTelListTable = () => {
  const { clusters } = useSelector((state) => state.cluster);
  const columns = OTEL_COLUMNS;
  const data: OtelIntegrationListType[] = clusters.map((cluster) => ({
    name: cluster.name,
    created_at: dayjs().toString(),
    created_by: "thalapathy vijay",
    updated_at: dayjs().toString(),
    integration_status: Math.random() * 100,
  }));
  return (
    <Fragment>
      <PageHeader
        title="OpenTelemetry Integrations"
        showRefresh={true}
        showBreadcrumb={true}
        showRange={false}
        htmlTitle="OpenTelemetry Integrations"
        rightExtras={[
          <AddNewBtn
            key={"new-otel"}
            text="Add new integration"
            onClick={() => {
              console.log("Add new integration");
            }}
          />,
        ]}
      />
      <TableX data={data} columns={columns} />
    </Fragment>
  );
};

export default OTelListTable;
