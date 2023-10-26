import PageHeader from "components/helpers/PageHeader";
import TableX from "components/themeX/TableX";
import dayjs from "dayjs";
import { Fragment } from "react";
import { useSelector } from "redux/store";
import { type EBPFIntegrationListType } from "utils/integrations/types";
import { type TableActionPropType } from "utils/tables/types";

import { getEBPFColumns } from "./EBPFListTable.utils";

const EBPFListTable = () => {
  const { clusters } = useSelector((state) => state.cluster);
  const disableEBPF = () => {
    console.log("disableEBPF");
  };
  const columnActions: TableActionPropType<EBPFIntegrationListType> = {
    disable: {
      onClick: disableEBPF,
    },
  };
  const columns = getEBPFColumns({ actions: columnActions });
  const data: EBPFIntegrationListType[] = clusters.map((cl) => {
    return {
      name: cl.name,
      created_at: dayjs().toString(),
      created_by: "thalapathy vijay",
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
      />
      <TableX columns={columns} data={data} />
    </Fragment>
  );
};

export default EBPFListTable;
