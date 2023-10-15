import { z } from "zod";

export const probeFormSchema = z.object({
  cards: z.array(
    z.object({
      rootProperty: z.string().min(1, "Service cannot be empty"),
      conditions: z.array(
        z.object({
          property: z.string().min(1, "Property cannot be empty"),
          datatype: z.string().min(1, "Datatype cannot be empty"),
          operator: z.string().min(1, "Operator cannot be empty"),
          value: z.string().min(1, "Value cannot be empty"),
          json_path: z
            .string()
            .regex(/^(?!.*\.$)\w*(\.\w*)*$/, "Please enter a valid JSON path")
            .optional(),
        })
      ),
    })
  ),
  groupBy: z.array(
    z.object({
      service: z.string().min(1, "Service cannot be empty"),
      property: z.string().min(1, "Property cannot be empty"),
    })
  ),
  name: z.string().min(1, "Probe name cannot be empty"),
  sampling: z.object({
    samples: z.coerce.string().min(1, "Samples cannot be empty"),
    duration: z.coerce.string().min(1, "Duration cannot be empty"),
    metric: z.string().min(1, "Metric cannot be empty"),
  }),
});

export type probeFormSchemaType = z.infer<typeof probeFormSchema>;

export type ConditionOperatorType =
  | {
      label: string;
      value: string;
      divider?: boolean;
      title?: string;
      disabled?: boolean;
    }
  | {
      label?: string;
      value?: string;
      divider: boolean;
      title?: string;
      disabled?: boolean;
    }
  | {
      label?: string;
      value?: string;
      divider?: boolean;
      title: string;
      disabled: boolean;
    };
