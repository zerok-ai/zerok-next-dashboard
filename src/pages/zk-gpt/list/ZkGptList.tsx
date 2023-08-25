import { Button } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

import { type GptReplyWithScore } from "../ZkGptPrompter.utils";
import styles from "./ZkGptList.module.scss";

const ZkGptList = () => {
  const { data, loading } = useFetch<GptReplyWithScore[]>("data");
  const helper = createColumnHelper<GptReplyWithScore>();
  useEffect(() => {
    // fetchData("/v1/c/gpt/issues/observation");
  }, []);
  const columns = [
    helper.accessor("query", {
      header: "Query",
    }),
    helper.accessor("temperature", {
      header: "Temperature",
      size: 20,
    }),
    helper.accessor("score", {
      header: "Score",
      size: 20,
    }),
    helper.accessor("comments", {
      header: "Comments",
    }),
    helper.accessor("answer", {
      header: "Answer",
    }),
  ];
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const extras = [
    <Link href="/zk-gpt" key={nanoid()}>
      <Button variant="contained">New prompt</Button>
    </Link>,
  ];
  return (
    <div>
      <PageHeader
        title="ZK GPT Prompt List"
        showRange={false}
        extras={extras}
        showRefresh={true}
      />
      <div className={styles.container}>
        {loading ? (
          <CustomSkeleton len={8} />
        ) : (
          <TableX table={table} data={data ?? []} />
        )}
      </div>
    </div>
  );
};

ZkGptList.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | ZK GPT Prompter</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ZkGptList;
