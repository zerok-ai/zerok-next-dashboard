import PrivateRoute from "components/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import  Head from "next/head";
import styles from "./Users.module.scss";
import { GET_USERS_ENDPOINT } from "utils/endpoints";
import { useFetch } from "hooks/useFetch";
import { Button, Chip } from "@mui/material";
import { UserDetail } from "utils/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import UserProfilePicture from "components/UserProfilePicture";
import { IconButton } from "@mui/material";
import { AiOutlineDelete, AiOutlineUserAdd } from "react-icons/ai";
import TableX from "components/themeX/TableX";

const Users = () => {
  const {
    loading,
    error,
    data: users,
  } = useFetch<UserDetail>(GET_USERS_ENDPOINT, "users");

  const colHelper = createColumnHelper<UserDetail>();

  const columns = [
    colHelper.accessor("name", {
      header: "Member",
      cell: (info) => {
        return (
          <div className={styles["member-container"]}>
            <div className={styles["member-picture-container"]}>
              <UserProfilePicture name={info.getValue()} />
            </div>
            <div className={styles["member-info-container"]}>
              <h6>{info.getValue().trim() || "Admin"}</h6>
              <small>{info.row.original.email}</small>
            </div>
          </div>
        );
      },
    }),
    colHelper.accessor("email", {
      header: "Role",
      cell: (info) => {
        const isAdmin = info.getValue().includes("admin");
        return (
          <div className={styles["role-container"]}>
            {isAdmin ? (
              <Chip label="Admin" color="info" variant="outlined" />
            ) : (
              <Chip label="Developer" color="warning" variant="outlined" />
            )}
          </div>
        );
      },
    }),
    colHelper.accessor("id", {
      header: "Actions",
      cell: (info) => {
        return (
          <div className={styles["actions-container"]}>
            <Button variant="outlined" size="small">
              Resend Invite
            </Button>
            <IconButton>
              <AiOutlineDelete />
            </IconButton>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h2>Users</h2>
        <Button variant="contained" className={styles["user-button"]}>
          <AiOutlineUserAdd className={styles["user-icon"]} /> Add a new user
        </Button>
      </div>
      <div className={styles["table-container"]}>
        <TableX table={table} />
      </div>
    </div>
  );
};

Users.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Users</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};


export default Users;
