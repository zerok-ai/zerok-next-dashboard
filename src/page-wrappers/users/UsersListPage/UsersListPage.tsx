import { Button, Chip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
// custom
import InviteUserForm from "components/forms/InviteUserForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import TableActions from "components/helpers/TableActions";
import PageLayout from "components/layouts/PageLayout";
import DialogX from "components/themeX/DialogX";
import ModalX from "components/themeX/ModalX";
import TableX from "components/themeX/TableX";
import UserProfilePicture from "components/users/UserProfilePicture";
// hooks
import { useFetch } from "hooks/useFetch";
import { useTrigger } from "hooks/useTrigger";
// next
import Head from "next/head";
// react
import { useEffect, useState } from "react";
// react-icons
import { AiOutlineUserAdd } from "react-icons/ai";
import { DEFAULT_COL_WIDTH } from "utils/constants";
// utils
import { GET_USERS_ENDPOINT, INVITE_USER_ENDPOINT } from "utils/endpoints";
import { dispatchSnackbar } from "utils/generic/functions";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";
import { type TableActionItem } from "utils/tables/types";
// types
import { type UserDetail } from "utils/types";

// styles
import styles from "./UsersListPage.module.scss";

const filterUsers = (users: UserDetail[]) => {
  return users.filter((user) => user.name.trim().length > 0);
};

const Users = () => {
  const { data: users, fetchData } = useFetch<UserDetail[]>(
    "users",
    GET_USERS_ENDPOINT,
    filterUsers
  );

  const { trigger, changeTrigger } = useTrigger();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<null | UserDetail>(null);
  const [invitingUser, setInvitingUser] = useState<null | UserDetail>(null);
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  const colHelper = createColumnHelper<UserDetail>();

  useEffect(() => {
    fetchData(GET_USERS_ENDPOINT);
  }, [trigger]);

  const deleteUser = async () => {
    const endpoint = GET_USERS_ENDPOINT + `/${deletingUser!.id}`;
    try {
      await raxios.delete(endpoint);
      clearDeletingUser();
      fetchData(GET_USERS_ENDPOINT);
      dispatchSnackbar("success", "Deleted user successfully");
    } catch (err) {
      dispatchSnackbar("error", "Could not delete user");
    } finally {
      clearDeletingUser();
    }
  };

  const inviteUser = async (user: UserDetail) => {
    setInvitingUser(user);
    const { name, email } = user;
    const nameArr = name.split(" ");
    const firstName = nameArr[0];
    const lastName = nameArr.slice(1).join(" ");
    try {
      await raxios.post(INVITE_USER_ENDPOINT, {
        name: firstName,
        familyName: lastName,
        email,
      });
      dispatchSnackbar("success", "User invite sent successfully");
    } catch (err) {
      sendError(err);
      dispatchSnackbar("error", "Could not send user invite");
    } finally {
      setInvitingUser(null);
    }
  };

  const clearDeletingUser = () => {
    setDeletingUser(null);
  };

  const columns = [
    colHelper.accessor("name", {
      header: "Member",
      size: DEFAULT_COL_WIDTH * 5,
      cell: (info) => {
        const type = info.getValue().trim();
        return (
          <div className={styles["member-container"]}>
            <div className={styles["member-picture-container"]}>
              <UserProfilePicture name={info.getValue()} />
            </div>
            <div className={styles["member-info-container"]}>
              <h6>{type.length > 0 ? type : "Admin"}</h6>
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
              <Chip
                label="Admin"
                color="info"
                variant="outlined"
                size="small"
              />
            ) : (
              <Chip
                label="Developer"
                color="warning"
                variant="outlined"
                size="small"
              />
            )}
          </div>
        );
      },
    }),
    colHelper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH / 3,
      cell: (info) => {
        const actions: TableActionItem[] = [
          {
            element: <span>Resend Invite</span>,
            onClick: () => {
              inviteUser(info.row.original);
            },
          },
          {
            element: <span>Delete User</span>,
            onClick: () => {
              setDeletingUser(info.row.original);
            },
          },
        ];
        const loading =
          deletingUser === info.row.original ||
          invitingUser === info.row.original;
        return <TableActions list={actions} loading={loading} />;
      },
    }),
  ];

  const AddUserButton = () => {
    return (
      <Button
        variant="contained"
        className={styles["user-button"]}
        onClick={toggleForm}
      >
        <AiOutlineUserAdd className={styles["user-icon"]} /> Add a new user
      </Button>
    );
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Users"
        showRange={false}
        showRefresh={true}
        onRefresh={changeTrigger}
        rightExtras={[<AddUserButton key={"add-btn"} />]}
        showClusterSelector={false}
      />
      <div className={styles["table-container"]}>
        <TableX columns={columns} data={users ?? null} />
      </div>
      <ModalX
        isOpen={isFormOpen}
        onClose={toggleForm}
        title="Invite a new team member"
      >
        <div className={styles["form-container"]}>
          <InviteUserForm
            onFinish={async () => {
              toggleForm();
              await fetchData(GET_USERS_ENDPOINT);
            }}
          />
        </div>
      </ModalX>
      <DialogX
        title="Delete user"
        isOpen={!(deletingUser == null)}
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
