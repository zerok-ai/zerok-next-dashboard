import PrivateRoute from "components/PrivateRoute";
import styles from "./ApiKeys.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ApiKeyDetail, ApiKeyHidden } from "utils/types";
import { useFetch } from "hooks/useFetch";
import {
  APIKEYS_ENDPOINT,
  APIKEY_CREATE_ENDPOINT,
  APIKEY_ID_ENDPOINT,
} from "utils/endpoints";
import dayjs from "dayjs";
import VisibilityToggleButton from "components/VisibilityToggleButton";
import CodeBlock from "components/CodeBlock";
import raxios from "utils/raxios";
import TableX from "components/themeX/TableX";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai";

import cx from "classnames";
import { DEFAULT_COL_WIDTH } from "utils/constants";

type ApiKeyDetailWithToggle = ApiKeyDetail & { visible: boolean };

const ApiKeys = () => {
  const { loading, error, data, fetchData } = useFetch<ApiKeyHidden[]>(
    APIKEYS_ENDPOINT,
    "apikeys"
  );

  const [detailedKeys, setDetailedKeys] = useState<ApiKeyDetailWithToggle[]>(
    []
  );

  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  useEffect(() => {
    if (!loading && !error && data?.length) {
      setDetailedKeys(
        data.map((hid) => {
          return { ...hid, key: null, visible: false };
        })
      );
    }
  }, [data]);

  const getApiKeyFromId = async (id: string, visibility: boolean) => {
    try {
      const selectedKey = detailedKeys.find((key) => key.id === id);
      if (!selectedKey) throw "Missing key";
      if (selectedKey.key) {
        selectedKey.visible = visibility;
      } else {
        const keyFromId = await raxios.get(
          APIKEY_ID_ENDPOINT.replace("{id}", id)
        );
        selectedKey.key = keyFromId.data.payload.apikey.id;
        selectedKey.visible = visibility;
      }
      setDetailedKeys((old) =>
        old.map((key) => {
          if (key.id === id) return selectedKey;
          return key;
        })
      );
    } catch (err) {
      // @TODO - error handling
    }
  };

  const deleteApiKey = async () => {
    try {
      await raxios.delete(
        APIKEY_ID_ENDPOINT.replace("{id}", deletingKey as string)
      );
      setDeletingKey(null);
    } catch (err) {
      // @TODO - error handling
    }
  };

  const createApiKey = async () => {
    try {
      await raxios.get(APIKEY_CREATE_ENDPOINT);
      fetchData();
    } catch (err) {}
  };

  const colHelper = createColumnHelper<ApiKeyDetailWithToggle>();

  const columns = useMemo(() => {
    return [
      colHelper.accessor("id", {
        header: "ID",
        size: DEFAULT_COL_WIDTH * 3,
      }),
      colHelper.accessor("key", {
        header: "API Key",
        size: DEFAULT_COL_WIDTH * 4,
        cell: (info) => {
          const key = info.getValue();
          return (
            <CodeBlock
              allowCopy={!!key}
              code={key && info.row.original.visible ? key : "*".repeat(36)}
              copyText={key as string}
              color="light"
            />
          );
        },
      }),
      colHelper.accessor("visible", {
        header: "Actions",
        cell: (info) => {
          const isVisible = info.getValue();
          const keyId = info.row.original.id;
          return (
            <div className={styles["api-icons-container"]}>
              <VisibilityToggleButton
                isVisibleDefault={isVisible}
                name="toggle API key visibility"
                onChange={(vis: boolean) => {
                  getApiKeyFromId(keyId, vis);
                }}
              />
              <IconButton
                onClick={() => setDeletingKey(keyId)}
                className={styles["delete-button"]}
              >
                <AiOutlineDelete />
              </IconButton>
            </div>
          );
        },
      }),
      colHelper.accessor("createdAtMs", {
        header: "Created At",
        cell: (info) => {
          return dayjs(info.getValue()).format("dddd, DD MMM YYYY HH:mm:ss A");
        },
      }),
    ];
  }, [detailedKeys]);

  const table = useReactTable({
    data: detailedKeys,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h2>API Keys</h2>
        <Button
          color="primary"
          variant="contained"
          className={styles["key-button"]}
          onClick={createApiKey}
        >
          <AiOutlineFileAdd className={styles["key-icon"]} /> Create new API key
        </Button>
      </div>
      <div className={styles["table-container"]}>
        {/* API keys table */}
        <TableX table={table} />
        {/* Delete key dialog */}
        <Dialog
          open={!!deletingKey}
          onClose={() => setDeletingKey(null)}
          className={styles["dialog-container"]}
        >
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogContentText className={styles["dialog-content"]}>
            Are you sure you want to delete the API key with id -{" "}
            <strong>{deletingKey}</strong> ? <br />
            <em>This action cannot be undone.</em>
          </DialogContentText>
          <DialogActions>
            <Button color="primary" onClick={deleteApiKey} variant="contained">
              Delete
            </Button>
            <Button color="secondary" onClick={() => setDeletingKey(null)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

ApiKeys.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Users</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ApiKeys;
