/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type ReactElement } from "react";

import { type TABLE_DEFAULT_ACTIONS } from "./constants";

export interface TableSortOptions {
  label: string;
  value: string;
  sort: "asc" | "desc";
}

export type TableActionType = (typeof TABLE_DEFAULT_ACTIONS)[number];

export interface TableActionItem {
  onClick: () => void;
  element: ReactElement;
}

export type TableActionPropType<T> = {
  [x in TableActionType]?: {
    onClick: (data: T) => void;
  };
};

export interface TableColumnItems<T> {
  header: string;
  columnType: "accessor" | "display";
  accessor?: keyof T | null;
  renderType?: "link" | "date";
  size: number;
  customClassName?: string;
  customRender: (data: T) => ReactElement;
};
