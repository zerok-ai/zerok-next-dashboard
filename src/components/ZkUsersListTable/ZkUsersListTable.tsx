import { useOrganization } from "@clerk/nextjs";
import { type OrganizationMembership } from "@clerk/nextjs/dist/types/server";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dispatchSnackbar } from "utils/generic/functions";

import styles from "./ZkUsersListTable.module.scss";
import { columns } from "./ZkUsersListTable.utils";

const ITEMS_PER_PAGE = 10;

const ZkUsersListTable = () => {
  const { organization } = useOrganization();
  const router = useRouter();
  const [members, setMembers] = useState<null | OrganizationMembership[]>(null);
  const fetchMembers = async (limit: number = ITEMS_PER_PAGE) => {
    if (!organization) {
      dispatchSnackbar("error", "No organization found");
      return false;
    }
    try {
      const page = parseInt(router.query.page as string) || 0;
      const offset = (page - 1) * limit;
      const members = await organization.getMemberships({ limit, offset });
      if (members) {
        setMembers(members as unknown as OrganizationMembership[]);
      }
    } catch {
      dispatchSnackbar("error", "Failed to fetch members");
    }
  };
  useEffect(() => {
    setMembers(null);
    fetchMembers();
  }, [router]);

  return (
    <div>
      <div className={styles["table-container"]}>
        <TableX data={members} columns={columns} />
      </div>
      <div className={styles["pagination-container"]}>
        <PaginationX
          totalItems={organization?.membersCount ?? 0}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
};

export default ZkUsersListTable;
