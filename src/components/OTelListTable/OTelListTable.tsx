import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import { Fragment } from "react";

// import styles from "./OTelListTable.module.scss";

const OTelListTable = () => {
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
    </Fragment>
  );
};

export default OTelListTable;
