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
import { APIKEYS_ENDPOINT, APIKEY_ID_ENDPOINT } from "utils/endpoints";
import dayjs from "dayjs";
import VisibilityToggleButton from "components/VisibilityToggleButton";
import CodeBlock from "components/CodeBlock";
import raxios from "utils/raxios";
import TableX from "components/themeX/TableX";

type ApiKeyDetailWithToggle = ApiKeyDetail & { visible: boolean };

const ApiKeys = () => {
  const { loading, error, data } = useFetch<ApiKeyHidden[]>(
    APIKEYS_ENDPOINT,
    "apikeys"
  );

  const [detailedKeys, setDetailedKeys] = useState<ApiKeyDetailWithToggle[]>(
    []
  );
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

  const colHelper = createColumnHelper<ApiKeyDetailWithToggle>();

  const columns = useMemo(() => {
    return [
      colHelper.accessor("id", {
        header: "ID",
      }),
      colHelper.accessor("key", {
        header: "API Key",
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
        header: "Show / Hide Key",
        cell: (info) => {
          const isVisible = info.getValue();
          return (
            <VisibilityToggleButton
              isVisibleDefault={isVisible}
              name="toggle API key visibility"
              onChange={(vis: boolean) => {
                getApiKeyFromId(info.row.original.id, vis);
              }}
            />
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
      <h2>API Keys</h2>
      <div className={styles["table-container"]}>
        <TableX table={table} />
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
