import CustomSkeleton from "components/custom/CustomSkeleton";
import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import DialogX from "components/themeX/DialogX";
import TableX from "components/themeX/TableX";
import ZkPrivateRoute from "components/ZkPrivateRoute";
import {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useListApiKeysQuery,
} from "fetchers/user/apiKeysSlice";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { dispatchSnackbar } from "utils/generic/functions";
import { type ApiKeyDetail } from "utils/types";

import styles from "./ApiKeysPage.module.scss";
import { getApiKeyColumns } from "./ApiKeysPage.utils";

type ApiKeyDetailWithToggle = ApiKeyDetail & { visible: boolean };

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyDetailWithToggle[] | null>(null);
  const { data, isError, isFetching, refetch } = useListApiKeysQuery();
  const [
    createApiKey,
    {
      isLoading: createLoading,
      isError: createError,
      isSuccess: createSuccess,
    },
  ] = useCreateApiKeyMutation();

  const [deleteApiKey, { isError: deleteError, isSuccess: deleteSuccess }] =
    useDeleteApiKeyMutation();

  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  useEffect(() => {
    setApiKeys(null);
    if (data) {
      setApiKeys([...data]);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      dispatchSnackbar("error", "Could not fetch API keys");
    }
    if (createError) {
      dispatchSnackbar("error", "Could not create API key");
    }
    if (createSuccess) {
      dispatchSnackbar("success", "API key created successfully");
    }
    if (deleteError) {
      dispatchSnackbar("error", "Could not delete API key");
    }
    if (deleteSuccess) {
      dispatchSnackbar("success", "API key deleted successfully");
    }
  }, [isError, createError, createSuccess, deleteError, deleteSuccess]);

  const columns = getApiKeyColumns(apiKeys ?? [], deletingKey, setDeletingKey);

  const createButton = useMemo(() => {
    return (
      <AddNewBtn
        onClick={createApiKey}
        loading={createLoading}
        text="Create a new API Key"
        key="create-btn"
      />
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader
          title="API Keys"
          showRange={false}
          showRefresh={true}
          onRefresh={refetch}
          showClusterSelector={false}
          rightExtras={[createButton]}
        />
      </div>
      <div className={styles["table-container"]}>
        {/* API keys table */}
        {isFetching ? (
          <CustomSkeleton len={8} />
        ) : (
          <TableX
            columns={columns}
            data={apiKeys ?? []}
            noDataMessage={isError ? "Could not fetch API keys" : "No data"}
          />
        )}
        {/* Delete key dialog */}
        <DialogX
          title="Delete API Key"
          isOpen={deletingKey !== null}
          onCancel={() => {
            setDeletingKey(null);
          }}
          onClose={() => {
            setDeletingKey(null);
          }}
          onSuccess={() => {
            deleteApiKey(deletingKey as string);
            setDeletingKey(null);
          }}
        >
          Are you sure you want to delete the API key with id -{" "}
          <strong>{deletingKey}</strong> ? <br />
          <em>This action cannot be undone.</em>
        </DialogX>
      </div>
    </div>
  );
};

ApiKeys.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <ZkPrivateRoute>
      <Head>
        <title>ZeroK Dashboard | API Keys</title>
      </Head>
      {page}
    </ZkPrivateRoute>
  );
};

export default ApiKeys;
