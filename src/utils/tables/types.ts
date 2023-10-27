/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type ReactElement } from "react";

import { type TABLE_DEFAULT_ACTIONS } from "./constants";

export interface TableSortOptions {
  label: string;
  value: string;
  sort: "asc" | "desc";
}

export type TableActionType = (typeof TABLE_DEFAULT_ACTIONS)[number];

export interface TableActionItem<T> {
  label: ReactElement;
  onClick: (data: T) => void;
}

export type TableActionPropType<T> = {
  [x in TableActionType]?: {
    onClick: (data: T) => void;
  };
};
