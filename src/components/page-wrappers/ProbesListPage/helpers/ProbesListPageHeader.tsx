import { type SortingState } from "@tanstack/react-table";
import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/helpers/TableFilter";
import Link from "next/link";
import { useMemo } from "react";
import { PROBE_SORT_OPTIONS } from "utils/tables/constants";

interface ProbesListPageHeaderProps {
  onRefresh: () => void;
  sort: SortingState;
  updateSort: (sort: SortingState) => void;
}

const ProbesListPageHeader = ({
  onRefresh,
  sort,
  updateSort,
}: ProbesListPageHeaderProps) => {
  const leftExtras = useMemo(() => {
    return [
      <TableFilter
        key={"probe-table-filter"}
        sortBy={sort[0]}
        options={PROBE_SORT_OPTIONS}
        onChange={(val) => {
          updateSort([val]);
        }}
      />,
    ];
  }, [sort]);
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
      onRefresh,
    };
  }, [sort]);
  return <PageHeader {...headerProps} />;
};

export default ProbesListPageHeader;
