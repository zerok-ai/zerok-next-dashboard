import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import dayjs from "dayjs";
import { Fragment } from "react";
import { useSelector } from "redux/store";
import { type EBPFIntegrationListType } from "utils/integrations/types";

import styles from "./EBPFListTable.module.scss";
import { getEBPFColumns } from "./EBPFListTable.utils";

const EBPFListTable = () => {
  const { clusters } = useSelector((state) => state.cluster);
  const disableEBPF = (row: EBPFIntegrationListType) => {
    console.log("disableEBPF");
  };
  const columns = getEBPFColumns({ onUpdate: disableEBPF });
  const data: EBPFIntegrationListType[] = clusters.map((cl) => {
    return {
      name: cl.name,
      created_at: dayjs().toString(),
      created_by: "ZeroK user",
      updated_at: dayjs().toString(),
      enabled: true,
    };
  });
  return (
    <Fragment>
      <PageHeader
        title="EBPF Integrations"
        showRefresh={true}
        showBreadcrumb={true}
        showRange={false}
        htmlTitle="EBPF Integrations"
        showClusterSelector={false}
      />
      <div className={styles.table}>
        <TableX columns={columns} data={data} />
      </div>
    </Fragment>
  );
};

export default EBPFListTable;
