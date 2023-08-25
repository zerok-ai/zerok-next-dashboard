import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Slider,
  TextareaAutosize,
} from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import ModalX from "components/themeX/ModalX";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_ISSUES_ENDPOINT } from "utils/endpoints";
import {
  GPT_FEEDBACK_ENDPOINT,
  GPT_PROMPT_OBSERVABILITY_ENDPOINT,
} from "utils/gpt/endpoints";
import { GENERIC_AVATAR, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";
import raxios from "utils/raxios";
import { type IssueDetail } from "utils/types";

import styles from "./ZkGptPrompter.module.scss";
import { type GptForm, gptFormSchema } from "./ZkGptPrompter.utils";

export const gptFormKeys = Object.keys(gptFormSchema.shape);

const CLUSTER = "d980180f-7314-451f-8cd0-0cd4516f3a00";

type GptReply = GptForm & {
  answer: string | null;
  key: string;
};

const FIELDS: Array<{
  label: string;
  key: keyof GptForm;
  type: "text" | "number";
}> = [
  {
    label: "Temperature",
    key: "temperature",
    type: "number",
  },
  {
    label: "Top K",
    key: "topK",
    type: "number",
  },
  {
    label: "GPT Model",
    key: "gptModel",
    type: "text",
  },
  {
    label: "Vector Embedding Model",
    key: "vectorEmbeddingModel",
    type: "text",
  },
];

interface UserFormType {
  comments: string;
  score: number;
}

const ZkGptPrompter = () => {
  const [replies, setReplies] = useState<GptReply[]>([]);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const userForm = useForm<UserFormType>({
    defaultValues: {
      comments: "",
      score: 70,
    },
  });
  const { data: issues, fetchData: fetchIssues } = useFetch<IssueDetail[]>(
    "issues",
    "issues"
  );
  const { selectedCluster } = useSelector(clusterSelector);
  const form = useForm<GptForm>({
    defaultValues: {
      query: "",
      issueId: "",
      temperature: 0.2,
      topK: 100,
      gptModel: "gpt-3.5-turbo",
      vectorEmbeddingModel: "text-embedding-ada-002",
    },
    resolver: zodResolver(gptFormSchema),
  });
  const { handleSubmit: handleUserSubmit, register: userRegister } = userForm;
  const { handleSubmit, register } = form;
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
  const onSubmit = async (data: GptForm) => {
    setReplies((prev) => [...prev, { ...data, answer: null, key: nanoid() }]);
    try {
      const endpoint = GPT_PROMPT_OBSERVABILITY_ENDPOINT.replace(
        "{cluster_id}",
        CLUSTER as string
      );
      const rdata = await raxios.post(endpoint, data);
      const newReplies = [...replies];
      const index = newReplies.length - 1;
      newReplies[index].answer = rdata.data.payload.Answer;
      newReplies[index].key = rdata.data.payload.requestId;
      setReplies(newReplies);
    } catch (err) {
      console.log({ err });
    }
    form.reset();
  };
  const deleteReply = (key: string) => {
    setReplies((prev) => prev.filter((rp) => rp.key !== key));
  };
  const onUserSubmit = async (data: UserFormType) => {
    const reply = replies.find((rp) => rp.key === modalOpen);
    if (reply) {
      const body = {
        requestId: reply.key,
        score: data.score,
        feedback: data.comments,
      };
      try {
        await raxios.post(
          GPT_FEEDBACK_ENDPOINT.replace(
            "{cluster_id}",
            selectedCluster as string
          ),
          body
        );
        setModalOpen(null);
        userForm.reset();
      } catch (err) {
        console.log({ err });
        alert("Couldnt submit feedback, call the devs");
      }
    }
  };

  const extras = [
    <Link href="/zk-gpt/list" key={nanoid()}>
      <Button>History</Button>
    </Link>,
  ];
  return (
    <Fragment>
      <ModalX
        isOpen={!!modalOpen}
        onClose={() => {
          setModalOpen(null);
        }}
        title="Feedback form"
        customClassName={styles.modal}
      >
        <form
          className={styles["feedback-form"]}
          onSubmit={handleUserSubmit(onUserSubmit)}
        >
          <div className={styles["form-field"]}>
            <label htmlFor="comments">Comments:</label>
            <TextareaAutosize
              className={styles["text-area"]}
              {...userRegister("comments")}
              minRows={3}
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="score">Score:</label>
            <Slider
              defaultValue={70}
              valueLabelDisplay="on"
              onChange={(e, val) => {
                console.log({ val });
                userForm.setValue("score", val as number);
              }}
            />
          </div>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </ModalX>
      <PageHeader
        title="ZK GPT Prompter"
        showRange={false}
        showRefresh={false}
        showBreadcrumb={false}
        extras={extras}
      />
      <div className={styles.container}>
        <div className={styles["replies-container"]}>
          {replies.length > 0 &&
            replies.map((rp) => {
              return (
                <div className={styles["reply-container"]} key={nanoid()}>
                  <div className={styles["query-card"]}>
                    <img src={GENERIC_AVATAR} alt="user" />
                    <p> {rp.query}</p>
                  </div>
                  <div className={styles["reply-card"]}>
                    {rp.answer ? (
                      <Fragment>
                        <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chat_logo" />
                        <p>{rp.answer}</p>
                      </Fragment>
                    ) : (
                      <Skeleton variant="text" width="100%" height="80px" />
                    )}
                  </div>
                  <div className={styles["buttons-div"]}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setModalOpen(rp.key);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      color="error"
                      onClick={() => {
                        deleteReply(rp.key);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  <Divider />
                </div>
              );
            })}
        </div>
        <Divider />
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["form-fields"]}>
              <div className={styles["field-container"]}>
                <label htmlFor="issueId">Issue:</label>
                <Select
                  {...register("issueId")}
                  size="small"
                  value={form.watch("issueId")}
                  className={styles.select}
                  onChange={(e) => {
                    if (e && e.target && e.target.value) {
                      form.setValue("issueId", e.target.value);
                    }
                  }}
                >
                  {issues?.length &&
                    issues.map((issue) => {
                      return (
                        <MenuItem
                          value={issue.issue_hash}
                          key={issue.issue_hash}
                        >
                          {issue.issue_title}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              {FIELDS.map((field) => {
                return (
                  <div className={styles["field-container"]} key={field.key}>
                    <label htmlFor={field.key}>{field.label}:</label>
                    <OutlinedInput
                      inputProps={{ step: "any" }}
                      size="small"
                      type={field.type}
                      {...register(field.key)}
                    />
                  </div>
                );
              })}
            </div>
            {/* QUERY */}
            <div className={styles["query-container"]}>
              <label>Query:</label>
              <div className={styles["query-input-container"]}>
                <TextareaAutosize
                  className={styles["text-area"]}
                  {...register("query")}
                  minRows={3}
                />
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

ZkGptPrompter.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | ZK GPT Prompter</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ZkGptPrompter;
