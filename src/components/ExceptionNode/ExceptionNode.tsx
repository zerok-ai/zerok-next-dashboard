import cx from "classnames";
import { nanoid } from "nanoid";
import { Handle, type NodeProps, Position } from "reactflow";
import { type SpanDetail } from "utils/types";

import styles from "./ExceptionNode.module.scss";

interface ExceptionNodeProps extends NodeProps {
  selectedSpan?: SpanDetail | null;
}

const ExceptionNode = ({ data, selectedSpan }: ExceptionNodeProps) => {
  return (
    <div
      className={cx(
        styles.container,
        selectedSpan && selectedSpan.source === data.source && styles.selected
      )}
    >
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} id={nanoid()} />
    </div>
  );
};

export default ExceptionNode;
