import { type ChatCommandType } from "./types";

export const CHAT_COMMAND_CHARACTER = "/";

export const CHAT_TAG_CHARACTER = "@";

export const CHAT_EVENTS = {
  CONTEXT_SWITCH: "CONTEXT_SWITCH" as const,
  INFERENCE: "INFERENCE" as const,
  QUERY: "QNA" as const,
  LIKELY_CAUSE: "LIKELY_CAUSE" as const,
  INVALID: "INVALID" as const,
};

export const CHAT_EVENT_ENUM = [
  CHAT_EVENTS.CONTEXT_SWITCH,
  CHAT_EVENTS.INFERENCE,
  CHAT_EVENTS.QUERY,
  CHAT_EVENTS.LIKELY_CAUSE,
  CHAT_EVENTS.INVALID,
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
];

export const GPT_PAST_EVENT_PAGE_COUNT = 20;
