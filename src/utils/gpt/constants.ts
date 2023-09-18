import { type ChatCommandType } from "./types";

export const CHAT_COMMANDS: ChatCommandType[] = [
  {
    label: "Switch context to this request",
    subtitle:
      "Switch to this request, all future queries will be based on this request",
    value: "/context",
  },
];

export const CHAT_COMMAND_CHARACTER = "/";

export const CHAT_TAG_CHARACTER = "@";
