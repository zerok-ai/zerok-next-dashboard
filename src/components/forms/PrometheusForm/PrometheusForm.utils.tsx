import { z } from "zod";

export const PROMETHEUS_LEVELS = ["cluster", "org"] as const;

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

export const PROM_LEVEL_OPTIONS: Array<{
  value: (typeof PROMETHEUS_LEVELS)[number];
  label: string;
}> = [
  {
    value: "cluster",
    label: "Cluster",
  },
  {
    value: "org",
    label: "Organization",
  },
];
