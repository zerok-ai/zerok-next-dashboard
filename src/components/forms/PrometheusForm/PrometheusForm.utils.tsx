import { z } from "zod";

export const PromFormSchema = z.object({
  name: z.string().nonempty("Name cannot be empty"),
  url: z
    .string()
    .nonempty("URL cannot be empty")
    .url("Please enter a valid URL"),
  username: z.string(),
  password: z.string(),
  level: z.enum(["cluster", "org"]),
});

export type PromFormSchemaType = z.infer<typeof PromFormSchema>;
