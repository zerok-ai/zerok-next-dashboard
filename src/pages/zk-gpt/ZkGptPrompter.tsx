import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  OutlinedInput,
  Skeleton,
  TextareaAutosize,
} from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import { nanoid } from "nanoid";
import Head from "next/head";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./ZkGptPrompter.module.scss";

const gptFormSchema = z.object({
  query: z.string().min(1, "Prompt cant be empty"),
  issueId: z.string().min(1, "IssueId cant be empty"),
  temperature: z
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= 0 && n <= 1),
  topK: z
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= 0),
  gptModel: z.string().min(1),
  vectorEmbeddingModel: z.string().min(1),
});

export const gptFormKeys = Object.keys(gptFormSchema.shape);

type GptForm = z.infer<typeof gptFormSchema>;

type GptReply = GptForm & {
  answer: string | null;
};

const FIELDS: Array<{
  label: string;
  key: keyof GptForm;
  type: "text" | "number";
}> = [
  {
    label: "Issue ID",
    key: "issueId",
    type: "text",
  },
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

const ZkGptPrompter = () => {
  const [replies, setReplies] = useState<GptReply[]>([]);
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
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;
  const onSubmit = (data: GptForm) => {
    console.log({ data });
    setReplies((prev) => [...prev, { ...data, answer: null }]);
  };
  console.log({ replies, errors });
  return (
    <Fragment>
      <PageHeader
        title="ZK GPT Prompter"
        showRange={false}
        showRefresh={false}
        showBreadcrumb={false}
      />
      <div className={styles.container}>
        <div className={styles["replies-container"]}>
          {replies.length > 0 &&
            replies.map((rp) => {
              return (
                <div className={styles["reply-container"]} key={nanoid()}>
                  <div className={styles["query-card"]}>
                    <p>
                      <span>Query</span> - {rp.query}
                    </p>
                  </div>
                  <div className={styles["reply-card"]}>
                    {rp.answer ? (
                      <p>
                        <span>Response - </span>
                        {rp.answer}
                      </p>
                    ) : (
                      <Skeleton variant="text" width="100%" height="80px" />
                    )}
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
