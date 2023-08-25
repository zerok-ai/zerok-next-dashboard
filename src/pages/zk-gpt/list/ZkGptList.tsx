import { Button, MenuItem, Select } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_ISSUES_ENDPOINT } from "utils/endpoints";
import { GPT_LIST_INFERENCES_ENDPOINT } from "utils/gpt/endpoints";
import { type IssueDetail } from "utils/types";

import { type GptReplyWithScore } from "../ZkGptPrompter.utils";
import styles from "./ZkGptList.module.scss";

const PAGE_SIZE = 10;

export const CLUSTER = "d980180f-7314-451f-8cd0-0cd4516f3a00";

const ZkGptList = () => {
  const { data, fetchData, loading } =
    useFetch<GptReplyWithScore[]>("UserInferences");
  const { data: issues, fetchData: fetchIssues } =
    useFetch<IssueDetail[]>("issues");
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const helper = createColumnHelper<GptReplyWithScore>();
  const router = useRouter();
  const page = router.query.page ?? "1";
  useEffect(() => {
    if (selectedCluster) {
      fetchIssues(
        LIST_ISSUES_ENDPOINT.replace("{cluster_id}", CLUSTER)
          .replace("{range}", DEFAULT_TIME_RANGE)
          .replace("{limit}", "100")
          .replace("{offset}", "0")
      );
    }
  }, [selectedCluster]);

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  useEffect(() => {
    if (selectedIssue) {
      const params = `?limit=${PAGE_SIZE}&offset=${Number(page) - 1}`;
      fetchData(
        GPT_LIST_INFERENCES_ENDPOINT.replace(
          "{issue_id}",
          selectedIssue
        ).replace("{cluster_id}", CLUSTER as string) + params
      );
    }
  }, [selectedIssue, renderTrigger, router]);
  const columns = [
    helper.accessor("query", {
      header: "Query",
    }),
    helper.accessor("temerature", {
      header: "Temperature",
      size: 20,
    }),
    helper.accessor("userScore", {
      header: "Score",
      size: 20,
    }),
    helper.accessor("userComments", {
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
  const IssueSelector = () => {
    return (
      <Select
        style={{ minWidth: "250px" }}
        value={selectedIssue ?? ""}
        onChange={(va) => {
          if (va && va.target) {
            setSelectedIssue(va.target.value);
          }
        }}
      >
        {issues?.map((issue) => {
          return (
            <MenuItem value={issue.issue_hash} key={issue.issue_hash}>
              {issue.issue_title}
            </MenuItem>
          );
        })}
      </Select>
    );
  };
  const extras = [
    <IssueSelector key={"1"} />,
    <Link href="/zk-gpt" key={"2"}>
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
      <PaginationX itemsPerPage={PAGE_SIZE} totalItems={100} />
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
