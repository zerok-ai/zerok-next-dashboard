import { type ReactElement } from "react";

export interface TableActionListType<T> {
  label: ReactElement;
  onClick: (row: T) => void;
}
export interface APIResponse<T> {
  payload: T;
}
