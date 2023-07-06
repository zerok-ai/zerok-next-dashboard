import PrivateRoute from "components/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import  Head from "next/head";
import styles from "./Users.module.scss";
import { GET_USERS_ENDPOINT, INVITE_USER_ENDPOINT } from "utils/endpoints";
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
import { useState } from "react";
import ModalX from "components/themeX/ModalX";
import InviteUserForm from "components/forms/InviteUserForm";
import useStatus from "hooks/useStatus";
import raxios from "utils/raxios";
import DialogX from "components/themeX/DialogX";
import { LoadingButton } from "@mui/lab";

const Users = () => {
  const {
    loading: usersLoading,
    error,
    data: users,
    fetchData,
  } = useFetch<UserDetail>("users", GET_USERS_ENDPOINT);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<null | UserDetail>(null);
  const toggleForm = () => setIsFormOpen(!isFormOpen);
  const colHelper = createColumnHelper<UserDetail>();

  const { status, setStatus } = useStatus();

  const deleteUser = async () => {
    const endpoint = GET_USERS_ENDPOINT + `/${deletingUser?.id}`;
    try {
      setStatus({ loading: true, error: null });
      await raxios.delete(endpoint);
      clearDeletingUser();
    } catch (err) {
      setStatus({
        loading: false,
        error: "Could not delete user, please try again",
      });
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  };

  const inviteUser = async (user: UserDetail) => {
    const { name, email } = user;
    const nameArr = name.split(" ");
    const firstName = nameArr[0];
    const lastName = nameArr.slice(1).join(" ");
    try {
      setStatus({ loading: true, error: null });
      await raxios.post(INVITE_USER_ENDPOINT, {
        name: firstName,
        familyName: lastName,
        email,
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: "Could not delete user, please try again",
      });
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  };

  const clearDeletingUser = () => setDeletingUser(null);

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
            <LoadingButton
              variant="outlined"
              size="small"
              onClick={() => inviteUser(info.row.original)}
              loading={status.loading}
            >
              Resend Invite
            </LoadingButton>
            <IconButton onClick={() => setDeletingUser(info.row.original)}>
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
        <Button
          variant="contained"
          className={styles["user-button"]}
          onClick={toggleForm}
        >
          <AiOutlineUserAdd className={styles["user-icon"]} /> Add a new user
        </Button>
      </div>
      <div className={styles["table-container"]}>
        <TableX table={table} data={users} />
      </div>
      <ModalX
        isOpen={isFormOpen}
        onClose={toggleForm}
        title="Invite a new team member"
      >
        <div className={styles["form-container"]}>
          <InviteUserForm
            onFinish={() => {
              toggleForm();
              fetchData(GET_USERS_ENDPOINT);
            }}
          />
        </div>
      </ModalX>
      <DialogX
        title="Delete user"
        isOpen={!!deletingUser}
        onCancel={clearDeletingUser}
        onClose={clearDeletingUser}
        onSuccess={deleteUser}
      >
        <div className={styles["dialog-content"]}>
          Are you sure you want to delete <strong>{deletingUser?.name}</strong>{" "}
          from your team? <br />
          <em>This action cannot be undone.</em>
        </div>
      </DialogX>
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
