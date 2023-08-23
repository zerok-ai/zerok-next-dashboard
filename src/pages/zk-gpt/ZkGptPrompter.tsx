import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  OutlinedInput,
  Skeleton,
  Slider,
  TextareaAutosize,
} from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import ModalX from "components/themeX/ModalX";
import { nanoid } from "nanoid";
import Head from "next/head";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { GENERIC_AVATAR, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";
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
  key: string;
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
      score: 0,
    },
  });
  const form = useForm<GptForm>({
    defaultValues: {
      query: "some query",
      issueId: "some issue id",
      temperature: 0.2,
      topK: 100,
      gptModel: "gpt-3.5-turbo",
      vectorEmbeddingModel: "text-embedding-ada-002",
    },
    resolver: zodResolver(gptFormSchema),
  });
  const { handleSubmit: handleUserSubmit, register: userRegister } = userForm;
  const { handleSubmit, register } = form;
  const onSubmit = (data: GptForm) => {
    console.log({ data });
    setReplies((prev) => [
      ...prev,
      { ...data, answer: "some answer", key: nanoid() },
    ]);
    form.reset();
  };
  const deleteReply = (key: string) => {
    setReplies((prev) => prev.filter((rp) => rp.key !== key));
  };
  const onUserSubmit = (data: UserFormType) => {
    const reply = replies.find((rp) => rp.key === modalOpen);
    if (reply) {
      const body = {
        uuid: reply.key,
        score: data.score,
        comments: data.comments,
      };
      console.log({ body });
      setModalOpen(null);
      userForm.reset();
    }
  };
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
