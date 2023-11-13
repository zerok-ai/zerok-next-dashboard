import { type SortingState } from "@tanstack/react-table";
import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/helpers/TableFilter";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type TableSortOptions } from "utils/tables/types";

export const PROBE_SORT_OPTIONS: TableSortOptions[] = [
  {
    label: "Latest first",
    value: "created_at:desc",
    sort: "desc",
  },
  {
    label: "Earliest first",
    value: "created_at:asc",
    sort: "asc",
  },
];

const DEFAULT_SORT = {
  id: PROBE_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROBE_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const ProbesListPageHeader = () => {
  const [sortBy, setSortBy] = useState<SortingState>([DEFAULT_SORT]);
  const leftExtras = useMemo(() => {
    return [
      <TableFilter
        key={"probe-table-filter"}
        sortBy={sortBy[0]}
        options={PROBE_SORT_OPTIONS}
        onChange={(val) => {
          setSortBy([val]);
        }}
      />,
    ];
  }, [sortBy]);
  const headerProps = useMemo(() => {
    const rightExtras = [
      <Link href="/probes/create" key={"new-probe-btn"}>
        <AddNewBtn text="Create a new probe" />
      </Link>,
    ];
    return {
      title: "Probes",
      showRange: false,
      showRefresh: true,
      leftExtras,
      rightExtras,
      //   onRefresh: changeTrigger,
    };
  }, []);
  return <PageHeader {...headerProps} />;
};

export default ProbesListPageHeader;
