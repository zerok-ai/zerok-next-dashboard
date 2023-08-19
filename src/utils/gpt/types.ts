export interface ChatCommandType {
  label: string;
  value: string;
  subtitle: string;
}

export interface ChatTagType {
  label: string;
  value: string;
}

export interface ChatTagGroupType {
  group: string;
  list: ChatTagType[];
}
