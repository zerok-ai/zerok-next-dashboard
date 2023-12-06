import {
  type OrganizationMembership,
  type OrganizationMembershipPublicUserData,
} from "@clerk/nextjs/dist/types/server";
import { createColumnHelper } from "@tanstack/react-table";
import TableTimeCell from "components/TableTimeCell";
import ChipX from "components/themeX/ChipX";
import { DEFAULT_COL_WIDTH } from "utils/constants";

const helper = createColumnHelper<OrganizationMembership>();
export const columns = [
  helper.accessor("publicUserData.firstName", {
    header: "Name",
    size: DEFAULT_COL_WIDTH * 1.5,
    cell: (info) => {
      const { firstName, lastName } = info.cell.row.original
        .publicUserData as OrganizationMembershipPublicUserData;
      return `${firstName ?? "Unknown"} ${lastName ?? "Unknown"}`;
    },
  }),
  helper.accessor("publicUserData.identifier", {
    header: "Email",
    size: DEFAULT_COL_WIDTH * 1.5,
  }),
  helper.accessor("role", {
    header: "Role",
    size: DEFAULT_COL_WIDTH,
    cell: (info) => {
      const isAdmin = info.getValue() === "admin";
      return (
        <ChipX
          label={isAdmin ? "Admin" : "Member"}
          color={"default"}
          upperCase={false}
        />
      );
    },
  }),
  helper.accessor("createdAt", {
    header: "Joined",
    cell: (info) => {
      return <TableTimeCell time={info.getValue()} epoch={false} />;
    },
  }),
];
