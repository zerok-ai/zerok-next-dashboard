import { type ChatCommandType, type ChatTagType } from "./types";

export const CHAT_PEOPLE: ChatTagType[] = [
  {
    label: "Varun",
    value: "Varun",
  },
  {
    label: "Shivam",
    value: "Shivam",
  },
  {
    label: "Mudit",
    value: "Mudit",
  },
  {
    label: "Samyukktha",
    value: "Samyukktha",
  },
  {
    label: "Avin",
    value: "Avin",
  },
  {
    label: "Rajeev",
    value: "Rajeev",
  },
];

export const CHAT_TEAMS: ChatTagType[] = [
  {
    label: "AllDevelopers",
    value: "AllDevelopers",
  },
  {
    label: "OnCall",
    value: "OnCall",
  },
  {
    label: "Devops",
    value: "Devops",
  },
  {
    label: "Frontend",
    value: "Frontend",
  },
  {
    label: "Backend",
    value: "Backend",
  },
];

export const CHAT_TAG = [
  {
    group: "People",
    list: CHAT_PEOPLE,
  },
  {
    group: "Teams",
    list: CHAT_TEAMS,
  },
];

// Remove users:
// Use this to remove specific users from this workspace
// Fetch new data:
// Use this to fetch data you think is missing
// Generate postmortem:
// Automatically generate a postmortem of this issue
// Watch workspace:
// Add this workspace to your watchlist

export const CHAT_COMMANDS: ChatCommandType[] = [
  {
    label: "Remove users",
    subtitle: "Use this to remove specific users from this workspace",
    value: "remove",
  },
  {
    label: "Fetch new data",
    subtitle: "Use this to fetch data you think is missing",
    value: "fetch",
  },
  {
    label: "Generate postmortem",
    subtitle: "Automatically generate a postmortem of this issue",
    value: "generate",
  },
  {
    label: "Watch workspace",
    subtitle: "Add this workspace to your watchlist",
    value: "watch",
  },
];

export const CHAT_COMMAND_CHARACTER = "/";

export const CHAT_TAG_CHARACTER = "@";
