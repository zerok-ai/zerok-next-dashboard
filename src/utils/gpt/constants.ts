import { type GenericObject } from "utils/types";

import { type ChatCommandType } from "./types";

export const CHAT_COMMAND_CHARACTER = "/";

export const CHAT_TAG_CHARACTER = "@";

export const CHAT_EVENTS = {
  CONTEXT_SWITCH: "CONTEXT_SWITCH" as const,
  INFERENCE: "INFERENCE" as const,
  QUERY: "QNA" as const,
  LIKELY_CAUSE: "LIKELY_CAUSE" as const,
  INVALID: "INVALID" as const,
  TAG: "TAG" as const,
  POSTMORTEM: "POSTMORTEM" as const,
  HISTORY: "HISTORY" as const,
};

export const CHAT_EVENT_ENUM = [
  CHAT_EVENTS.CONTEXT_SWITCH,
  CHAT_EVENTS.INFERENCE,
  CHAT_EVENTS.QUERY,
  CHAT_EVENTS.LIKELY_CAUSE,
  CHAT_EVENTS.INVALID,
  CHAT_EVENTS.TAG,
  CHAT_EVENTS.POSTMORTEM,
  CHAT_EVENTS.HISTORY,
] as const;

export const CHAT_COMMANDS: ChatCommandType[] = [
  {
    label: "Switch context",
    subtitle:
      "Switch to this request, all future queries will be based on this request",
    value: `/${CHAT_EVENTS.CONTEXT_SWITCH}`,
  },
  {
    label: "Infer",
    subtitle: "Analyse this request",
    value: `/${CHAT_EVENTS.INFERENCE}`,
  },
  {
    label: "Generate Postmortem",
    subtitle: "Automatically generate a postmortem of this issue",
    value: `/${CHAT_EVENTS.POSTMORTEM}`,
  },
];

export const GPT_PAST_EVENT_PAGE_COUNT = 50;

export const SLACK_ITEMS: GenericObject = [
  {
    label: "Teams",
    disabled: true,
  },
  {
    label: "Product",
  },
  {
    label: "Engineering",
  },
  {
    label: "Sales",
  },
  {
    divider: true,
  },

  {
    label: "People",
    disabled: true,
  },
  {
    divider: true,
  },
  {
    label: "Samyukktha",
  },
  {
    label: "Varun",
  },
  {
    label: "Mudit",
  },
  {
    label: "Shivam",
  },
  {
    label: "Avin",
  },
  {
    label: "Vaibhav",
  },
  {
    label: "Nikhil",
  },
];
