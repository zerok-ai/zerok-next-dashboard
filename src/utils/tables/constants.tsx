import { Fragment, type ReactElement } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { HiNoSymbol } from "react-icons/hi2";

import { type TableActionType } from "./types";

export const TABLE_DEFAULT_ACTIONS = ["edit", "delete", "disable"] as const;

export const TABLE_ACTION_LABELS: Record<TableActionType, ReactElement> = {
  edit: (
    <Fragment>
      <HiOutlinePencil /> <span>Edit</span>
    </Fragment>
  ),
  delete: (
    <Fragment>
      <HiOutlineTrash /> <span>Delete</span>
    </Fragment>
  ),
  disable: (
    <Fragment>
      <HiNoSymbol /> <span>Disable</span>
    </Fragment>
  ),
};