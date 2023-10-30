import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import dayjs from "dayjs";
import { Fragment } from "react";
import { openClusterModal } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { type OtelIntegrationListType } from "utils/integrations/types";

import styles from "./OTelListTable.module.scss";
import { OTEL_COLUMNS } from "./OTelListTable.utils";

const OTelListTable = () => {
  const { clusters } = useSelector((state) => state.cluster);
  const columns = OTEL_COLUMNS;
  const dispatch = useDispatch();
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
        showClusterSelector={false}
        rightExtras={[
          <AddNewBtn
            key={"new-otel"}
            text="Add new integration"
            onClick={() => {
              dispatch(openClusterModal());
            }}
          />,
        ]}
      />
      <div className={styles.table}>
        <TableX columns={columns} data={data} />
      </div>
    </Fragment>
  );
};

export default OTelListTable;
