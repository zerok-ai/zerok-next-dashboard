import { Button, IconButton } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import cx from "classnames";
import CodeBlock from "components/CodeBlock";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import DialogX from "components/themeX/DialogX";
import TableX from "components/themeX/TableX";
import VisibilityToggleButton from "components/VisibilityToggleButton";
import dayjs from "dayjs";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useMemo, useState } from "react";
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import {
  APIKEY_CREATE_ENDPOINT,
  APIKEY_ID_ENDPOINT,
  APIKEYS_ENDPOINT,
} from "utils/endpoints";
import raxios from "utils/raxios";
import { type ApiKeyDetail } from "utils/types";

import styles from "./ApiKeys.module.scss";

type ApiKeyDetailWithToggle = ApiKeyDetail & { visible: boolean };

const addToggle = (
  data: ApiKeyDetailWithToggle[]
): ApiKeyDetailWithToggle[] => {
  return data.map((hid) => {
    return { ...hid, key: null, visible: false };
  });
};

const ApiKeys = () => {
  const {
    data: apiKeys,
    fetchData,
    loading,
    setData: setApiKeys,
  } = useFetch<ApiKeyDetailWithToggle[]>(
    "apikeys",
    APIKEYS_ENDPOINT,
    addToggle
  );

  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const getApiKeyFromId = async (id: string, visibility: boolean) => {
    if (!apiKeys) return;
    try {
      const selectedKey = apiKeys.find((key) => key.id === id);
      if (selectedKey == null) throw { err: "Missing key" };
      if (selectedKey.key !== null) {
        selectedKey.visible = visibility;
      } else {
        const keyFromId = await raxios.get(
          APIKEY_ID_ENDPOINT.replace("{id}", id)
        );
        selectedKey.key = keyFromId.data.payload.apikey.key;
        selectedKey.visible = visibility;
      }
      setApiKeys(
        apiKeys.map((key) => {
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
      fetchData(APIKEYS_ENDPOINT);
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
        size: DEFAULT_COL_WIDTH * 3,
        cell: (info) => {
          const key = info.getValue();
          return (
            <CodeBlock
              allowCopy={key !== null}
              code={key && info.row.original.visible ? key : "*".repeat(16)}
              copyText={key as string}
              color="light"
            />
          );
        },
      }),
      colHelper.accessor("visible", {
        header: "Actions",
        size: DEFAULT_COL_WIDTH * 1,
        cell: (info) => {
          const isVisible = info.getValue();
          const keyId = info.row.original.id;
          return (
            <div className={cx(styles["api-icons-container"])}>
              <VisibilityToggleButton
                isVisibleDefault={isVisible}
                name="toggle API key visibility"
                onChange={(vis: boolean) => {
                  getApiKeyFromId(keyId, vis);
                }}
              />
              <IconButton
                onClick={() => {
                  setDeletingKey(keyId);
                }}
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
  }, [apiKeys]);

  const table = useReactTable({
    data: apiKeys ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader
          title="API Keys"
          showRange={false}
          align="right"
          showRefresh={false}
          extras={[
            <Button
              color="primary"
              variant="contained"
              className={styles["key-button"]}
              onClick={createApiKey}
              key={nanoid()}
            >
              <AiOutlineFileAdd className={styles["key-icon"]} /> Create new API
              key
            </Button>,
          ]}
        />
      </div>
      <div className={styles["table-container"]}>
        {/* API keys table */}
        {loading ? (
          <CustomSkeleton len={8} />
        ) : (
          <TableX table={table} data={apiKeys ?? []} />
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
          onSuccess={deleteApiKey}
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
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | API Keys</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ApiKeys;
