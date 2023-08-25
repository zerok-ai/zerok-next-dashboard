import { z } from "zod";

export const gptFormSchema = z.object({
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

export type GptForm = z.infer<typeof gptFormSchema>;

export type GptReply = GptForm & {
  answer: string | null;
  key: string;
};

export interface GptReplyWithScore {
  temerature: number;
  userScore: number | null;
  userComments: string | null;
  answer: string | null;
  query: string;
};
