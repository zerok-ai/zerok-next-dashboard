import { LoadingButton } from "@mui/lab";
import { Button, Chip, IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
// custom
import InviteUserForm from "components/forms/InviteUserForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DialogX from "components/themeX/DialogX";
import ModalX from "components/themeX/ModalX";
import TableX from "components/themeX/TableX";
import UserProfilePicture from "components/users/UserProfilePicture";
// hooks
import { useFetch } from "hooks/useFetch";
import useStatus from "hooks/useStatus";
import { useTrigger } from "hooks/useTrigger";
// next
import Head from "next/head";
// react
import { useEffect, useState } from "react";
// react-icons
import { AiOutlineDelete, AiOutlineUserAdd } from "react-icons/ai";
import { showSnackbar } from "redux/snackbar";
import { useDispatch } from "redux/store";
// utils
import { GET_USERS_ENDPOINT, INVITE_USER_ENDPOINT } from "utils/endpoints";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";
// types
import { type UserDetail } from "utils/types";

// styles
import styles from "./Users.module.scss";

const Users = () => {
  const { data: users, fetchData } = useFetch<UserDetail[]>(
    "users",
    GET_USERS_ENDPOINT
  );

  const { trigger, changeTrigger } = useTrigger();

  const dispatch = useDispatch();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<null | UserDetail>(null);
  const [invitingUser, setInvitingUser] = useState<null | UserDetail>(null);
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  const colHelper = createColumnHelper<UserDetail>();

  const { setStatus } = useStatus();

  useEffect(() => {
    fetchData(GET_USERS_ENDPOINT);
  }, [trigger]);

  const deleteUser = async () => {
    const endpoint = GET_USERS_ENDPOINT + `/${deletingUser!.id}`;
    try {
      setStatus({ loading: true, error: null });
      await raxios.delete(endpoint);
      clearDeletingUser();
      fetchData(GET_USERS_ENDPOINT);
      dispatch(
        showSnackbar({
          message: "Deleted user successfully",
          type: "success",
        })
      );
    } catch (err) {
      setStatus({
        loading: false,
        error: "Could not delete user, please try again",
      });
      dispatch(
        showSnackbar({
          message: "Could not delete user",
          type: "error",
        })
      );
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
      dispatch(
        showSnackbar({
          message: "User invite sent successfully",
          type: "success",
        })
      );
    } catch (err) {
      sendError(err);
      dispatch(
        showSnackbar({
          message: "Could not send user invite",
          type: "error",
        })
      );
    } finally {
      setInvitingUser(null);
      setStatus((old) => ({ ...old, loading: false }));
    }
  };

  const clearDeletingUser = () => {
    setDeletingUser(null);
  };

  const columns = [
    colHelper.accessor("name", {
      header: "Member",
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
    colHelper.accessor("id", {
      header: "Actions",
      cell: (info) => {
        const isAdmin = info.row.original.email.includes("admin");
        return (
          <div className={styles["actions-container"]}>
            <LoadingButton
              variant="contained"
              size="small"
              color="secondary"
              onClick={async () => {
                await inviteUser(info.row.original);
              }}
              className={styles["resend-button"]}
              loading={invitingUser?.id === info.row.original.id}
            >
              Resend Invite
            </LoadingButton>
            {!isAdmin && (
              <IconButton
                onClick={() => {
                  setDeletingUser(info.row.original);
                }}
                color="secondary"
                className={styles["delete-button"]}
                // size="small"
              >
                <AiOutlineDelete />
              </IconButton>
            )}
          </div>
        );
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
