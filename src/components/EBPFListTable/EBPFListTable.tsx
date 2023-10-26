import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import { Fragment } from "react";

const EBPFListTable = () => {
  return (
    <Fragment>
      <PageHeader
        title="EBPF Integrations"
        showRefresh={true}
        showBreadcrumb={true}
        showRange={false}
        htmlTitle="EBPF Integrations"
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

export default EBPFListTable;
